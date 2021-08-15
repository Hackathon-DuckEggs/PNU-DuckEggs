const axios = require('axios')

async function uploadToES(productList) {
	let queryBody = ''
	for (let product of productList) {
		queryBody += `{ "index":{ "_index" : "auto_complete", "_type" : "_doc", "_id" : ${product.pCode} } }\n`
		queryBody += `{ "title": "${product.title.replace(/\"/g, '\\"')}"}\n`
	}
	const bulkRes = await axios.put('http://localhost:55555/_bulk?pretty', queryBody, { headers: {'Content-Type': 'application/json'} })
	if (bulkRes.data.errors == true) 
		console.log(`[ERROR] on skipCount${skipCount}! retrying!`)
	return bulkRes.data.errors
}

module.exports = { uploadToES }