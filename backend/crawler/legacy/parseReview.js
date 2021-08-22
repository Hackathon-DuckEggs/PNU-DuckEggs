const request = require('request')
const cheerio = require('cheerio')

function sleep(ms)
{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve()
        },ms)
    })
}

function parseReview(code)
{
    return new Promise((resolve, reject)=>{
        request({
            uri: `https://dpg.danawa.com/bbs/view?boardSeq=28&listSeq=${code}`,
            method: "GET",
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        },function(error, response, body) {
            if(error)
                return reject(error)
            
            try{
                const $ = cheerio.load(body)
                resolve($('#danawacommunitybbsViewboardcontent').text().replace(/\s+/g, ' '))
            }catch(e){
                reject(e)
            }
        })
    })
}

module.exports.parseReview = parseReview