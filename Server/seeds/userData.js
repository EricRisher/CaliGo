const User = require("../models/User.js");

const userData = [
  {
    id: 1,
    username: "testUser1",
    email: "test@gmail.com",
    password: "password12345",
    xp: 0,
  },
  {
    id: 2,
    username: "testUser2",
    email: "test2@gmail.com",
    password: "password12345",
    xp: 0,
  },
  {
    id: 3,
    username: "testUser3",
    email: "test3@gmail.com",
    password: "password12345",
    xp: 0,
  },
  {
    id: 4,
    username: "testUser4",
    email: "test4@gmail.com",
    password: "password12345",
    xp: 0,
  },
  {
    id: 5,
    username: "testUser5",
    email: "test5@gmail.com",
    password: "password12345",
    xp: 0,
  },
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;
