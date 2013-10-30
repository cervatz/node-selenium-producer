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

var fd = fs.openSync(config.fileName, 'a+', 0666);  

var categoriesArray = [];

var execute = function () {
	connection.query('SELECT * FROM pcg_nlNL.category where categoryId between 2406 and 2414 order by categoryId', function(err, rows, fields) {

	 	if (err) throw err

  		fs.writeSync(fd, "first line");

		async.forEach(rows,
			function(category, done) {				
				var categoryUrl =  config.baseUrl + "/" + category.urlFriendlyCategoryName

				categoriesArray[category.categoryId] = category

				console.log(categoryUrl)

				fs.writeSync(fd, categoryUrl + '\n')

				done()
			}, 
			function(err) {
		    	console.log("finished");

		    	fs.closeSync(fd);

		    	console.log("categoriesArray.length=" + categoriesArray.length)

				categoriesArray.forEach( function (item) {
						console.log("item=" + item.categoryId)						
					}
				)

		    			    	
		});

	});
}

execute();



