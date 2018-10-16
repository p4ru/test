var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Blog = require('../models/blog');



// show all Blogs
router.get('/blogs', ensureAuthenticated, function (req, res) {
	console.log('show all blogs...')

     //blog.getAllBlogs( function(err, blogs){

        Blog.getAllBlogs( function (err, blogCollections) {
        if (err) throw err;	
        console.log("# of Blog="+blogCollections.length);

        res.render('blogs',
           {
        	 blogs:blogCollections
           }

         );

      })


 });


// New Blog
router.get('/blog', ensureAuthenticated, function (req, res) {
	res.render('blog');
});

// Exiting Blog
router.get('/blog/:id', ensureAuthenticated, function (req, res) {
	console.log("Getting blog by id");
	blogId = req.params.id;
	console.log("blogId="+blogId);

	Blog.getBlogById(blogId, function (err, blog) {
		   if (err) throw err;
		   console.log("Blog from DB...");
		   console.log(blog);
		   res.render('blogcomment',
					{
						blog:blog,
						comment:"h1"
					}
				  );

		});

	//res.render('blog');

});

// Add Blog
router.post('/blog', function (req, res) { // /blogs/blog
	var title = req.body.title;
	var body = req.body.body;

	// Get Logged in User
	var loggedInUser = req.user;
	console.log("logged in user is->" + loggedInUser)	

	// Validation
	req.checkBody('title', 'Title is required').notEmpty();
	req.checkBody('body', 'Body is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.render('blog', {
			errors: errors
		});
	}
	else {
			//----
				var createDate = new Date;
				var newBlog = new Blog({
					title: title,
					body: body,
					createdate : createDate,
					blogby: loggedInUser.username
				});


				//blogCreated = null;

				Blog.createBlog(newBlog, function (err, blog) {
					if (err) throw err;
					console.log("Inserted");
					//blogCreated = blog;
					console.log(blog);
		 			console.log('blog.id'+blog.id);

		 			req.flash('success_msg', 'Blog has been added');
		 			
		 			console.log('/blogs/blog'+'/'+blog.id);
					//res.redirect('/blogs/blog');
					
					res.redirect('/blogs/blog'+'/'+blog.id); //get


				});
			//-----
	}
});


router.post('/comment', function (req, res) {
	var id = req.body.id;
	var comment = req.body.comment;
	var loggedInUser = req.user;

	console.log("loggedInUser="+loggedInUser)

	console.log("Update Blog with comment...")
	console.log("id="+id)
	console.log("comment="+comment)

	//res.render('blog');
	//addBlogCommentById
	Blog.addBlogCommentById(id, comment, loggedInUser, function (err, blog) {
					if (err) throw err;
					console.log("Comment Added....");

					
					res.render('blogcomment',
								{
									blog:blog
								}
							  );

				}
				);

});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;