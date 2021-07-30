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
    reviewList: {
        type: Array,
        default: [],
    },
    pCode : {
        type: Number,
    },
	weight : {
		type : Number,
	}
}, {
	versionKey: false
});

let Product = mongoose.model('Product', productSchema);

module.exports = {Product};