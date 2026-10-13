const express = require('express');
const router = express.Router();
const {
  getTopics,
  createTopic,
  updateTopic,
  toggleTopicStatus,
  deleteTopic,
} = require('../controllers/topicController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getTopics)
  .post(createTopic);

router.route('/:id')
  .put(updateTopic)
  .delete(deleteTopic);

router.patch('/:id/status', toggleTopicStatus);

module.exports = router;
