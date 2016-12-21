var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var vrStoreModel = new Schema({
	key: {
		type: String
	},
	time: {
		type: Date, 
		default: Date.now
	}
});

module.exports = mongoose.model('vrStore', vrStoreModel);