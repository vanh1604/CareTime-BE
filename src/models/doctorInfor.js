"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DoctorInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DoctorInfo.belongsTo(models.User, {
        foreignKey: "doctorId",
        targetKey: "id",
      });
      DoctorInfo.hasOne(models.Markdown, { foreignKey: "doctorId" });
      DoctorInfo.belongsTo(models.allCode, {
        foreignKey: "priceId",
        targetKey: "key",
        as: "priceData",
      });
      DoctorInfo.belongsTo(models.allCode, {
        foreignKey: "paymentId",
        targetKey: "key",
        as: "paymentData",
      });
      DoctorInfo.belongsTo(models.allCode, {
        foreignKey: "provinceId",
        targetKey: "key",
        as: "provinceData",
      });
      // define association here
    }
  }
  DoctorInfo.init(
    {
      doctorId: DataTypes.INTEGER,
      priceId: DataTypes.STRING,
      provinceId: DataTypes.STRING,
      yearsOfExperience: DataTypes.INTEGER,
      paymentId: DataTypes.STRING,
      addressClinic: DataTypes.STRING,
      nameClinic: DataTypes.STRING,
      note: DataTypes.STRING,
      count: DataTypes.INTEGER,
      isOnline: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "DoctorInfo",
      freezeTableName: true,
    }
  );
  return DoctorInfo;
};
