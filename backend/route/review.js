const express = require('express')
const router = express.Router()
const { Review } = require('../model/Review')

router.get('/', async (req, res) => {
	try {
		const today = new Date()
		const pCode = parseInt(req.query.pCode)
		console.log(`[${today.getFullYear()}/${today.getMonth()}/${today.getDate()} ${today.getHours()}/${today.getMinutes()}/${today.getSeconds()}][get]${pCode}`)
		
		if (isNaN(pCode))
			return res.status(400).json({success: false, err: 'Undefined productCode'})

		Review.find({pCode}, {_id: false}, async(err, reviewList) => {
			if (err) return res.status(400).json({success:false, err})
			if (reviewList.length == 0) return res.status(400).json({success: false, err: 'Undefiend productCode'})

			return res.status(200).json({success: true, reviewList})
		})
	} catch (err) {
		console.log(err)
		return res.status(400).json({success: false, err: 'Server is temporary down'})
	}
})

module.exports = router;