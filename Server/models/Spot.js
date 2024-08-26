const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Spot = sequelize.define("Spot", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

User.hasMany(Spot, { foreignKey: "userId" });
Spot.belongsTo(User, { foreignKey: "userId" });

module.exports = Spot;
