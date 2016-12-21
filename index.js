var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var db = mongoose.connect('mongodb://localhost/versionAPI');

var vrStore = require('./models/vrStoreModel');
var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var vrStoreRouter = express.Router();

vrStoreRouter.route('/vrStored')
	.post(function(req,res){
		console.log('received post request');
		var vr_store = new vrStore(req.body);
		vr_store.save();
		console.log(vr_store);
		res.status(201).send(vr_store);
	})
	.get(function(req,res){
		console.log('received get request');
		var query = {};
		if (req.query.key){
			query.key = req.query.key;
			vrStore.find(query, function(err, vrStored){
			if(err)
				console.log(err);
			else
				res.json(vrStored);
		    }).sort({'time': -1})
			.limit(1);
		} else {
			vrStore.find(query, function(err, vrStored){
				if(err)
					console.log(err);
				else
					res.json(vrStored);
			});
		}
	});
	
vrStoreRouter.route('/vrStored/mykey')
	.get(function(req,res){
			console.log('received get request');
			var query = {};
			if (req.query.time){
				var dateTime = new Date(req.query.time * 1000);
				console.log(dateTime);
				vrStore.find({"time": {$lt: dateTime}}, function(err, vrStored){
				if(err)
					res.status(500).send(err);
				else
					res.json(vrStored);
				}).sort({'time': -1})
				.select('key')
				.limit(1);
			} else{
				vrStore.find(function(err, vrStored){
				if(err)
					res.status(500).send(err);
				else
					res.json(vrStored);
				}).sort({'time': -1})
				.select('key')
				.limit(1);
			}
	});
	
app.use('/api', vrStoreRouter);

app.get('/', function(req, res){
	res.send('welcome to my API !');
});

app.listen(port, function(){
	console.log('running on port:' + port);
});