const Spot = require("../models/Spot.js");

const spotData = [
  {
    spotName: "Huntington Beach",
    description: "Surf City USA",
    location: "Huntington Beach, CA",
    image:
      "https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500.jpg",
    userId: 1,
  },
  {
    spotName: "Malibu",
    description: "Beautiful beach",
    location: "Malibu, CA",
    image:
      "https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500.jpg",
    userId: 2,
  },
  {
    spotName: "Venice Beach",
    description: "Funky beach",
    location: "Venice Beach, CA",
    image:
      "https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500.jpg",
    userId: 3,
  },
  {
    spotName: "Santa Monica Beach",
    description: "Beautiful beach",
    location: "Santa Monica, CA",
    image:
      "https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500.jpg",
    userId: 4,
  },
  {
    spotName: "Newport Beach",
    description: "Beautiful beach",
    location: "Newport Beach, CA",
    image:
      "https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500.jpg",
    userId: 5,
  },
];

const seedSpots = () => Spot.bulkCreate(spotData);

module.exports = seedSpots;