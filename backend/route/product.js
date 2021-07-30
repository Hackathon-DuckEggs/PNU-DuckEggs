const express = require('express')
const router = express.Router()
const { Product } = require('../model/Product')

router.get('/:pCode', (req, res) => {
	try {
		let today = new Date()
		console.log(`[${today.getFullYear()}/${today.getMonth()}/${today.getDate()} ${today.getHours()}/${today.getMinutes()}/${today.getSeconds()}]${req.params.pCode}`)
		Product.findOne({'pCode': req.params.pCode}, {_id: false}, (err, productInfo) => {
			if (err) return res.status(400).json({success: false, err})
			if (productInfo == null) return res.status(200).json({success: false, err: 'Undefined productCode'})
			specs = {}
			for (let key in productInfo['specs'])
				specs[key.replace(/\\DOT/, '.')] = productInfo['specs'][key]
			productInfo['specs'] = specs
			return res.status(200).json({success: true, productInfo})
		})
	} catch (err) {
		console.log(err)
		return res.status(400).json({success: false, err: 'Server is temporary down'})
	}
})
 
router.get('/', async (req, res) => {
	try {
		const title = req.query.title
		const width = req.query.width ? req.query.width : 130
		const height = req.query.height ? req.query.height : 130
		const today = new Date()
		console.log(`[${today.getFullYear()}/${today.getMonth()}/${today.getDate()} ${today.getHours()}/${today.getMinutes()}/${today.getSeconds()}]${title}, ${width}, ${height}`)

		if (title == null || title == '')
			return res.status(200).json({success: false, err: 'Query string is empty'});
		if (title.length < 2)
			return res.status(200).json({success: false, err: 'Query string is too short'})

		const queryStringList = title.split(' ')
		let minCount = Infinity
		let minCountIndex = 0
		for (let [index, queryString] of queryStringList.entries()) {
			let count = await Product.countDocuments({$text: {$search: queryString}})
			if (minCount > count) {
				minCount = count
				minCountIndex = index
			}
		}
		console.log(minCount, queryStringList[minCountIndex])
		
		Product.find({'title' : {$regex: queryStringList[minCountIndex]}}, {title: true, pCode: true, _id: false, weight: true}, (err, list) => {
			if (err) return res.status(400).json({success: false, err})
			let result = list.filter((item) => {
				for (let queryString of queryStringList) {
					if (item['title'].indexOf(queryString) == -1)
						return false
				}
				return true
			})
			result = result.map((item) => {
				const pCodeString = String(item['pCode'])
				return {
					pCode: item['pCode'],
					title: item['title'],
					weight: item['weight'],
					image: `http://img.danawa.com/prod_img/500000/${pCodeString.slice(pCodeString.length - 3 , pCodeString.length)}/${pCodeString.slice(pCodeString.length - 6, pCodeString.length - 3)}/img/${item['pCode']}_1.jpg?shrink=${width}:${height}`
				}
			})
			return res.status(200).json({success: true, list: result.slice(0, 30)})
		}).sort({'weight' : -1})
	} catch (err) {
		console.log(err)
		return res.status(400).json({success: false, err: 'Server is temporary down'})
	}
})

module.exports = router;