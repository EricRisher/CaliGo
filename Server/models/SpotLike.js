const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class SpotLike extends Model {}

SpotLike.init(
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
    modelName: "SpotLike",
    tableName: "SpotLikes", // Ensure the table name matches
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = SpotLike;
