const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Document = sequelize.define(
    "Document",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      document_name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      file_path: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      uploaded_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: "documents",
      timestamps: false
    }
  );

  return Document;
};
