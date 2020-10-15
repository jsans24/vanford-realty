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

router.get('/', (req, res) => res.redirect('/blogs/1'))

//create route - get
router.get('/new', (req, res) => {
  console.log(req.user);
  res.render('blogs/new')
});

//post route
router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if(err) return console.log(err)

        if (req.file) {
            var obj = {
                title: req.body.title,
                publishDate: Date.now(),
                author: req.user._id,
                topic: req.body.topic,
                synopsis: req.body.synopsis,
                blogPost: req.body.blogPost,
                img: req.file.filename,
            };
        } else {
            var obj = {
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
              })
            })
        });
    })
});

//index route 
router.get(`/:id`, (req, res) => {
    if (isNaN(req.params.id)) {
      db.Blog.findById(req.params.id, (err, blog) =>{
        if(err) return console.log(err);
        
        db.Realtor.findOne({blogs: blog._id}, (err, author) => {
          console.log(author);
            res.render('blogs/show', {blog, user: req.user, author})
        })
    });
} else {
        db.Blog.find({}, (err, allBlogs) => {
        if (err) console.log(err);
        const pageNumber = req.url.split('/')[1]
        res.render('blogs/index', {
          page: pageNumber,
          user: req.user,
          blogs: allBlogs,
        })
      });

  }
});



// //edit route
// router.get('/:id/edit', (req, res) => {
//     db.Blog.findById(req.params.id, (err, cityToEdit) => {
//         if (err) console.log(err);

//         res.render('blogs/edit', {cityToEdit,
//             user: req.user,});
//     });
// });

// //put route
// router.put('/:id', (req, res) => {
//     upload(req, res, (err) => {

//     if (err) return console.log(err);
//         if (req.file) {
//         const obj = {
//             name: req.body.name,
//             population: req.body.population,
//             houses: req.body.houses,
//             bio: req.body.bio,
//             img: req.file.filename,
//         };

//         db.Blog.findByIdAndUpdate(
//             req.params.id,
//             {$push: {keyAttractions: req.body.keyAttractions}},
//             {new: true},
//             (err, updatedCity) => {
//             if (err) console.log(err);
        
//             db.Blog.findByIdAndUpdate(
//                 req.params.id,
//                 obj,
//                 {new: true},
//                 (err, updatedCity) => {
//                 if (err) console.log(err);
                
//                 res.redirect(`/blogs/${updatedCity._id}`);
//             });
//         });
//         } else {
//             const obj = {
//                 name: req.body.name,
//                 population: req.body.population,
//                 houses: req.body.houses,
//                 bio: req.body.bio,
//             };
//             db.Blog.findByIdAndUpdate(
//             req.params.id,
//             {$pull: {keyAttractions: req.body.keyAttractionsToDelete},},
//             {new: true},
//             (err, updatedCity) => {
//             if (err) console.log(err);
//                 db.Blog.findByIdAndUpdate(
//                 req.params.id,
//                 {$push: {keyAttractions: req.body.keyAttractions},},
//                 {new: true},
//                 (err, updatedCity) => {
//                 if (err) console.log(err);

//                     db.Blog.findByIdAndUpdate(
//                         req.params.id,
//                         obj,
//                         {new: true},
//                         (err, updatedCity) => {
//                         if (err) console.log(err);
                        
//                         res.redirect(`/blogs/${updatedCity._id}`);
//                     });
//                 });
//             });
//         }
//     });
// });

// router.delete('/:id', (req, res) => {
//     db.Blog.findByIdAndDelete(req.params.id, (err, listingToDelete) => {
//         if(err) return console.log(err);

//         db.House.deleteMany({city: req.params.id}, (err, houses) => {
//             if(err) return console.log(err);

//             res.redirect('/listings');
//         });
//     });
// });
module.exports = router;

