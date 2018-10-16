var mongoose = require('mongoose');


//Comment
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

// Blog Schema
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

module.exports.createBlog = function(newBlog, callback){
	        newBlog.save(callback);
	};

module.exports.getBlogByTitle = function(title, callback){
	var query = {title: title};
	Blog.findOne(query, callback);
}



module.exports.getBlogById = function(idVar, callback){
	Blog.findById (idVar, callback);
}


module.exports.getAllBlogs = function( callback){
	Blog.find( callback);
}



module.exports.addBlogCommentById = function(id, comment, loggedInUser, callback){

	Blog.findById(id , function (err, blog) {
				if (err) throw err;
				console.log('addBlogCommentById');
				console.log(blog)
				console.log("comment="+comment)
				var createDate = new Date;

				var commentUserNmae = loggedInUser.name;


				blog.comments.push({comment:comment, commentby: commentUserNmae, commentdate : createDate});
				
				console.log('????');
				console.log('With Comments->');
				console.log(blog);
				
				blog.save(callback);
				}
		);
}

