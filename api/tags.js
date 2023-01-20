const express = require('express');
const { getAllTags, getPostsByTagName } = require('../db');
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();
  
    res.send({
      tags
    });
  });

  tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    // read the tagname from the params
        const tag = req.params.tagName.slice(3)
    try {
      // use our method to get posts by tag name from the db
      // send out an object to the client { posts: // the posts }
      const posts = await getPostsByTagName(tag)
      console.log(posts)
      res.send({ posts })
    } catch ({ name, message }) {
      // forward the name and message to the error handler
      next({ name, message })
    }
  });

module.exports = tagsRouter;