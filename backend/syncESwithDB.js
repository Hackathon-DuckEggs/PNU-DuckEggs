const mongoose = require('mongoose')
const { Product } = require('./model/Product')
const axios = require('axios')
const {uploadToES} = require('./uploadToES')

const BULK_SIZE = 1000

function sleep(ms){
	return new Promise(resolve=>{
		setTimeout(resolve,ms)
	})
}

async function waitThrottle(cnt) {
	while(true) {
		const res = await axios.get('http://localhost:55555/auto_complete/_stats/docs')
		if (res.data._all.primaries.docs.count >= cnt)
			break
		await sleep(1000)
	}
}

async function connectToDB() {
	const {mongoURI} = require('./config/key');
	return new Promise((resolve, reject) => {
		mongoose.connect(mongoURI, {
			useNewUrlParser : true,
			useUnifiedTopology : true,
			useCreateIndex : true,
			useFindAndModify : false,
		}).then(() => {
			resolve()
		}).catch((err) => {
			reject()
		})
	})
}

async function getProduct(skipCount) {
	return await Product.find({}, {_id: false, title: true, pCode: true, reviewCnt: true}, async (err, productInfo) => {
		if (err) console.log("Error on db")
		return productInfo
	}).skip(skipCount).limit(BULK_SIZE)
}

async function startApp() {
	await connectToDB()
	console.log('MongoDB connected!')

	const OFFSET = 0
	let skipCount = 0
	skipCount += OFFSET
	while(true) {
		try {
			const res = await getProduct(skipCount)
			if (res.length == 0)
				break
			console.log(`${skipCount} , running...`)
			const esRes = await uploadToES(res)

			if (esRes == true) 
				break
			console.log(`${skipCount} , sleepin...`)
			skipCount += BULK_SIZE
			await waitThrottle(skipCount)
		}
		catch (e) {

		}
	}
	
	return
}

startApp()
return