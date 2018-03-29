const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) throw result.error;
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
// const multer = require('multer');
// const upload = multer({dest: 'public/original'});
let testConnect;
app.use(express.static('public'));
app.use('/modules', express.static('node_modules'));

/*const picSchema = {
  time: Date,
  category: String,
};*/

router.get('/', (req, res) => {
  console.log('Path: ' + path.basename(__dirname));
});

app.get('/', (req, res) => {
  console.log('req: ' + req);
  res.sendFile(path.join(__dirname + '/index.html'));
});

mongoose.connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/test`).
    then(() => {
      console.log('test server authenticated succesfully!');
      app.listen(3000);
    });

testConnect = () => {
  mongoose.connect('mongodb://localhost/cat').then(() => {
    console.log('test server connected successfully!');
    app.listen(3000);
  });
};
