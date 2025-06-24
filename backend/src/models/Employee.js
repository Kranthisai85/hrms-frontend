const { DataTypes } = require('sequelize');

module.exports = async (sequelize) => {
    const Employee = sequelize.define(
        'Employee',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            employeeId: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            dateOfBirth: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            gender: {
                type: DataTypes.ENUM('Male', 'Female', 'Other'),
                allowNull: false,
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: true, // Changed to allow null
            },
            city: {
                type: DataTypes.STRING,
                allowNull: true, // Changed to allow null
            },
            state: {
                type: DataTypes.STRING,
                allowNull: true, // Changed to allow null
            },
            country: {
                type: DataTypes.STRING,
                allowNull: true, // Changed to allow null
            },
            pinCode: {
                type: DataTypes.STRING,
                allowNull: true, // Changed to allow null
            },
            departmentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            designationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            branchId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            subDepartmentId: {
                // New field
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            gradeId: {
                // New field
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            categoryId: {
                // New field
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            reportingManagerId: {
                // New field
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            joiningDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            employmentStatus: {
                type: DataTypes.ENUM('Active', 'Inactive', 'On Leave', 'Terminated', 'Probation'), // Added Probation
                allowNull: false,
                defaultValue: 'Probation',
            },
            employmentType: {
                type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Intern'),
                allowNull: false,
            },
            workSchedule: {
                type: DataTypes.ENUM('Regular', 'Shift', 'Flexible'),
                allowNull: true, // Changed to allow null
                defaultValue: 'Regular',
            },
            basicSalary: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true, // Changed to allow null
                defaultValue: 0.0,
            },
            bankName: {
                type: DataTypes.STRING,
                allowNull: true, // Changed to allow null
            },
            accountNumber: {
                type: DataTypes.STRING,
                allowNull: true, // Changed to allow null
            },
            ifscCode: {
                type: DataTypes.STRING,
                allowNull: true, // Changed to allow null
            },
            panNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            aadharNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            emergencyContactName: {
                type: DataTypes.STRING,
                allowNull: true, // Changed to allow null
            },
            emergencyContactPhone: {
                type: DataTypes.STRING,
                allowNull: true, // Changed to allow null
            },
            emergencyContactRelation: {
                type: DataTypes.STRING,
                allowNull: true, // Changed to allow null
            },
            inviteSent: {
                // New field
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            confirmationDate: {
                // New field
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            resignationDate: {
                // New field
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            relievedDate: {
                // New field
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            reason: {
                // New field
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            timestamps: true,
            tableName: 'Employees',
            underscored: true,
        }
    );

    // Define associations
    Employee.associate = (models) => {
        Employee.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
        // Add associations for new fields if needed
        Employee.belongsTo(models.Department, {
            foreignKey: 'departmentId',
            as: 'department',
        });
        Employee.belongsTo(models.Designation, {
            foreignKey: 'designationId',
            as: 'designation',
        });
        Employee.belongsTo(models.Branch, {
            foreignKey: 'branchId',
            as: 'branch',
        });
        Employee.belongsTo(models.SubDepartment, {
            foreignKey: 'subDepartmentId',
            as: 'subDepartment',
        });
        Employee.belongsTo(models.Grade, {
            foreignKey: 'gradeId',
            as: 'grade',
        });
        Employee.belongsTo(models.Category, {
            foreignKey: 'categoryId',
            as: 'category',
        });
        Employee.belongsTo(models.Employee, {
            foreignKey: 'reportingManagerId',
            as: 'reportingManager',
        });
    };

    return Employee;
};