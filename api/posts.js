const express = require('express');
const { getAllPosts, createPost, updatePost, getPostById } = require('../db');
const postsRouter = express.Router();
const { requireUser } = require('./utils');


postsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");
    
    next();
});

postsRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content, tags = "" } = req.body;
  
    const tagArr = tags.trim().split(/\s+/)
    const postData = {};
  
    // only send the tags if there are some to send
    if (tagArr.length) {
      postData.tags = tagArr;
    }
  
    try {
      // add authorId, title, content to postData object
      // const post = await createPost(postData);
      // this will create the post and the tags for us
      // if the post comes back, res.send({ post });
      // otherwise, next an appropriate error object 
        postData.title = title;
        postData.content = content;
        postData.authorId = req.user.id

        const post = createPost(postData)
        res.send({ post })
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

  postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
    const { postId } = req.params;
    const { title, content, tags } = req.body;
  
    const updateFields = {};
  
    if (tags && tags.length > 0) {
      updateFields.tags = tags.trim().split(/\s+/);
    }
  
    if (title) {
      updateFields.title = title;
    }
  
    if (content) {
      updateFields.content = content;
    }
  
    try {
      const originalPost = await getPostById(postId);
  
      if (originalPost.author.id === req.user.id) {
        const updatedPost = await updatePost(postId, updateFields);
        res.send({ post: updatedPost })
      } else {
        next({
          name: 'UnauthorizedUserError',
          message: 'You cannot update a post that is not yours'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

postsRouter.get('/', async (req, res) => {
    const posts = await getAllPosts();
  
    res.send({
      posts
    });
  });

module.exports = postsRouter;