// SpotImage.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const Spot = require("./Spot");

class SpotImage extends Model {}

SpotImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
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
    timestamps: true,
    freezeTableName: true,
    modelName: "SpotImage",
  }
);

module.exports = SpotImage;
