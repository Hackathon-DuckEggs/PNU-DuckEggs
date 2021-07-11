const mongoose = require('mongoose');

const productSchema = mongoose.Schema( {
    title : {
        type: String,
        maxLength: 150,
    },
    categories : {
        type: Array,
        default: [],
    },
    specs : {
        type: Object,
    },
    reviewList: {
        type: Array,
        default: [],
    },
    pCode : {
        type: String,
        default: "",
    },
});

/* productSchema.index({
    title : 'text',
    description : 'text',
}, {
    weight : {
        title : 5,
        description : 1,
    }
}) */


let Product = mongoose.model('Product', productSchema);

module.exports = {Product};