const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const User = require("./User");
const Spot = require("./Spot");

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    commentText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Spot,
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: true, // Changed to true
    freezeTableName: true,
    modelName: "Comment",
  }
);

module.exports = Comment;
