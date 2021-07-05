import requests
import json
import time
from bs4 import BeautifulSoup

logfile = open('log.txt', 'a', encoding='utf8')

def printLog(str) :
	print(str, flush=True)
	logfile.write(str + '\n')
	return

# 무시할 string이 카테고리 이름에 포함되어 있는지 check
def checkCategoryName(categoryName):
	# 무시할 카테고리 이름
	ignoreTitleList = ['ISSUE', 'BEST', '전체', '개학']

	# 무시할 카테고리 이름이 포함 되어 있는지 check
	ret = True
	for ignoreTitle in ignoreTitleList:
		if (ignoreTitle in categoryName):
			ret = False
	return ret

def getCategoryList() :
	# category 목록 request
	while(True):
		try :
			res = requests.get("http://www.danawa.com/globaljs/com/danawa/common/category/CategoryInfoByDepth.js.php?depth=3&_=1625405270955", headers = {
				"Referer" : "http://prod.danawa.com/",
				"User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"
			})
		except:
			printLog('Exception occured on getCategoryList()')
			time.sleep(5)
			continue
		break
	jsonObject = json.loads(res.text)
	
	categorySet = set()
	for category1 in jsonObject:
		# 여행 카테고리 제외
		if (category1 == '20'):
			continue
		# 2차 카테고리 크롤링
		for category2 in jsonObject[category1]['1'][0]:
			# 2차 카테고리 필터링
			if (jsonObject[category1]['1'][0][category2]['url'] == '' and jsonObject[category1]['1'][0][category2]['style'] == '' and checkCategoryName(jsonObject[category1]['1'][0][category2]['name'])):
				categorySet.add(int(category1 + '1' + str(jsonObject[category1]['1'][0][category2]['code'])))

		# 3차 카테고리 크롤링
		for category2 in range(2, 4):
			for category3 in jsonObject[category1][str(category2)]:
				if (int(category1 + str(category2 - 1) + category3) in categorySet):
					categorySet.remove(int(category1 + str(category2 - 1) + category3))
					for category4 in jsonObject[category1][str(category2)][category3]:
						if (checkCategoryName(jsonObject[category1][str(category2)][category3][category4]['name'])):
							categorySet.add(int(category1 + str(category2) + str(jsonObject[category1][str(category2)][category3][category4]['code'])))

	categoryList = []
	for category in categorySet:
		categoryList.append('http://prod.danawa.com/list/?cate=' + str(category))

	return categoryList

def getParam(list, text) :
	ret = -1
	for i in range(len(list)):
		if (list[i].find(text) != -1):
			ret = i
			break
	if (len(list[ret].split(':')[1].split('"')) == 3):
		return list[ret].split(':')[1].split('"')[1]
	else:
		return list[ret].split(':')[1]

