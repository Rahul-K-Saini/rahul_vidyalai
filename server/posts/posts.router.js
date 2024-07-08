const express = require('express');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');
const axios = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
  const posts = await fetchPosts((req.query));

  const postsWithImages = await Promise.all(posts.map(async (post) => {
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);
      const photos = response.data.slice(0, 3).map(photo => ({ url: photo.url }));

      return {
        ...post,
        images: photos,
      };
    } catch (error) {
      console.log(`Error fetching photos for post ${post.id}:`, error);
      return {
        ...post,
        images: [],
      };
    }
  }));

  res.json(postsWithImages);
});

module.exports = router;
