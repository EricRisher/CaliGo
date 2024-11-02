const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class SavedSpot extends Model {}

SavedSpot.init(
  {
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
    modelName: "SavedSpot",
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = SavedSpot;
