const express = require('express'),
	aws = require('aws-sdk'),
	ejs = require('ejs'),
	path = require('path'),
	multer = require('multer'),
	multerS3 = require('multer-s3'),
	bodyParser = require('body-parser');

const app = express();
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.set('view engine', 'ejs');

aws.config.update({});

const s3 = new aws.S3({
	accessKeyId: 'AKXXXXXXXXXXXX',
	secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
	bucket: 'nikhilpandey'
});

const upload = multer({
	storge: multerS3({
		s3: s3,
		bucket: 'nikhilpandey',
		acl: 'public-read',
		key: function(req, file, cb) {
			cb(
				null,
				path.basename(file.originalname, path.extname(file.originalname)) +
					'-' +
					Date.now() +
					path.extname(file.originalname)
			);
		}
	}),
	limits: { fileSize: 2000000 },
	fileFilter: function(req, file, cb) {
		checkfileTypes(file, cb);
	}
});

function checkfileTypes(file, cb) {
	const filetypes = /jpeg|png|gif|jpg/;

	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

	const mime = filetypes.test(file.mimetype);
	if (extname && mime) {
		return cb(null, true);
	} else {
		cb('ERR only images are allowed');
	}
}

app.get('/', (req, res) => {
	res.render('index');
});

app.post('/single', upload.single('simage'), (req, res) => {
	// upload.single('simage')(req, res, (err) => {
	// 	if (err) {
	// 		console.log('errors', err);
	// 		res.render('index', {
	// 			msg: err
	// 		});
	// 	} else {
	// 		if (req.file === undefined) {
	// 			res.render('index', {
	// 				msg: 'no file selected'
	// 			});
	// 		} else {
	// 			res.render('index', {
	// 				msg: 'File uploaded successfully'
	// 			});
	// 		}
	// 	}
	// });
	console.log(req.body, req.file);
	res.redirect('/');
});

app.listen(8000, () => {
	console.log('listening carefully');
});
