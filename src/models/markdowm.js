const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Markdown extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Markdown.belongsTo(models.DoctorInfo, {
        foreignKey: "doctorId",
        tagetKey: "doctorId",
      });
      Markdown.belongsTo(models.User, {
        foreignKey: "doctorId",
        tagetKey: "id",
      });
    }
  }
  Markdown.init(
    {
      biography: DataTypes.TEXT("long"),
      education: DataTypes.TEXT("long"),
      achievements: DataTypes.TEXT("long"),
      certifications: DataTypes.TEXT("long"),
      researchPapers: DataTypes.TEXT("long"),
      doctorId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
      description: DataTypes.TEXT("long"),
    },
    {
      sequelize,
      modelName: "Markdown",
    }
  );
  return Markdown;
};
