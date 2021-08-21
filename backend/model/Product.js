const mongoose = require('mongoose');

const productSchema = mongoose.Schema( {
    title : {
        type: String,
        maxLength: 150,
    },
    category : {
        type: String,
    },
    specs : {
        type: Object,
    },
    pCode : {
        type: Number,
    },
	weight : {
		type : Number,
	},
	reviewCnt: {
		type: Number,
	},
    view : {
        type: Number,
		default: 0,
    },
	analyzed : {
		type: Number,
		default: 0,
	},
	rates: {
		type: Object
	}
}, {
	versionKey: false
});

let Product = mongoose.model('Product', productSchema);

module.exports = {Product};