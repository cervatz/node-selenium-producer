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

	connection.query("SELECT * FROM " + config.connection.schema + ".category order by categoryId", function(err, rows, fields) {

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

	fs.writeSync(fd, testHeader());

	categoriesArray.forEach( function(category) {
			console.log("category=" + category.categoryId)

			if (category.type == 'rich' || category.type == 'carrental' || category.type == 'flights' || category.type == 'richlive' || category.type == 'crosslink') {
				var categoryUrl =  config.baseUrl + "/" + category.urlFriendlyCategoryName
				console.log("categoryUrl=" + categoryUrl)
				fs.writeSync(fd, testLine(categoryUrl))
			}			
		}
	)

	fs.closeSync(fd);
	console.log("writeCategories - leaving ...")
}

var testHeader = function() {
	var header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
				+ "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n"
				+ "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n"
				+ "<head profile=\"http://selenium-ide.openqa.org/profiles/test-case\">\n"
				+ "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n"
				+ "<link rel=\"selenium.base\" href=\"" + config.baseUrl +  "\" />\n"
				+ "<title>Test</title>\n"
				+ "</head>\n"
				+ "<body>\n"
				+ "<table cellpadding=\"1\" cellspacing=\"1\" border=\"1\">\n"
				+ "<thead>\n"
				+ "<tr><td rowspan=\"1\" colspan=\"3\">Test</td></tr>\n"
				+ "</thead><tbody>\n"

	return header;
}

var testFooter = function() {
	var footer = "</tbody></table>\n"
				+ "</body>\n"
				+ "</html>\n"

	return footer
}

var testLine = function(categoryUrl) {
	var line = "<tr>\n"
			+ "<td>open</td>\n"
			+ "<td>" + categoryUrl + "</td>\n"
			+ "<td></td>\n"
			+ "</tr>\n";

	return line;
}


loadCategories()
