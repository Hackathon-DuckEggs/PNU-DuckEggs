const schedule = require('node-schedule')
const { Product } = require('./model/Product')
const { getProductDetail } = require('./getProductDetail')
const { uploadToES } = require('./uploadToES')

async function getMaxProductCode() {
	try {
		const result = await Product.find({}).sort({'pCode' : -1}).limit(1)
		return result[0]['pCode']
	} catch(err) {
		console.log(err)
	}
}

async function getNewProducts() {
	console.log("get New Product start")
	const maxProductCode = await getMaxProductCode()
	const newProductCodeList = Array.from({length: 999}, (v, i) => i + 1 + Number(maxProductCode))

	let successProductList = []
	for (let [i, newProductCode] of newProductCodeList.entries()) {
		let newProduct = await getProductDetail(newProductCode)
		if (newProduct !== undefined) {
			const product = new Product(newProduct)
			try {
				await product.save()
				console.log(`[${i}]${newProductCode}`)
				successProductList.push(newProduct)
			} catch (err) {
				console.log(err)
			}
		}
	}
	await uploadToES(successProductList)
	console.log("get New Product end")
}

async function runScheduler() {
	console.log('Run scheduler')
	const getNewProductsJob = schedule.scheduleJob('0 0 * * *', getNewProducts)
}


module.exports = {runScheduler}