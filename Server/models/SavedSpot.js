const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class SavedSpot extends Model {}

SavedSpot.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "User",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "Spot",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "SavedSpot",
    tableName: "SavedSpots",
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = SavedSpot;
