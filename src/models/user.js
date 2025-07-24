"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.allCode, {
        foreignKey: "roleId",
        targetKey: "key",
        as: "roleData",
      });
      User.belongsTo(models.allCode, {
        foreignKey: "positionId",
        targetKey: "key",
        as: "positionData",
      });
      User.hasOne(models.DoctorInfo, {
        foreignKey: "doctorId",

        as: "doctorInfoData",
      });
      User.hasOne(models.Markdown, {
        foreignKey: "doctorId",
        as: "markdownData",
      });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      gender: DataTypes.STRING,
      roleId: DataTypes.STRING,
      password: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      positionId: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
