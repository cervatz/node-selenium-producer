var mysql = require('mysql')
	,async = require('async')
	,fs = require('fs')
	,config = require('./config.json')

var connection = mysql.createConnection({
	  	host     : config.connection.host,
	  	user     : config.connection.user,
	  	password : config.connection.password
	})

connection.connect

var categoriesArray = [];

var loadCategories = function () {
	console.log("loadCategories - entering ...")

	connection.query("SELECT * FROM pcg_nlNL.category order by categoryId", function(err, rows, fields) {

	 	if (err) throw err

		async.forEach(rows,
			function(category, done) {				
				categoriesArray[category.categoryId] = category				

				done()
			}, 
			function(err) {
		    	console.log("finished");

		    	writeCategories()
		});

		console.log("loadCategories - leaving ...")

	});
}

var writeCategories = function() {
	console.log("writeCategories - entering ...")

	if (fs.existsSync(config.fileName)) {
		fs.unlinkSync(config.fileName);
	}

	var fd = fs.openSync(config.fileName, 'a+', 0666);  

	categoriesArray.forEach( function(category) {
			console.log("category=" + category.categoryId)

			if (category.type == 'rich' || category.type == 'carrental' || category.type == 'flights' || category.type == 'richlive' || category.type == 'crosslink') {
				var categoryUrl =  config.baseUrl + "/" + category.urlFriendlyCategoryName
				console.log("categoryUrl=" + categoryUrl);
				fs.writeSync(fd, categoryUrl + '\n')				
			}			
		}
	)

	fs.closeSync(fd);
	console.log("writeCategories - leaving ...")
}

loadCategories()
