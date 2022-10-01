var express = require('express')
var session = require('cookie-session')
var bodyParser = require('body-parser')
var app = express()
var http = require('http')
var url = require('url')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID
var mongourl = process.env.MongoURL
var mongoose = require('mongoose')
var fs = require('fs')
var formidable = require('formidable')
var util = require('util')
var multer = require('multer')
var upload = multer()

app = express()

app.set('view engine', 'ejs')

var SECRETKEY1 = 'I GO TO BY BUS'
var SECRETKEY2 = 'XYZ'

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', function (req, res) {
	res.status(200)
	res.render('postForm')
})

app.post('/form', upload.array(), (req, res) => {
	let formData = req.body;
	console.log('form data', formData);
	let output = []

	if( isArray(formData.Title) ) {
		for (var i=0; i < formData.Title.length; i++) {
			var object = new Object()
			object.Title = formData.Title[i]
			object.Lat = formData.Lat[i]
			object.Lng = formData.Lng[i]
			object.Description = formData.Description[i]
			output.push(object)
		}
	} else {
		var object = new Object()
			object.Title = formData.Title
			object.Lat = formData.Lat
			object.Lng = formData.Lng
			object.Description = formData.Description
			output.push(object)
	}
	console.log(output)

	MongoClient.connect(mongourl, function (err, db) {
		if (err) throw err

		db.collection("newRoute").insert(output, function (err, res) {
			if (err) throw err
			console.log("1 document inserted")
		})

	})
	
	res.writeHead(200, { "Content-Type": "text/html" })
	res.write('<html><body>')
	res.write('<h1>Insert Success!</h1>')
	res.end('</body></html>')
});

function isArray(obj){
    return !!obj && obj.constructor === Array;
}

app.listen(process.env.PORT || 8099)
