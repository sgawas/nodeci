const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const cleanCache = require('../middlewares/cleanCache');

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    const blogs = await Blog.find({_user: req.user.id})
      .cache({key : req.user.id});
    res.send(blogs);
  });

  app.post('/api/blogs', requireLogin, cleanCache, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};

//console.log('CachedBlogs:', cachedBlogs);
//[{"_id":"5b274dd857bc0a81607ddf30","title":"Test blog","content":"I write a lot of JavaScript and spend a lot of time fixing my own bugs. These aren’t huge architecture issues, they’re much smaller than that. I’m talking about things like misspelled variable names.","_user":"5b274d52726afe80cb527391","__v":0,"createdAt":"2018-06-18T06:14:48.880Z"}]
    

//console.log('JSON.parse(cachedBlogs):', JSON.parse(cachedBlogs));
//[ { _id: '5b274dd857bc0a81607ddf30',
  //   title: 'Test blog',
  //   content: 'I write a lot of JavaScript and spend a lot of time fixing my own bugs. These aren’t huge architecture issues, they’re much smaller than that. I’m talking about things like misspelled variable names.',
   // _user: '5b274d52726afe80cb527391',
 //    __v: 0,
//    createdAt: '2018-06-18T06:14:48.880Z' } ]

      

//console.log('blogs:', blogs);
//[ { _id: 5b274dd857bc0a81607ddf30,
//     title: 'Test blog',
//     content: 'I write a lot of JavaScript and spend a lot of time fixing my own bugs. These aren’t huge architecture issues, they’re much smaller than that. I’m talking about things like misspelled variable names.',
//     _user: 5b274d52726afe80cb527391,
//     __v: 0,
//     createdAt: 2018-06-18T06:14:48.880Z }

//console.log('JSON.stringify(blogs):', JSON.stringify(blogs));
//[{"_id":"5b274dd857bc0a81607ddf30","title":"Test blog","content":"I write a lot of JavaScript and spend a lot of time fixing my own bugs. These aren’t huge architecture issues, they’re much smaller than that. I’m talking about things like misspelled variable names.","_user":"5b274d52726afe80cb527391","__v":0,"createdAt":"2018-06-18T06:14:48.880Z"},

// const redis = require('redis');
//     const redisUrl = 'redis://127.0.0.1:6379';
//     const client = redis.createClient(redisUrl);
//     const util = require('util');
//     client.get = util.promisify(client.get);

//     const cachedBlogs = await client.get(req.user.id);
    
//     if(cachedBlogs){
//       console.log('Serving from Radis Cache');
//       return res.send(JSON.parse(cachedBlogs));
//     }
//     const blogs = await Blog.find({ _user: req.user.id });
//     console.log('Serving from Mongo DB');
//     res.send(blogs);
//     client.set(req.user.id, JSON.stringify(blogs));