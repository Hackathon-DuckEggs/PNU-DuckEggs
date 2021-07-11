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

// 정규 표현식 사용 => 
router.get('/', (req, res) => {
	var queryString = req.query.title
	if (queryString < 2)
		return res.status(201).json({success: false, err: 'Query string is too short'})
	Product.find({$text: {$search: queryString, $caseSensitive: false}}, {title: true} , (err, list) => {
		if (err) return res.status(400).json({success: false, err})
		return res.status(200).json({success: true, list})
	}).limit(30)
})

module.exports = router;