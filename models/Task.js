const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Task = sequelize.define("Task", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("Pending", "Completed"),
      defaultValue: "Pending"
    },
    priority: {
      type: DataTypes.ENUM("Low", "Medium", "High"),
      defaultValue: "Medium"
    },
    due_date: {
      type: DataTypes.DATE
    },
    created_by: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: "tasks",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Task;
};
