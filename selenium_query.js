var mysql = require('mysql')
	,async = require('async')
	,fs = require('fs')

var connection = mysql.createConnection({
	  	host     : "localhost",
	  	user     : "root",
	  	password : "root"
	})

connection.connect

var fd = fs.openSync("out.txt", 'a+', 0666);  

connection.query('SELECT * FROM pcg_nlNL.category', function(err, rows, fields) {
	 	if (err) throw err
  		fs.writeSync(fd, "first line");

		async.forEach(rows,
			function(item, done) {				
				var categoryString = "item.categoryId=" + item.categoryId;
				console.log(categoryString)
				fs.writeSync(fd, categoryString);
				done()
			}, 
			function(err) {
		    	console.log("finished");
		    	fs.writeSync(fd, "last line");
		    	fs.closeSync(fd);
		    			    	
		});

	});

