const SpotLike = require("../models/SpotLike.js");

const likeData = [
    {
        userId: 1,
        spotId: 1,
    },
    {
        userId: 2,
        spotId: 2,
    },
    {
        userId: 3,
        spotId: 3,
    },
    {
        userId: 4,
        spotId: 4,
    },
    {
        userId: 5,
        spotId: 5,
    },
    {
        userId: 1,
        spotId: 2,
    },
    {
        userId: 2,
        spotId: 3,
    },
    {
        userId: 3,
        spotId: 4,
    },
    {
        userId: 4,
        spotId: 5,
    },
    {
        userId: 5,
        spotId: 1,
    },
    {
        userId: 1,
        spotId: 3,
    },
    {
        userId: 2,
        spotId: 4,
    },
];

const seedLikes = () => SpotLike.bulkCreate(likeData);

module.exports = seedLikes;