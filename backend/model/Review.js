const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema( {
    pCode : {
        type: Number,
    },
	date : {
		type: String,
	},
	src : {
		type: String,
	},
	content : {
		type: String,
	},
	rate : {
		type: Object
	},
}, {
	versionKey: false
});

let Review = mongoose.model('Review', reviewSchema);

module.exports = {Review};