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

var categoriesArray1 = [];
var categoriesArray2 = [];


var loadCategories = function () {
	connection.query('SELECT * FROM pcg_nlNL.category where categoryId between 2406 and 2414 order by categoryId', function(err, rows, fields) {

	 	if (err) throw err

  		fs.writeSync(fd, "first line");

		async.forEach(rows,
			function(category, done) {				
				var categoryUrl =  config.baseUrl + "/" + category.urlFriendlyCategoryName

				categoriesArray1[category.categoryId] = category
				categoriesArray2[category.categoryId] = category

				console.log(categoryUrl)

				fs.writeSync(fd, categoryUrl + '\n')

				done()
			}, 
			function(err) {
		    	console.log("finished");

		    	fs.closeSync(fd);

		    	// console.log("categoriesArray.length=" + categoriesArray.length)


				processCategories();

		    			    	
		});

	});
}

var processCategories = function() {
	console.log("processCategories");
	categoriesArray1.forEach( function (category) {
			console.log("category=" + category.categoryId)
			var categoryPath = createPathForCategory(category);
			console.log("categoryPath=" + categoryPath);
		}
	)
}

var createPathForCategory = function(category) {
	return createPathForParent(category) + "/" + category.urlFriendlyCategoryName
}

var createPathForParent = function(category) {
	console.log("createPathForParent ")
	if(category.parent==undefined && category.parent=='') {
		return "";
	} else {
		return createPathForParent(categoriesArray1[category.parent]) + "/" + category.urlFriendlyCategoryName
	}
}


loadCategories()
