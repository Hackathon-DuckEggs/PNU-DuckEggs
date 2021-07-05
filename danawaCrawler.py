import requests
import json
from concurrent.futures import ThreadPoolExecutor
from bs4 import BeautifulSoup

logfile = open('log.txt', 'a', encoding='utf8')
cnt = 0

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
	res = requests.get("http://www.danawa.com/globaljs/com/danawa/common/category/CategoryInfoByDepth.js.php?depth=3&_=1625405270955", headers = {
		"Referer" : "http://prod.danawa.com/",
		"User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"
	})
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

def getParams(categoryLink): 
	headers = {
		"User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"
	}
	res = requests.get(categoryLink, headers=headers)
	soup = BeautifulSoup(res.text, "html.parser")
	if (len(soup.findAll('script')) < 9):
		printLog('@@ ' + categoryLink)
		return
	if (len(str(soup.findAll('script')[8]).split('var oGlobalSetting = {')) < 2):
		printLog('!! ' + categoryLink)
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

def getLinkList(params):
    linkList = []
    headers = {
		"Referer" : "http://prod.danawa.com/",
		"User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"
	}

    res = requests.post("http://prod.danawa.com/list/ajax/getProductList.ajax.php", headers = headers, data=params)
    soup = BeautifulSoup(res.text, "html.parser")
    numOfProduct = int(str(soup.find('input', attrs = {'id': 'totalProductCount'})).split('\n')[0].split('value="')[1].split('"')[0].replace(',', ''))

    printLog('총' + str(numOfProduct // 90 + (0 if numOfProduct % 90 == 0 else 1)) + '페이지 입니다.')
    for i in range(1, numOfProduct // 90 + 1 + (0 if numOfProduct % 90 == 0 else 1)):
        printLog(str(i) + "페이지 입니다")
        params['page'] = i

        res = requests.post("http://prod.danawa.com/list/ajax/getProductList.ajax.php", headers = headers, data=params)
        soup = BeautifulSoup(res.text, "html.parser")
        a = soup.findAll("a", attrs = {"name":"productName"})
        for i in range(len(a)):
            linkList.append({
				'link': a[i]['href'].split('&')[0],
				'category': a[i]['href'].split('&')[1],
			})

    with open('productData.json', 'a') as file:
        for link in linkList:
            file.write('\t')
            json.dump(link, file)
            file.write(',\n')

    logfile.flush()
    return

def pararellExecute(f, t, categoryList):
	for i in range(f, t):
		printLog(str(i) + ' ' + categoryList[i])
		getLinkList(getParams(categoryList[i]))

if __name__=='__main__':
	categoryList = getCategoryList()

	printLog('총 ' + str(len(categoryList)) + '개 입니다.')

	cnt = 0
	for categoryLink in categoryList:
		printLog(str(cnt) + " 번째 " + categoryLink)
		cnt += 1
		getLinkList(getParams(categoryLink))