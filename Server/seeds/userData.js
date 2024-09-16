const User = require("../models/User.js");

const userData = [
  {
    user_id: 1,
    username: "testUser1",
    email: "test@gmail.com",
    password: "password12345",
  },
  {
    user_id: 2,
    username: "testUser2",
    email: "test2@gmail.com",
    password: "password12345",
  },
  {
    user_id: 3,
    username: "testUser3",
    email: "test3@gmail.com",
    password: "password12345",
  },
  {
    user_id: 4,
    username: "testUser4",
    email: "test4@gmail.com",
    password: "password12345",
  },
  {
    user_id: 5,
    username: "testUser5",
    email: "test5@gmail.com",
    password: "password12345",
  },
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;
