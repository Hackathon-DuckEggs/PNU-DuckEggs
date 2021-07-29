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
				specs[key.replace(/\[dot\]/, '.')] = productInfo['specs'][key]
			productInfo['specs'] = specs
			return res.status(200).json({success: true, productInfo})
		})
	} catch (err) {
		console.log(err)
		return res.status(400).json({success: false, err: 'Server is temporary down'})
	}
})
 
router.get('/', (req, res) => {
	try {
		let title = req.query.title
		let width = req.query.width ? req.query.width : 130
		let height = req.query.height ? req.query.height : 130
		let today = new Date()
		console.log(`[${today.getFullYear()}/${today.getMonth()}/${today.getDate()} ${today.getHours()}/${today.getMinutes()}/${today.getSeconds()}]${title}, ${width}, ${height}`)

		if (title == null || title == '')
			return res.status(200).json({success: false, err: 'Query string is empty'});
		if (title.length < 2)
			return res.status(200).json({success: false, err: 'Query string is too short'})

		let queryString = "\"" + title.replace(/\s/g, "\" \"") + "\""
		Product.find({$text: {$search: queryString, $caseSensitive: false}}, {title: true, pCode: true, _id: false} , (err, list) => {
			if (err) return res.status(400).json({success: false, err})
			result = list.map((item) => {
				const pCodeString = String(item['pCode'])
				let t = {
					pCode: item['pCode'],
					title: item['title'],
					image: `http://img.danawa.com/prod_img/500000/${pCodeString.slice(pCodeString.length - 3 , pCodeString.length)}/${pCodeString.slice(pCodeString.length - 6, pCodeString.length - 3)}/img/${item['pCode']}_1.jpg?shrink=${width}:${height}`
				}
				return t
			})
			return res.status(200).json({success: true, list: result})
		}).limit(30)
	} catch (err) {
		console.log(err)
		return res.status(400).json({success: false, err: 'Server is temporary down'})
	}
})

module.exports = router;