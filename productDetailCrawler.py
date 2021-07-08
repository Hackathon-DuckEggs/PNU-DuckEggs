import requests
import json
import time
from datetime import datetime 
from bs4 import BeautifulSoup

logfile = open('log.txt', 'a', encoding='utf8')
requestHeader = {
	"Referer" : "http://prod.danawa.com/",
	"User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"
}

def printLog(str) :
	print('[' + datetime.now().strftime('%y/%m/%d/%H/%M/%S') + ']' + str, flush=True)
	logfile.write('[' + datetime.now().strftime('%y/%m/%d/%H/%M/%S') + ']' + str + '\n')
	logfile.flush()
	return

def getProductInfo(pCode):
	productInfo = {}

	while(True):
		try :
			res = requests.post('http://prod.danawa.com/info/?pcode=' + pCode, headers = requestHeader)
		except:
			printLog('Exception occured on getCategoryList()')
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
		printLog("Exception: internalCategoryInfo's length is not '2' (" + pCode + ")")

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
			printLog('Exception occured on getCategoryList()')
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

	return productInfo

def getReviewList(pCode):
	# review 목록 가져옴
	while(True):
		try :
			res = requests.get('http://prod.danawa.com/info/dpg/ajax/community.ajax.php?prodCode=' + pCode + '&boardSeq=28%3E&page=1&limit=300', headers = requestHeader)
		except:
			printLog('Exception occured on getCategoryList()')
			time.sleep(5)
			continue
		break
	soup = BeautifulSoup(res.text, "html.parser")

	reviewList = []
	for item in soup.findAll('div', attrs= {'class': 'comty_newsroom_item'}):
		reviewList.append(item.find('a')['id'].split('-')[4])

	return reviewList

if __name__=='__main__':
	with open('productData.json', 'r') as file:
		productList = json.load(file)

	for i, item in enumerate(productList):
		ret = getProductInfo(str(item['pCode']))
		if (ret is None):
			continue
		ret['reviewList'] = getReviewList(str(item['pCode']))
		ret['pCode'] = item['pCode']
		printLog(str(i) + ' 번째 : ' + str(item['pCode']))
		with open('productDetailData.json', 'a', encoding='utf8') as file:
			file.write('\t')
			json.dump(ret, file, ensure_ascii=False)
			file.write(',\n')