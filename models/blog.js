var mongoose = require('mongoose');


//Comment schema with 3row comment,commentby and comment date
var CommentSchema = mongoose.Schema({
	comment: {
		type: String,
		index:true
	},
	commentby: {
		type: String,
		index:true
	},		
	commentdate: {
		type: Date,
		index:true
	}		
});

// Blog Schema with 4row title,body,blogby,createdate
var BlogSchema = mongoose.Schema({
	title: {
		type: String,
		index:true
	},
	body: {
		type: String
	},
	blogby: {
		type: String,
		index:true
	},
	createdate: {
		type: Date,
		index:true
	},
	comments: [CommentSchema]

});



var Blog = module.exports = mongoose.model('Blog', BlogSchema);
//functions to create/write blog
module.exports.createBlog = function(newBlog, callback){
	        newBlog.save(callback);
	};



// get blog by title
module.exports.getBlogByTitle = function(title, callback){
	var query = {title: title};
	Blog.find(query, callback);
}

//functions to get  blog by id
module.exports.getBlogById = function(idVar, callback){
	Blog.findById (idVar, callback);
}

//functions to get all blog
module.exports.getAllBlogs = function( callback){
	Blog.find( callback);
}


  //add blo comment by comment id login user
module.exports.addBlogCommentById = function(id, comment, loggedInUser, callback){

	Blog.findById(id , function (err, blog) {
				if (err) throw err;
				console.log('addBlogCommentById');
				console.log(blog)
				console.log("comment="+comment)
				var createDate = new Date;

				var commentUserNmae = loggedInUser.name;

         // inside blog post comment with commentby, or comment date 
				blog.comments.push({comment:comment, commentby: commentUserNmae, commentdate : createDate});
				
				console.log('????');
				console.log('With Comments->');
				console.log(blog);
				
				blog.save(callback);
				}
		);
}

