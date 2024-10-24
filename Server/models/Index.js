const User = require("./User");
const Spot = require("./Spot");
const Comment = require("./Comment");
const SpotLike = require("./SpotLike");
const SavedSpot = require("./SavedSpot");



// User-Spot Relationship
User.hasMany(Spot, { foreignKey: "userId", onDelete: "CASCADE" });
Spot.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// User-Comment Relationship
User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// Spot-Comment Relationship
Spot.hasMany(Comment, { foreignKey: "spotId", onDelete: "CASCADE" });
Comment.belongsTo(Spot, { foreignKey: "spotId", onDelete: "CASCADE" });

// SpotLike relationships (Many-to-Many between User and Spot)
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

// SavedSpot relationships (Many-to-Many between User and Spot)
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
