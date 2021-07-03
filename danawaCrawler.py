import requests
import json
from bs4 import BeautifulSoup

logfile = open('log.txt', 'a', encoding='utf8')

def printLog(str) :
	print(str, flush=True)
	logfile.write(str + '\n')
	return

def getCategoryList() :
	categoryList = []
	for i in range(10, 21):
		f = open(str(i), 'rt', encoding='utf-8')
		fileData = f.read()
		soup = BeautifulSoup(fileData, 'html.parser')

		for ul in soup.findAll('ul', attrs= {'class': 'depth1_list depth1_list2 depth1_list3'}):
			for a in ul.findAll('a'):
				categoryList.append(a['href'].split('&')[0])

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
	if (len(soup.findAll('script')) == 1):
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

def getPcode(params):
    pCodeList = []
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
            pCodeList.append({
				'link': a[i]['href'].split('&')[0],
				'category': a[i]['href'].split('&')[1],
			})

    with open('productData.json', 'a') as file:
        for pCode in pCodeList:
            file.write('\t')
            json.dump(pCode, file)
            file.write(',\n')

    logfile.flush()
    return

categoryList = getCategoryList()

for category in categoryList:
	printLog(category)
	getPcode(getParams(category))
