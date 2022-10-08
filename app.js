const express = require('express');
const fs = require('fs');
const path = require('path');
const url = require('url');
const formidable = require('formidable');
//import formidable from 'formidable';
//ciaone

const app = express();
const port = process.env.PORT || 3000;
const basePath = __dirname;
const uploadFolder = '/caricati/';

// sendFile will go here
app.get('/', function (req, res) {
	res.sendFile(path.join(basePath, '/index.html'));
});


// sendFile will go here
app.post('/fileupload', function (req, res) {
	var q = url.parse(req.url, true);
	console.log(q);
	var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		console.log(files)
		var oldpath = files.fileupload.filepath;
		var newpath = basePath + uploadFolder + q.query.folder.substring(0, 3) + '/' + q.query.folder.substring(3) + '/';
		if (!fs.existsSync(newpath)) {
			fs.mkdirSync(newpath, { recursive: true });
		}
		fs.rename(oldpath, newpath + files.fileupload.originalFilename, function (err) {
			if (err) throw err;
			res.redirect('/?message=loaded:' + files.fileupload.originalFilename);
		});
	});
});


app.listen(port);
console.log('Server started at http://localhost:' + port);
