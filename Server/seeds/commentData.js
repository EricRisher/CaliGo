const Comment = require("../models/Comment.js");

const commentData = [
  {
    commentText: "Great spot!",
    userId: 1,
    spotId: 1,
  },
  {
    commentText: "Beautiful beach!",
    userId: 2,
    spotId: 2,
  },
  {
    commentText: "Funky beach!",
    userId: 3,
    spotId: 3,
  },
  {
    commentText: "Beautiful beach!",
    userId: 4,
    spotId: 4,
  },
  {
    commentText: "Beautiful beach!",
    userId: 5,
    spotId: 5,
  },
  {
    commentText: "WOW!",
    userId: 1,
    spotId: 2,
  },
  {
    commentText: "Great spot!",
    userId: 2,
    spotId: 3,
  },
  {
    commentText: "Beautiful beach!",
    userId: 3,
    spotId: 4,
  },
  {
    commentText: "Funky beach!",
    userId: 4,
    spotId: 5,
  },
  {
    commentText: "Beautiful beach!",
    userId: 5,
    spotId: 1,
  },
  {
    commentText: "Great spot!",
    userId: 1,
    spotId: 3,
  },
  {
    commentText: "Beautiful beach!",
    userId: 2,
    spotId: 4,
  },
  {
    commentText: "Funky beach!",
    userId: 3,
    spotId: 5,
  },
  {
    commentText: "Beautiful beach!",
    userId: 4,
    spotId: 1,
  },
  {
    commentText: "Beautiful beach!",
    userId: 5,
    spotId: 2,
  },
  {
    commentText: "WOW!",
    userId: 1,
    spotId: 4,
  },
  {
    commentText: "Great spot!",
    userId: 2,
    spotId: 5,
  },
  {
    commentText: "Beautiful beach!",
    userId: 3,
    spotId: 1,
  },
  {
    commentText: "Funky beach!",
    userId: 4,
    spotId: 2,
  },
  {
    commentText: "Beautiful beach!",
    userId: 5,
    spotId: 3,
  },
];

const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;
