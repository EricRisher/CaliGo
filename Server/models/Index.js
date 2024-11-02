// Import Models
const User = require("./User");
const Spot = require("./Spot");
const Comment = require("./Comment");
const Like = require("./Like");
const SavedSpot = require("./SavedSpot");

// User-Spot (Created Spots) Relationship
User.hasMany(Spot, {
  foreignKey: "userId",
  as: "mySpots",
  onDelete: "CASCADE",
});
Spot.belongsTo(User, {
  foreignKey: "userId",
  as: "creator",
  onDelete: "CASCADE",
});

// User-Comment Relationship
User.hasMany(Comment, {
  foreignKey: "userId",
  as: "userComments",
  onDelete: "CASCADE",
});
Comment.belongsTo(User, {
  foreignKey: "userId",
  as: "commentAuthor",
  onDelete: "CASCADE",
});

// Spot-Comment Relationship
Spot.hasMany(Comment, {
  foreignKey: "spotId",
  as: "Comments",
  onDelete: "CASCADE",
});
Comment.belongsTo(Spot, {
  foreignKey: "spotId",
  as: "commentedSpot",
  onDelete: "CASCADE",
});

// User-Spot (Liked Spots) Many-to-Many Relationship
User.belongsToMany(Spot, {
  through: Like,
  as: "LikedSpots",
  foreignKey: "userId",
  otherKey: "spotId",
  onDelete: "CASCADE",
});
Spot.belongsToMany(User, {
  through: Like,
  as: "UsersWhoLiked",
  foreignKey: "spotId",
  otherKey: "userId",
  onDelete: "CASCADE",
});

// User-Spot (Saved Spots) Many-to-Many Relationship
User.belongsToMany(Spot, {
  through: SavedSpot,
  as: "SavedSpots",
  foreignKey: "userId",
  otherKey: "spotId",
  onDelete: "CASCADE",
});
Spot.belongsToMany(User, {
  through: SavedSpot,
  as: "UsersWhoSaved",
  foreignKey: "spotId",
  otherKey: "userId",
  onDelete: "CASCADE",
});

// Export all models for use in other files
module.exports = { User, Spot, Comment, Like, SavedSpot };
