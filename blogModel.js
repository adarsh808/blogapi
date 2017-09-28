//include the mongoose module
var mongoose =require('mongoose');
//declare schema object
var Schema =mongoose.Schema;
//schema instance for blog
var blogSchema=new Schema({
	title         :{type:String,default:'',required:true},
	subTitle      :{type:String,default:''},
	blogBody      :{type:String,default:''},
	tags          :[],
	created       :{type:Date },
	authorInfo    :{} 
});
//schema instance for comments
var commentSchema = new Schema({
	blogId		: {type:String,default:''},
	commentText	: {type:String,default:''},
	created		: {type:Date},
	userName    : {type:String,default:'',required:true}  
});
mongoose.model('Blog',blogSchema);
mongoose.model('Comment',commentSchema);