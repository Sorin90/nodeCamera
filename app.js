const express = require('express');
const fs = require('fs');
const path = require('path');
const url = require('url');
const formidable = require('formidable');
const app = express();
//const port = process.env.PORT || 3000;
var port = "";
const basePath = __dirname;
const uploadFolder = '/caricati/';

// sendFile will go here
app.get('/', function (req, res) {
	res.sendFile(path.join(basePath, '/index.html'));
});

fs.readFile('srvcfg.json', 'utf8', (err, data) => {
	if (err) {
	  console.error(err);
	  return;
	}
	const srvcfg = JSON.parse(data)
	 port = JSON.parse(data).port;
	 app.listen(port);
	console.log('Server started at http://localhost:' + port);
  });


// sendFile will go here
app.post('/fileupload', function (req, res) {
	var q = url.parse(req.url, true);
	var form = formidable({ multiples: true });
	form.parse(req, function (err, fields, files) {
		var arr = []
		let c = 0;
		// in case of single file. Use with formidable v2 maybe fixed with v3
		if (files.fileupload.size > 0) {
			var tmp = Object.assign({}, files);
			files = {}
			files.fileupload = [tmp.fileupload];
		}
		for (let i = 0; i < files.fileupload.length; i++) {
			var oldpath = files.fileupload[i].filepath;
			var newpath = basePath + uploadFolder + q.query.folder.substring(0, 3) + '/' + q.query.folder.substring(3) + '/';
			if (!fs.existsSync(newpath)) {
				fs.mkdirSync(newpath, { recursive: true });
			}
			fs.rename(oldpath, newpath + files.fileupload[i].originalFilename, function (err) {
				//console.log(files.fileupload.length + '--' + c)
				if (err == null)
					c++;
				else throw err
				if (files.fileupload.length == c)
					res.redirect('/?message=caricate:' + c + ' images');
			});
		}
	});
});


