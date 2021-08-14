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
                resolve(Array.from($('.atc')).map(v=>$(v).text()))
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
                resolve(parseInt($($('.num_c')[1]).text().replace(/\,/g, '')))
            }catch(e){
                reject(e)
            }
        })
    })
}

module.exports = {
    getMallReview,
    getMallReviewCount,
}