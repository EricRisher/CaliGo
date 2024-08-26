const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Spot = require("./Spot");

const Comment = sequelize.define("Comment", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  spotId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Spot,
      key: "id",
    },
  },
});

User.hasMany(Comment, { foreignKey: "userId" });
Spot.hasMany(Comment, { foreignKey: "spotId" });
Comment.belongsTo(User, { foreignKey: "userId" });
Comment.belongsTo(Spot, { foreignKey: "spotId" });

module.exports = Comment;
