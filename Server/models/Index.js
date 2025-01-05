// Import Models
const User = require("./User");
const Spot = require("./Spot");
const SpotImage = require("./SpotImage");
const Comment = require("./Comment");
const Like = require("./Like");
const SavedSpot = require("./SavedSpot");

// User-Spot (Created Spots) Relationship
User.hasMany(Spot, {
  foreignKey: "userId",
  as: "mySpots", // Alias for spots created by the user
  onDelete: "CASCADE",
});
Spot.belongsTo(User, {
  foreignKey: "userId",
  as: "creator", // Alias for the user who created the spot
  onDelete: "CASCADE",
});

// User-Comment Relationship
User.hasMany(Comment, {
  foreignKey: "userId",
  as: "userComments", // Alias for comments by the user
  onDelete: "CASCADE",
});
Comment.belongsTo(User, {
  foreignKey: "userId",
  as: "commentAuthor", // Alias for the user who authored the comment
  onDelete: "CASCADE",
});

// Spot-SpotImage Relationship
Spot.hasMany(SpotImage, {
  foreignKey: "spotId",
  as: "images",
  onDelete: "CASCADE",
});
SpotImage.belongsTo(Spot, {
  foreignKey: "spotId",
  as: "spot",
});

// Spot-Comment Relationship
Spot.hasMany(Comment, {
  foreignKey: "spotId",
  as: "Comments", // Alias for comments on a spot
  onDelete: "CASCADE",
});
Comment.belongsTo(Spot, {
  foreignKey: "spotId",
  as: "commentedSpot", // Alias for the spot being commented on
  onDelete: "CASCADE",
});

// Spot-User Many-to-Many Relationship (Likes)
User.belongsToMany(Spot, {
  through: Like,
  as: "LikedSpots", // Alias for spots liked by the user
  foreignKey: "userId",
  otherKey: "spotId",
  onDelete: "CASCADE",
});

Spot.belongsToMany(User, {
  through: Like,
  as: "UsersWhoLiked", // Alias for users who liked the spot
  foreignKey: "spotId",
  otherKey: "userId",
  onDelete: "CASCADE",
});

// User-Spot (Saved Spots) Many-to-Many Relationship
User.belongsToMany(Spot, {
  through: SavedSpot,
  as: "SavedSpots", // Alias for spots saved by the user
  foreignKey: "userId",
  otherKey: "spotId",
  onDelete: "CASCADE",
});
Spot.belongsToMany(User, {
  through: SavedSpot,
  as: "UsersWhoSaved", // Alias for users who saved the spot
  foreignKey: "spotId",
  otherKey: "userId",
  onDelete: "CASCADE",
});

// Export all models for use in other files
module.exports = { User, Spot, SpotImage, Comment, Like, SavedSpot };
