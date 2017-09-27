//calling the module
var express = require('express');
//creating an instance
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//calling mongoose module
var mongoose = require('mongoose');
app.use(bodyParser.json({
 limit: '10mb',
 extended: true
}));
app.use(bodyParser.urlencoded({
 liited: '10mb',
 extended: true
}));
//configuration of database
var dbPath = "mongodb://localhost/myblogapp";
//command to connect with database
db = mongoose.connect(dbPath);
mongoose.connection.once('open', function() {
 console.log("database connection open success");
});
//including the blogModel
var Blog = require('./blogModel.js');
var blogModel = mongoose.model("Blog");
var commentModel = mongoose.model('Comment');
//Application level middleware
app.use(function(req, res, next) {
 console.log('Time of Request:', Date.now());
 console.log('Requested Url:', req.originalUrl)
 console.log('Ip address:', req.ip)
 next();
});
//basic route
app.get('/', function(req, res) {
 res.send("This is blog Application");
});
//get all blogs
app.get('/blogs', function(req, res){blogModel.find(function(err, result) {
  if (err) {
   res.send(err);
  } else {
   res.send(result);
  }
 });
});
//get comments of a blog
app.get('/blogs/:id/getcomment',function(req, res){commentModel.find({'blogId': req.params.id},function(err, result) {
  if (err) {
   console.log(err);
   res.send(err);
  } else {
   console.log(result);
   res.send(result);
  }
 });
});
//create a blog
app.post('/blog/create', function(req, res) {
 var newBlog = new blogModel({
  title: req.body.title,
  subTitle: req.body.subTitle,
  blogBody: req.body.blogBody
 });
 var today = Date.now();
 newBlog.created = today;
 var alltags = (req.body.alltags != undefined && req.body.alltags != null) ? req.body.alltags.split(',') : '';
 newBlog.tags = alltags;
 var authorInfo = {
  fullname: req.body.authorFullName,
  email: req.body.email
 };
 newBlog.authorInfo = authorInfo;
 newBlog.save(function(error) {
  if (error) {
   console.log(error)
   res.send(error);
  } else
   res.send(newBlog);
 });
});
//create a comment
app.post('/blogs/:id/createcomment', function(req, res) {
 var newComment = new commentModel({
  blogId: req.params.id,
  commentText: req.body.commentText,
  userName: req.body.userName
 });
 var date = new Date();
 newComment.created = date;
 newComment.save(function(error) {
  if (error) {
   console.log(error);
   res.send(error);
  } else {
   res.send(newComment);
  }
 });
});
//get a particular blog using id
app.get('/blogs/:id', function(req, res){blogModel.findOne({'_id': req.params.id},function(err, result){
  if (err) {
   console.log(err);
   res.send(err);
  } else
   res.send(result);
 });
});
//To Edit A blog
app.put('/blogs/:id/edit', function(req, res) {
 var update = req.body;
 console.log(newBlog.lastModified)
 blogModel.findOneAndUpdate({
  '_id': req.params.id
 }, update, function(err, result) {
  if (err) {
   console.log(err)
   res.send(err)
  } else {
   console.log(result)
   res.send(result)
  }
 });
});
//To delete a particular blog
app.post('/blogs/:id/delete',function(req, res){blogModel.remove({'_id': req.params.id },function(err, result){
   if (err) {
    console.log(err)
    res.send(err)
   } else {
    console.log("deleted");
    res.send(result);
   }
  })
 })
 //to delete a comment
app.post('/blogs/:id/commentdelete',function(req, res){commentModel.remove({'_id': req.params.id },function(err, result){
   if (err) {
    console.log(err)
    res.send(err)
   } else {
    console.log("deleted");
    res.send(result);
   }
  })
 })
 //middleware for other routes erroe
app.get('*', function(req, res, next) {
 res.status = 404;
 next("Path not Found !");
});
//Error handler
app.use(function(err, req, res, next) {
 if (res.status == 404) {
  res.send('ERROR 404:PAGE NOT FOUND');
 } else
  res.send(err);
});
app.listen(3000, function() {
 console.log("app listenting at 3000");
});