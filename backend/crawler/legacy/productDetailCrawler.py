import requests
import json
import time
import sys
from datetime import datetime 
from bs4 import BeautifulSoup
from multiprocessing import Pool

logfile = open('log.txt', 'a', encoding='utf8')
requestHeader = {
	"Referer" : "http://prod.danawa.com/",
	"User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"
}

def printLog(str) :
	logfile.write('[' + datetime.now().strftime('%y/%m/%d/%H/%M/%S') + ']' + str + '\n')
	logfile.flush()
	return

def getProductInfo(pCode, index):
	productInfo = {}
	productInfo['pCode'] = int(pCode)


	while(True):
		try :
			res = requests.post('http://prod.danawa.com/info/?pcode=' + pCode, headers = requestHeader)
		except:
			printLog(f'Exception occured on {pCode} getCategoryList() info')
			time.sleep(5)
			continue
		break
	soup = BeautifulSoup(res.text, 'html.parser')

	# 상품 명
	if (soup.find('h3', attrs= {'class': 'prod_tit'}) is None):
		return
	productInfo['title'] = soup.find('h3', attrs= {'class': 'prod_tit'}).text

	# 카테고리
	settingIndex = -1
	for i, e in enumerate(soup.findAll('script')):
		if (str(e).find('_TRK_PNG_NM') != -1):
			settingIndex = i
			break

	productInfo['categories'] = str(soup.findAll('script')[settingIndex]).split('_TRK_PNG_NM="')[1].split('";')[0].split('^')

	# post data 전처리
	settingIndex = -1
	for i, e in enumerate(soup.findAll('script')):
		if (str(e).find('var oGlobalSetting = {') != -1):
			settingIndex = i
			break
	temp = str(soup.findAll('script')[settingIndex]).split('var oGlobalSetting = {')[1].split(';')[0].split(',')
	internalCategoryInfo=[]
	for element in temp:
		if (element.find('nCategoryCode1') != -1):
			internalCategoryInfo.append(element.strip().split(':')[1].split('"')[1])
		elif (element.find('nCategoryCode2') != -1 and len(internalCategoryInfo) == 1):
			internalCategoryInfo.append(element.strip().split(':')[1].split('"')[1])
			break
	
	madeInfo = {}
	madeInfo['date'] = soup.find('div', attrs= {'class': 'made_info'}).find('span', attrs= {'class': 'txt'}).get_text().split(' ')[1]
	madeInfo['maker'] =  soup.find('div', attrs= {'class': 'made_info'}).find('span', attrs= {'id': 'makerTxtArea'}).get_text().split('\n')[1].strip()

	if len(internalCategoryInfo) != 2:
		printLog(f"Exception: {pCode} internalCategoryInfo's length is not '2' (" + pCode + ")")

	# 기타스펙
	while(True):
		try :
			res = requests.post('http://prod.danawa.com/info/ajax/getProductDescription.ajax.php', headers = requestHeader, data= {
				'pcode': pCode,
				'cate1': internalCategoryInfo[0],
				'cate2': internalCategoryInfo[1],
				'makerName': madeInfo['maker'],
				'displayMakeDate': madeInfo['date'],
			})
		except:
			printLog(f'Exception occured on {pCode} getCategoryList() 기타스펙')
			time.sleep(5)
			continue
		break
	soup = BeautifulSoup(res.text, 'html.parser')
	if (len(soup.findAll('th', attrs= {'class', 'tit'})) != len(soup.findAll('td', attrs= {'class', 'dsc'}))):
		printLog('Error on getProductInfo(' + pCode + ')')
		return

	productInfo['specs'] = {}
	for title, description in zip(soup.findAll('th', attrs= {'class', 'tit'}), soup.findAll('td', attrs= {'class', 'dsc'})):
		if (title.text.strip() == '' or title.text.strip() == '적합성평가인증' or title.text.strip() == '안전확인인증'):
			continue
		productInfo['specs'][title.text.strip()] = description.text.strip()

	# 상품의견 수
	while(True):
		try :
			res = requests.get('http://prod.danawa.com/info/dpg/ajax/productOpinion.ajax.php?prodCode=' + pCode, headers = requestHeader)
		except:
			printLog(f'Exception occured on {pCode} getCategoryList() 상품의견 수')
			time.sleep(5)
			continue
		break
	soup = BeautifulSoup(res.text, 'html.parser')

	productInfo['weight'] = 0
	for e in soup.findAll('strong', attrs= {'class' : 'num_c'}):
		productInfo['weight'] += int(e.text.replace(',', ''))

	return productInfo

def getReviewList(pCode, index):
	# review 목록 가져옴
	while(True):
		try :
			res = requests.get('http://prod.danawa.com/info/dpg/ajax/community.ajax.php?prodCode=' + pCode + '&boardSeq=28%3E&page=1&limit=300', headers = requestHeader)
		except:
			printLog(f'Exception occured on {pCode} getCategoryList()')
			time.sleep(5)
			continue
		break
	soup = BeautifulSoup(res.text, "html.parser")

	reviewList = []
	for item in soup.findAll('div', attrs= {'class': 'comty_newsroom_item'}):
		reviewList.append(int(item.find('a')['id'].split('-')[4]))

	return reviewList

def run(item):
	ret = getProductInfo(str(item['pCode']), item['index'])
	if (ret is None):
		return
	ret['reviewList'] = getReviewList(str(item['pCode']), str([item['index']]))
	return ret

if __name__=='__main__':
	pCodeList = []
	with open('productData.json', 'r') as file:
		cnt = 0
		while True:
			line = file.readline()
			if (line == ''):
				break
			data = json.loads(line.strip()[:-1])
			data['index'] = cnt
			pCodeList.append(data)
			cnt += 1

	sTime = datetime.now()
	print(sTime, flush=True)

	pool = Pool(processes=10)
	for i, ret in enumerate(pool.imap_unordered(run, pCodeList), 1):
		sys.stderr.write('\rdone {0:%}'.format(i/cnt))
		if (ret is not None):
			printLog(str(i) + 'th : ' + str(ret['pCode']))
			with open('productDetailData.json', 'a', encoding='utf8') as output:
				output.write('\t')
				json.dump(ret, output, ensure_ascii=False)
				output.write(',\n')

	
	eTime = datetime.now()
	print(eTime, flush=True)
	printLog(eTime-sTime, flush=True)