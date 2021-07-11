const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')

const {mongoURI} = require('./config/key');
mongoose.connect(mongoURI, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify : false,
}).then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(err));

app.use('/api/product', require('./route/product'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const port = process.env.PORT || 5000
app.listen(port, () => console.log(`App started on port ${port}`));