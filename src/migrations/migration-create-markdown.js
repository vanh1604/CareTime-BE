"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Markdowns", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      biography: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      education: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      achievements: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      certifications: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      researchPapers: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      doctorId: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      specialtyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      clinicId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Markdowns");
  },
};
