const express = require('express')
const router = express.Router()
const { Product } = require('../model/Product')
const { getAutocomplete } = require('../crawler/getAutocomplete')
const { getAllMallReview } = require('../crawler/getMallReview')
const fs = require('fs')

async function saveReviewToFile(pCode) {
	const reviews = await getAllMallReview(pCode)
	await fs.writeFileSync(`../data/beforeAnalyze/${pCode}.json`, JSON.stringify(reviews, null, 4))
}

async function analyzeReview(pCode) {
	await saveReviewToFile(pCode)
}

router.get('/:pCode', (req, res) => {
	try {
		const today = new Date()
		console.log(`[${today.getFullYear()}/${today.getMonth()}/${today.getDate()} ${today.getHours()}/${today.getMinutes()}/${today.getSeconds()}][get]${req.params.pCode}`)
		
		const pCode = parseInt(req.params.pCode)
		if (isNaN(pCode))
			return res.status(400).json({success: false, err: 'Undefined productCode'})
		
		Product.findOne({'pCode': pCode}, {_id: false, reviewList: false, weight: false}, (err, productInfo) => {
			if (err) return res.status(400).json({success: false, err})
			if (productInfo == null) return res.status(200).json({success: false, err: 'Undefined productCode'})

			Product.updateOne({'pCode': pCode}, {
				$inc: {
					view: 1
				}
			}, {}, err=>{
				if(err){
					console.log('Error is thrown while updating view count\n', err)
				}
			})

			if (productInfo['analyzed'] == 0) {
				Product.updateOne({'pCode': pCode}, {
					analyzed: -1
				}, (err) => {
					if (err) throw (err)
				})
				
				analyzeReview(pCode)
				return res.status(200).json({success:false, analyzed: 0})
			}
			else if (productInfo['analyzed'] == -1) {
				return res.status(200).json({success:false, analzyed: -1})
			}
			else {
				let specs = {}
				for (let key in productInfo['specs'])
					specs[key.replace(/\\DOT/, '.')] = productInfo['specs'][key]
				productInfo['specs'] = specs
				return res.status(200).json({success: true, productInfo})
			}
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

		const autocompleteResult = await getAutocomplete(req.query.title)
		
		if (!Array.isArray(autocompleteResult))
			return res.status(200).json({success: true, list: []})

		Product.aggregate([
			{$match: {pCode: {$in: autocompleteResult}}},
			{$addFields: {"__order": {$indexOfArray: [autocompleteResult, "$pCode"]}}},
			{$sort: {"__order": 1}}
		])
		.project({title: true, pCode: true, _id: false})
		.then((list) => {
			let result = list.map((item) => {
				const pCodeString = String(item['pCode'])
				return {
					pCode: item['pCode'],
					title: item['title'],
					image: `http://img.danawa.com/prod_img/500000/${pCodeString.slice(pCodeString.length - 3 , pCodeString.length)}/${pCodeString.slice(pCodeString.length - 6, pCodeString.length - 3)}/img/${item['pCode']}_1.jpg?shrink=${width}:${height}`
				}
			})
			return res.status(200).json({success: true, list: result})
		})
	} catch (err) {
		console.log(err)
		return res.status(400).json({success: false, err: 'Server is temporary down'})
	}
})

module.exports = router;