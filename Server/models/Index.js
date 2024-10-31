// Import Models
const User = require("./User");
const Spot = require("./Spot");
const Comment = require("./Comment");
const SpotLike = require("./SpotLike");
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
  as: "userComments", // Alias for user's comments
  onDelete: "CASCADE",
});
Comment.belongsTo(User, {
  foreignKey: "userId",
  as: "commentAuthor", // Reference to comment author
  onDelete: "CASCADE",
});

// Spot-Comment Relationship
Spot.hasMany(Comment, {
  foreignKey: "spotId",
  as: "Comments", // Align this alias with what Sequelize expects
  onDelete: "CASCADE",
});
Comment.belongsTo(Spot, {
  foreignKey: "spotId",
  as: "commentedSpot", // Reference to spot being commented on
  onDelete: "CASCADE",
});

// User-Spot (Liked Spots) Many-to-Many Relationship
User.belongsToMany(Spot, {
  through: SpotLike,
  as: "LikedSpots",
  foreignKey: "userId",
  otherKey: "spotId",
  onDelete: "CASCADE",
});

Spot.belongsToMany(User, {
  through: SpotLike,
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

module.exports = { User, Spot, Comment, SpotLike, SavedSpot };
