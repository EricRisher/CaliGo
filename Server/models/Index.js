const User = require("./User");
const Spot = require("./Spot");
const Comment = require("./Comment");

User.hasMany(Spot, { foreignKey: "userId", onDelete: "CASCADE" });

User.hasMany(Comment, { foreignKey: "userId" });

Spot.belongsTo(User, { foreignKey: "userId" });

Spot.hasMany(Comment, { foreignKey: "spotId", onDelete: "CASCADE" });

Comment.belongsTo(User, { foreignKey: "userId" });

Comment.belongsTo(Spot, { foreignKey: "spotId" });

module.exports = { User, Spot, Comment };