const express = require('express');
const router = express.Router();
const db = require('../models');
const multer = require('multer');
const { findByIdAndUpdate } = require('../models/City');

//multer middleware
//https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
  }
});

const upload = multer({storage: storage}).single('img');

//index route
router.get('/', (req, res) => res.redirect('/blogs/1'))

//create route - get
router.get('/new', (req, res) => {
  res.render('blogs/new')
});

//post route
router.post('/', (req, res) => {
  upload(req, res, (err) => {
    let obj = "";
    if(err) return console.log(err)

    if (req.file) {
      obj = {
        title: req.body.title,
        publishDate: Date.now(),
        author: req.user._id,
        topic: req.body.topic,
        synopsis: req.body.synopsis,
        blogPost: req.body.blogPost,
        img: req.file.filename,
      }
    } else {
      obj = {
        title: req.body.title,
        publishDate: Date.now(),
        author: req.user._id,
        topic: req.body.topic,
        synopsis: req.body.synopsis,
        blogPost: req.body.blogPost,
      };
    }

    db.Blog.create(obj, (err, newBlogPost) => {
      if(err) return console.log(err);
      db.Realtor.findById(obj.author, (err, author) => {
        if(err) return console.log(err);

        author.blogs.push(newBlogPost._id);
        author.save((err, blogAuthor) => {
        if(err) return console.log(err);

        res.redirect('/blogs')
        });
      });
    });
  })
});

//show route
router.get(`/:id`, (req, res) => {
  if (isNaN(req.params.id)) {
    db.Blog.findById(req.params.id, (err, blog) =>{
    if(err) return console.log(err);

    db.Realtor.findOne({blogs: blog._id}, (err, author) => {
      res.render('blogs/show', {blog, user: req.user, author})
    })
  });
} else {
    db.Blog.find({}, (err, allBlogs) => {
    if (err) console.log(err);
    const pageNumber = parseInt(req.url.split('/')[1])
    res.render('blogs/index', {
      page: pageNumber,
      user: req.user,
      blogs: allBlogs,
    })
    });

  }
});

//edit route
router.get('/:id/edit', (req, res) => {
  db.Blog.findById(req.params.id, (err, blogToEdit) => {
    if (err) console.log(err);

    res.render('blogs/edit', {blog: blogToEdit,
      user: req.user,});
  });
});

//put route
router.put('/:id', (req, res) => {
  let obj = "";
  upload(req, res, (err) => {
  if (err) return console.log(err);
    if (req.file) {
      obj = {
      title: req.body.title,
      topic: req.body.topic,
      synopsis: req.body.synopsis,
      blogPost: req.body.blogPost,
      img: req.file.filename,
      };
    } else {
      obj = {
        title: req.body.title,
        topic: req.body.topic,
        synopsis: req.body.synopsis,
        blogPost: req.body.blogPost,
      }
    };
    db.Blog.findByIdAndUpdate(
    req.params.id,
    obj,
    {new: true},
    (err, updatedBlog) => {
      if (err) console.log(err);
      res.redirect(`/blogs/${updatedBlog._id}`);
    });
  });
});

// delete route
router.delete('/:id', (req, res) => {
  db.Blog.findByIdAndDelete(req.params.id, (err, blogToDelete) => {
    if(err) return console.log(err);

    db.Realtor.findById(blogToDelete.author, (err, realtor) => {
      if(err) return console.log(err);

      realtor.blogs.remove(blogToDelete);
      realtor.save((err) => {
        if(err) return console.log(err);
        res.redirect('/blogs');
      })
    });
  });
});

module.exports = router;