# categoryLink에서 post data 얻어오기
def getParams(categoryLink): 
	while(True):
		try :
			res = requests.get(categoryLink, headers = {
				"User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"
			})
		except:
			printLog('Exception occured on getParams('+ categoryLink + ')')
			time.sleep(5)
			continue
		break

	soup = BeautifulSoup(res.text, "html.parser")
	# 성인인증 페이지
	if (len(soup.findAll('script')) < 9):
		printLog('Need Adult Authentication')
		return
	# 올바르지 않은 페이지
	if (len(str(soup.findAll('script')[8]).split('var oGlobalSetting = {')) < 2):
		printLog('Incorrect Page')
		return

	temp = str(soup.findAll('script')[8]).split('var oGlobalSetting = {')[1].split(';')[0].split(',')
	list = []
	for i in range(len(temp)):
		list.append(temp[i].strip())

	params = {}
	params['group'] = getParam(list, 'nGroup')
	params['depth'] = getParam(list, 'nDepth')
	params['categoryCode'] = getParam(list, 'nCategoryCode')
	params['page'] = 8 #
	params['listCategoryCode'] = getParam(list, 'nListCategoryCode')
	params['physicsCate1'] = getParam(list, 'sPhysicsCate1')
	params['physicsCate2'] = getParam(list, 'sPhysicsCate2')
	params['physicsCate3'] = getParam(list, 'sPhysicsCate3')
	params['physicsCate4'] = getParam(list, 'sPhysicsCate4')
	params['viewMethod'] = 'LIST'
	params['sortMethod'] = 'BEST'
	params['listCount'] = 90
	params['brandName'] = ''
	params['makerName'] = ''
	params['searchOptionName'] = ''
	params['sDiscountProductRate'] = 0
	params['sInitialPriceDisplay'] = 'N'
	params['sPowerLinkKeyword'] = getParam(list, 'sPowerLinkKeyword')
	params['oCurrentCategoryCode'] = str(soup.findAll('script')[8]).split('var oCurrentCategoryCode = "')[1].split('";')[0]
	params['innerSearchKeyword'] = ''
	params['listPackageType'] = 1
	params['categoryMappingCode'] = getParam(list, 'sCategoryMappingCode')
	params['priceUnit'] = 0
	params['priceUnitValue'] = 0
	params['priceUnitClass'] = ''
	params['cmRecommendSort'] = 'N'
	params['cmRecommendSortDefault'] = 'N'
	params['bundleImagePreview'] = 'N'
	params['nPackageLimit'] = 5
	params['nPriceUnit'] = 0
	params['isDpgZoneUICategory'] = 'N'
	params['sProductListApi'] = 'search'
	params['priceRangeMaxPrice'] = ''
	params['priceRangeMinPrice'] = ''
	params['btnAllOptUse'] = 'false'

	return params

def getPcodeList(params):
	if params is None:
		return
	pCodeList = []
	# 상품 페이지 수 얻어옴
	while(True):
		try:
			res = requests.post("http://prod.danawa.com/list/ajax/getProductList.ajax.php", data=params, headers = {
				"Referer" : "http://prod.danawa.com/",
				"User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"
			})
		except:
			printLog('Exception occured on getLinkList(' + params['categoryCode'] + ')')
			time.sleep(5)
			continue
		break

	soup = BeautifulSoup(res.text, "html.parser")
	numOfProduct = int(str(soup.find('input', attrs = {'id': 'totalProductCount'})).split('\n')[0].split('value="')[1].split('"')[0].replace(',', ''))
	numOfPage = numOfProduct // 90 + 1 + (0 if numOfProduct % 90 == 0 else 1)
	printLog('총' + str(numOfPage) + '페이지 입니다.')

	# 각 페이지마다 query를 날려 상품 list 얻어옴
	for i in range(1, numOfPage + 1):
		printLog(str(i) + "페이지 입니다")
		params['page'] = i

		while(True):
			try:
				res = requests.post("http://prod.danawa.com/list/ajax/getProductList.ajax.php", data=params,  headers = {
					"Referer" : "http://prod.danawa.com/",
					"User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"
				})
			except:
				printLog('Exception occured on getLinkList(' + params['categoryCode'] + ')\'s page ' + str(i))
				time.sleep(5)
				continue
			break

		soup = BeautifulSoup(res.text, "html.parser")
		a = soup.findAll("a", attrs = {"name":"productName"})
		for i in range(len(a)):
			pCodeList.append({
				'pCode': a[i]['href'].split('&')[0].split('=')[1],
			})

	# 얻어온 상품들 output
	with open('productData.json', 'a') as file:
		for pCode in pCodeList:
			file.write('\t')
			json.dump(pCode, file)
			file.write(',\n')

	logfile.flush()
	return

if __name__=='__main__':
	categoryList = getCategoryList()

	printLog('총 ' + str(len(categoryList)) + '개 입니다.')

	cnt = 0
	for categoryLink in categoryList:
		printLog(str(cnt) + " 번째 " + categoryLink)
		cnt += 1
		getPcodeList(getParams(categoryLink))