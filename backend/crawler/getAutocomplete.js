const axios = require('axios')
const cheerio = require('cheerio')

async function getAutocomplete(queryString) {
	let params = new URLSearchParams()
	params.append('query', queryString)
	params.append('limit', 20)
	params.append('sort', 'saveDESC')
	params.append('page', 1)
	params.append('volumeType', 'vmvs')
	params.append('isZeroPrice', 'N')
	params.append('list', 'list')
	let headers = {
		"Referer" : `http://search.danawa.com/dsearch.php?k1=${encodeURI(queryString)}`,
		"User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36",
		"Accept" : "*/*",
		"Accept-Encoding" : "gzip, deflate",
		"Connection" : "keep-alive"
	}
	try {
		const res = await axios.post('http://search.danawa.com/ajax/getProductList.ajax.php', params, {headers})
		const $ = cheerio.load(res.data)
		
		let result = []
		$('li.prod_item').each((index, ele) => {
			const temp = $(ele).attr('id')
			if (temp !== undefined && !isNaN(Number(temp.split('productItem')[1]))) 
				result.push(Number(temp.split('productItem')[1]))
		})
		
		return result
	} catch (err) {
		return err
	}
}

module.exports = { getAutocomplete }