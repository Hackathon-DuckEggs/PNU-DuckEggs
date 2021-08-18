const axios = require('axios')
axios.defaults.timeout = 1000
const cheerio = require('cheerio')
const fs = require('fs')
const {getMallReviewCount} = require('./getMallReview')

const SLEEPTIME = 1000

let requestConfig = {
	headers: {
		"Referer" : "http://prod.danawa.com/info/?pcode=14810528",
		"User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36",
		"Accept" : "*/*",
		"Accept-Encoding" : "gzip, deflate, br",
		"Connection" : "keep-alive"
	}
}

function sleep(ms){
	return new Promise(resolve=>{
		setTimeout(resolve,ms)
	})
}

async function printLog(log) {
	console.log(log)
	fs.appendFileSync('log.txt', log + '\n')
}

async function readCategoryMappingData() {
	let data = await fs.readFileSync(__dirname + '\\categoryMapping.json', 'utf8')
	return JSON.parse(data)
}
/* async function getReviewList(pCode) {
	let reviewList = []
	while(true) {
		try {
			let res = await axios.get('http://prod.danawa.com/info/dpg/ajax/community.ajax.php?prodCode=' + String(pCode) + '&boardSeq=28%3E&page=1&limit=300', requestConfig)
			const $ = cheerio.load(res.data)
			$('div.comty_newsroom_item').children('a').each((i, el) => {
				reviewList.push(Number(el.attribs['id'].split('-')[4]))
			})
		} catch(err) {
			await printLog(`Exception raised on getReviewList(${pCode})`)
			fs.appendFileSync('err.txt', `[${pCode}]\n${err}\n`)
			await sleep(SLEEPTIME)
			continue
		}
		break
	}
	return reviewList
} */

async function getNumberOfOpinion(pCode) {
	let numberOfOpinion = 0
	while(true) {
		try {
			let res = await axios.get('http://prod.danawa.com/info/dpg/ajax/productOpinion.ajax.php?prodCode=' + String(pCode), requestConfig)
			const $ = cheerio.load(res.data)
			$('li.tab_item').children('a').each((i, el) => {
				numberOfOpinion += Number($('strong', el).text().replace(/\,/gi, ''))
			})
		} catch(err) {
			await printLog(`Exception raised on getNumberOfOpinion(${pCode})`)
			fs.appendFileSync('err.txt', `[${pCode}]\n${err}\n`)
			await sleep(SLEEPTIME)
			continue
		}
		break
	}
	return numberOfOpinion
}

async function getInfo(pCode) {
	let ret = {}
	let res
	while(true) {
		try {
			res = await axios.post('http://prod.danawa.com/info/?pcode=' + String(pCode), null, requestConfig)
			const $ = cheerio.load(res.data)
			ret['title'] = $('h3.prod_tit').text().replace(/\t/g, ' ').replace(/\s{2,}/g, ' ').replace(/\x1d/g, '').replace(/\\/g, '').trim()
			if (ret['title'] == '')
				return

			let categoryString= ''
			for (let e of res.data.split('_TRK_PNG_NM="')[1].split('";')[0].split('^')) 
				categoryString = categoryString.concat(e, ":::")

			let categoryMappingData = await(readCategoryMappingData())
			for (let e of categoryMappingData) {
				if (Object.keys(e)[0] == categoryString)
					categoryString = e[categoryString]
			}
			ret['category'] = categoryString

			ret['specs'] = {
				'제조회사' : $('div.made_info span#makerTxtArea').text().split('\n')[1].trim(),
				'등록년월' : $('div.made_info span.txt').html().split(' ')[1]
			}
		} catch(err) {
			printLog(`Exception raised on getInfo(${pCode}) title,category`)
			fs.appendFileSync('err.txt', `[${pCode}]\n${err}\n`)
			await sleep(SLEEPTIME)
			continue
		}
		break
	}

	// params 전처리
	let params = new URLSearchParams();
	params.append('pcode', pCode)
	for (let e of res.data.split('var oGlobalSetting = {')[1].split(';')[0].split(',')) {
		if (e.indexOf('nCategoryCode1') != -1)
			params.append('cate1', e.trim().split(':')[1].split('"')[1])
		else if (e.indexOf('nCategoryCode2') != -1)
			params.append('cate2', e.trim().split(':')[1].split('"')[1])
		else if (e.indexOf('nCategoryCode3') != -1)
			params.append('cate3', e.trim().split(':')[1].split('"')[1])
		else if (e.indexOf('nCategoryCode4') != -1)
			params.append('cate4', e.trim().split(':')[1].split('"')[1])
	}
	
	while(true) {
		try {
			let res = await axios.post('http://prod.danawa.com/info/ajax/getProductDescription.ajax.php', params, requestConfig)
			const $ = cheerio.load(res.data)

			let ignoreTitle = ['', '적합성평가인증', '안전확인인증', '제조회사', '등록년월']
			for (let i = 0; i < $('th.tit').length; ++i) {
				let title = $('th.tit').eq(i).text().trim().replace(/\./gi, '\\DOT')
				if (ignoreTitle.indexOf(title) != -1)
					continue

				let desc = $('td.dsc').eq(i).text().trim()
				if (desc == '○')
					desc = true
				ret['specs'][title] = desc
			}
		} catch(err) {
			await printLog(`Exception raised on getInfo(${pCode}) specs`)
			fs.appendFileSync('err.txt', `[${pCode}]\n${err}\n`)
			await sleep(SLEEPTIME)
			continue
		}
		break
	}

	return ret
}

async function getProductDetail(pCode) {
	let productDetail = {
		'pCode': pCode,
		'analyzed' : 0
	}

	let info = await getInfo(pCode)
	if (info === undefined)
		return
	Object.assign(productDetail, info)
	// productDetail['reviewList'] = await getReviewList(pCode)
	productDetail['weight'] = await getNumberOfOpinion(pCode)
	productDetail['reviewCnt'] = await getMallReviewCount(pCode)
	
	return productDetail
}

module.exports = {getProductDetail}