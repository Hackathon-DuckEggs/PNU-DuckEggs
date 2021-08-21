const fs = require('fs')
const readline = require('readline')
const mongoose = require('mongoose')

let categoryMappingData = []

async function readCategoryMapping() {
	let data = await fs.readFileSync('categoryMapping.json', 'utf8')
	categoryMappingData = JSON.parse(data)
}

function refineData(data) {
	let ret = {}
	ret['title'] = data['title']
	ret['pCode'] = Number(data['pCode'])

	ret['specs'] = {}
	for (let key in data['specs']) {
		let valueData = data['specs'][key]
		if (valueData == '○')
			valueData = true
		ret['specs'][key.replace(/\./gi, '[dot]')] = valueData
	}

	let categoryString= ''
	for (let i = 0; i < data['categories'].length; ++i) 
		categoryString = categoryString.concat(data['categories'][i], ":::")
	
	for (let e of categoryMappingData) {
		if (Object.keys(e)[0] == categoryString)
			categoryString = e[categoryString]
	}

	ret['category'] = categoryString

	return ret
}

async function readFile(filename) {
	let instream = fs.createReadStream(filename)
	let reader = readline.createInterface({input: instream, output: process.stdout, terminal: false})
	let resultData = []
	let count = 0
	reader.on('line', (line) => {
		line = line.substr(0, line.length - 1)
		let jsonData = JSON.parse(line)
		++count
		
		resultData.push(refineData(jsonData))
		if (count % 10000 == 0){
			console.log(count)
		}
	})
	return new Promise((resolve, reject) => {
		reader.on('close', () => {
			let db = mongoose.connection;
			db.collection('tests').insertMany(resultData)
			resolve(true)
		})
		reader.on('error', () => {
			reject(false)
		})
	})
}

mongoose.connect('mongodb://duck:egg@thuthi.kro.kr:9155/duckEgg?authSource=duckEgg&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false', {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify : false,
}).then(async () => {
	console.log('MongoDB connected...')
	await readCategoryMapping()
	await readFile('productDetailData.json')
}).catch((err) => console.log(err));