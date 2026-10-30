const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Employee = sequelize.define("Employee", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    department: {
      type: DataTypes.STRING(50)
    },
    designation: {
      type: DataTypes.STRING(50)
    },
    email: {
      type: DataTypes.STRING(100)
    },
    phone: {
      type: DataTypes.STRING(20)
    },
    location: {
      type: DataTypes.STRING(50)
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive", "Probation", "Intern"),
      defaultValue: "Active"
    },
    created_by: {
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: "employees",
    timestamps: false
  });

  return Employee;
};
