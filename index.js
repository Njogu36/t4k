const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const Course = require('./models/course.js')
const MongoStore = require('connect-mongo')(session);
const app = express()
var multer = require('multer');
var fs = require('fs')
var path = require('path')
var crypto = require('crypto');
// Functions

const config = require('./config/keys.js')
require('./config/passport')(passport);

// Views

app.set('view engine', 'jade');
app.set('/views', './views');

// Form body-parser

app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ encoded: true }));

// Static Files

var storage = multer.diskStorage({
  destination: 'public/upload/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)
      cb(null, Math.floor(Math.random() * 9000000000) + 1000000000 + path.extname(file.originalname))
    })
  }
})
var upload = multer({ storage: storage });
app.get('/files', function (req, res) {
  const images = fs.readdirSync('public/upload')
  var sorted = []
  for (let item of images) {
    if (item.split('.').pop() === 'png'
      || item.split('.').pop() === 'jpg'
      || item.split('.').pop() === 'jpeg'
      || item.split('.').pop() === 'svg') {
      var abc = {
        "image": "/upload/" + item,
        "folder": '/'
      }
      sorted.push(abc)
    }
  }
  res.send(sorted);
})

app.post('/upload', upload.array('flFileUpload', 12), function (req, res, next) {
  res.redirect('back')
});

app.post('/delete_file', function (req, res, next) {
  var url_del = 'public' + req.body.url_del
  console.log(url_del)
  if (fs.existsSync(url_del)) {
    fs.unlinkSync(url_del)
  }
  res.redirect('back')
});


// DB connection

mongoose.connect(config.Database);
const db = mongoose.connection;
db.once('open', () => {
  console.log('DB is running')
})
db.on('error', (err) => {
  console.log(err)
})

// Connect Flash

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })

}));

// Passport

app.use(passport.initialize());
app.use(passport.session());

// Routes

const administrator = require('./routes/administrator.js');
const fellow = require('./routes/fellow.js');
app.use('/administrator', administrator);
app.use('/', fellow);

// Functions

// Dates
const date = new Date();
const year = date.getFullYear();
const day = ('0' + date.getDate()).slice(-2);
const month = ('0' + (date.getMonth() + 1)).slice(-2);
const today = year + "-" + month + "-" + day;


setInterval(() => {

  const courseCursor = Course.find({}).cursor();
  courseCursor.on('data', (doc) => {
    // WITH
    if (doc.type === 'with') {
      Course.find({ module_id: doc.id }, (err, courses) => {
        courses.map((item) => {
          if (item.end_date === today) {
            let query = {
              _id: item.id
            }
            let data = {};
            data.status = 'Ended'
            Course.update(query, data, () => {

            })
          }
          if (item.start_date === today) {
            let query = {
              _id: item.id
            }
            let data = {};
            data.status = 'Ongoing'
            Course.update(query, data, () => {

            })
          }
        })
      })

    }

    // WITHOUT
    if (doc.type === 'without') {
      if (doc.end_date === today) {
        let query = {
          _id: doc.id
        }
        let data = {};
        data.status = 'Ended'
        Course.update(query, data, () => {
      
        })
      }
      if (doc.start_date === today) {
        let query = {
          _id: doc.id
        }
        let data = {};
        data.status = 'Ongoing'
        Course.update(query, data, () => {

        })
      }
    }
  })

}, 3600)

app.listen(process.env.PORT || 5000, () => {
  console.log('running on port 5000')
})
















