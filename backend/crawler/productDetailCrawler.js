const readline = require('line-by-line')
const fs = require('fs')
const {getProductDatail} = require('./getProductDetail')
process.env.UV_THREADPOOL_SIZE = 128

function sleep(ms){
	return new Promise(resolve=>{
		setTimeout(resolve,ms)
	})
}

async function pauseAndResume(reader, ms) {
	reader.pause()
	await sleep(ms)
	reader.resume()
}

function getTotalCount() {
	let totalCount = 0
	const reader = new readline('productData.json')
	reader.on('line', () => ++totalCount)
	return new Promise((resolve, reject) => {
		reader.on('end', () => resolve(totalCount))
	})
}

async function run() {
	const totalCount = await getTotalCount()
	const reader = new readline('productData.json')
	let delay = 80
	console.log(totalCount)
	let count = 0
	let wait = 0
	let completed = 0
	reader.on('line', async (line) => {
		if (wait - completed >= 150)
			delay = 5000
		else
			delay = 50
		++wait

		pauseAndResume(reader, delay)
		
		try{
			let jsonData = JSON.parse(line.replace(',', ''))
			const productDetail = await getProductDatail(Number(jsonData['pCode']))
			++completed
			if (productDetail === undefined)
				fs.appendFileSync('log.txt', `${++count}th : ${jsonData['pCode']}  is deprecated!\n`)
			else {
				fs.appendFileSync('productDetailData.json', `\t${JSON.stringify(productDetail)},\n`)
				fs.appendFileSync('log.txt', `${++count}th : ${jsonData['pCode']}  Done!\n`)
			}
		} catch(err) {
			++completed
			console.log(`Exception raised on ${count}, ${line}`)
			fs.appendFileSync('log.txt', `Exception raised on ${count}, ${line}\n`)
			fs.appendFileSync('err.txt', `${count} : ${line}\n${err}\n`)
		} finally {
			process.stderr.write(`\r${(count/totalCount * 100).toFixed(4)}%`)
		}
	})

	
	let start = new Date().toLocaleString()
	console.log(start)
	reader.on('end', async (line) => {
		let end = new Date().toLocaleString()
		console.log(end)
	})
}



run()