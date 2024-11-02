// models/Like.js

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Like extends Model {}

Like.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Spot",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Like",
    tableName: "likes",
    timestamps: true,
    uniqueKeys: {
      like_unique: {
        fields: ["userId", "spotId"],
      },
    },
  }
);

module.exports = Like;
