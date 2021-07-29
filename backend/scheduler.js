const schedule = require('node-schedule')
const mongoose = require('mongoose')
const { Product } = require('./model/Product')
const {getProductDetail} = require('./crawler/getProductDetail')

async function getMaxProductCode() {
	let db = mongoose.connection
	try {
		return (await db.collection('products').find({}).sort({'pCode' : -1}).limit(1).toArray())[0]['pCode']
	} catch(err) {
		console.log(err)
	}
}

async function correctNewProducts() {
	const maxProductCode = await getMaxProductCode()
	const newProductCodeList = Array.from({length: 99}, (v, i) => i + 1 + Number(maxProductCode))
	for (let newProductCode of newProductCodeList) {
		let newProduct = await getProductDetail(newProductCode)
		if (newProduct !== undefined) {
			const product = new Product(newProduct)
			try {
				await product.save()
			} catch (err) {
				console.log(err)
			}
		}
	}
}

async function runScheduler() {
	console.log('Run scheduler')
	const correctNewProductsJob = schedule.scheduleJob('0 0 * * *', correctNewProducts)
}

module.exports = {runScheduler}