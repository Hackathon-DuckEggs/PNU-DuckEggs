const request = require('request')
const cheerio = require('cheerio')

/*
    쇼핑몰 리뷰를 크롤링합니다.
    해당 페이지의 리뷰 문자열 배열을 반환합니다.
    더 이상 없는 경우, 빈 배열을 반환합니다.
*/
function getMallReview(pCode, page = 1, review_per_page = 100)
{
    return new Promise((resolve, reject)=>{
        request({
            uri: `http://prod.danawa.com/info/dpg/ajax/companyProductReview.ajax.php?prodCode=${pCode}&page=${page}&limit=${review_per_page}`,
            method: "GET",
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        },function(error, response, body) {
            if(error)
                return reject(error)
            
            try{
                const $ = cheerio.load(body)
				let ret = Array.from($('.top_info')).map((v) => {
					return {
						'pCode': pCode,
						'date': $('.date', v).text(),
						'src': $('.mall', v).text(),
						'name': $('.name', v).text(),
					};
				})
				const contents = Array.from($('.atc')).map(v => $(v).text())
				for (let i = 0; i < ret.length; ++i)
					ret[i]['content'] = contents[i];
				/* resolve(ret.map((element) => {
					if (element['content'].length >= 30)
						return element
				})) */
				resolve(ret)
            }catch(e){
                reject(e)
            }
        })
    })
}

function getMallReviewCount(pCode)
{
    return new Promise((resolve, reject)=>{
        request({
            uri: `http://prod.danawa.com/info/dpg/ajax/companyProductReview.ajax.php?prodCode=${pCode}`,
            method: "GET",
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        }, function(error, response, body) {
            if(error)
                return reject(error)
            
            try{
                const $ = cheerio.load(body)
				const cnt = parseInt($($('.num_c')[1]).text().replace(/\,/g, ''))
                resolve(Number.isNaN(cnt) ? 0 : cnt)
            }catch(e){
                reject(e)
            }
        })
    })
}

async function getAllMallReview(pCode) {
	const totalCnt = await getMallReviewCount(pCode)
	let ret = []
	for (let i = 0; i < Math.min(3, totalCnt / 100 + (totalCnt % 100 ? 1 : 0)); ++i)
		ret = ret.concat(await getMallReview(pCode, i + 1, 100))
	return ret
}

module.exports = {
    getAllMallReview,
	getMallReviewCount
}