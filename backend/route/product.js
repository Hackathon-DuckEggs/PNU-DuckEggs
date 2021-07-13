const express = require('express')
const router = express.Router()
const { Product } = require('../model/Product')

router.get('/:pCode', (req, res) => {
	Product.findOne({'pCode': req.params.pCode}, (err, productInfo) => {
		if (err) return res.status(400).json({success: false, err})
		if (productInfo == null) return res.status(201).json({success: false, err: 'Undefined productCode'})
		return res.status(200).json({success: true, productInfo})
	})
})
 
router.get('/', (req, res) => {
	var queryString = req.query.title
	let width = req.query.width ? req.query.width : 130
	let height = req.query.height ? req.query.height : 130
	console.log(queryString, width, height)
	if (queryString.length < 2)
		return res.status(201).json({success: false, err: 'Query string is too short'})

	Product.find({$text: {$search: queryString, $caseSensitive: false}}, {title: true, pCode: true, _id: false} , (err, list) => {
		if (err) return res.status(400).json({success: false, err})
		result = list.map((item) => {
			let t = {
				pCode: item['pCode'],
				title: item['title'],
				image: `http://img.danawa.com/prod_img/500000/${item['pCode'].slice(item['pCode'].length - 3 , item['pCode'].length)}/${item['pCode'].slice(item['pCode'].length - 6, item['pCode'].length - 3)}/img/${item['pCode']}_1.jpg?shrink=${width}:${height}`
			}
			return t
		})
		return res.status(200).json({success: true, list: result})
	}).limit(30)
})

module.exports = router;