const bcrypt = require("bcryptjs");
const { User, Employee, sequelize } = require("./models");

async function migrateEmployeesToUsers() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Get all employees
    const employees = await Employee.findAll();
    console.log(`📊 Found ${employees.length} employees`);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const employee of employees) {
      // Skip if employee doesn't have email
      if (!employee.email) {
        console.log(`⚠️ Skipping employee ${employee.id} - No email`);
        skipped++;
        continue;
      }

      // Check if employee already has a user_id and that user exists
      if (employee.user_id) {
        const userExists = await User.findByPk(employee.user_id);
        if (userExists) {
          console.log(`✓ Employee ${employee.id} already linked to user ${employee.user_id}`);
          skipped++;
          continue;
        }
      }

      // Check if a user with this email already exists
      let user = await User.findOne({ where: { email: employee.email } });

      if (!user) {
        // Create new user for this employee
        const defaultPassword = "Employee@123";
        const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

        user = await User.create({
          name: employee.name,
          email: employee.email,
          password: hashedPassword,
          role: "Employee"
        });

        console.log(`🆕 Created user ${user.id} for employee ${employee.id} (${employee.email})`);
        created++;
      } else {
        console.log(`ℹ️ User already exists for email ${employee.email}`);
      }

      // Link employee to user
      await Employee.update(
        { user_id: user.id },
        { where: { id: employee.id } }
      );

      console.log(`🔗 Linked employee ${employee.id} to user ${user.id}`);
      updated++;
    }

    console.log("\n" + "=".repeat(50));
    console.log("📋 MIGRATION SUMMARY:");
    console.log(`   New users created: ${created}`);
    console.log(`   Employees linked: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log("=".repeat(50));
    console.log("\n✅ Migration completed successfully!");
    console.log("ℹ️ Default password for new users: Employee@123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migrateEmployeesToUsers();
