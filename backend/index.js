const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {runScheduler} = require('./scheduler')

async function connectToDB() {
	const {mongoURI} = require('./config/key');
	return new Promise((resolve, reject) => {
		mongoose.connect(mongoURI, {
			useNewUrlParser : true,
			useUnifiedTopology : true,
			useCreateIndex : true,
			useFindAndModify : false,
		}).then(() => {
			resolve()
		}).catch((err) => {
			reject()
		})
	})
}

async function startApp() {
	await connectToDB()
	console.log('MongoDB connected!')
	await runScheduler()

	app.use((req, res, next) => {
		res.append('Access-Control-Allow-Origin', ['*'])
		res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
		res.append('Access-Control-Allow-Headers', 'Content-Type')
		next()
	})

	app.use('/api/product', require('./route/product'));
	app.get('/', (req, res) => {
		res.send('On')
	})

	const port = process.env.PORT || 5000
	app.listen(port, () => console.log(`App started on port ${port}`));
}

startApp()


