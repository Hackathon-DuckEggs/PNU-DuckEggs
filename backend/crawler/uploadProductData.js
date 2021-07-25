const fs = require('fs')
const readline = require('readline')
const mongoose = require('mongoose')

const mongoURI = 'mongodb://duck:egg@thuthi.kro.kr:9155/duckEgg?authSource=duckEgg&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false'
mongoose.connect(mongoURI, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify : false,
}).then(() => {
	console.log('MongoDB connected...')
	readFile('productDetailData.json')
}).catch((err) => console.log(err));

function readFile(filename) {
	let instream = fs.createReadStream(filename)
	let reader = readline.createInterface({input: instream, output: process.stdout, terminal: false})
	resultData = []
	let count = 0
	reader.on('line', (line) => {
		line = line.substr(0, line.length - 1)
		jsonData = JSON.parse(line)
		++count
		temp = {}
		temp['specs'] = {}
		for (let key in jsonData['specs']) {
			valueData = jsonData['specs'][key]
			if (valueData == '○')
				valueData = true
			temp['specs'][key.replace(/\./gi, '[dot]')] = valueData
		}
		
		temp['title'] = jsonData['title']
		temp['categories'] = jsonData['categories']
		temp['reviewList'] = jsonData['reviewList']
		temp['pCode'] = jsonData['pCode']
		resultData.push(temp)
		if (count % 10000 == 0)
			console.log(count)
	})
	reader.on('close', () => {
		db = mongoose.connection;
		db.collection('products').insertMany(resultData)
	})
}