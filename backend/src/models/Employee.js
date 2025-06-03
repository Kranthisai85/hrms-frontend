const { DataTypes } = require('sequelize');

module.exports = async (sequelize) => {
    const Employee = sequelize.define('Employee', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        employeeId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female', 'Other'),
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pinCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        designationId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        branchId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        joiningDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        employmentStatus: {
            type: DataTypes.ENUM('Active', 'Inactive', 'On Leave', 'Terminated'),
            allowNull: false,
            defaultValue: 'Active'
        },
        employmentType: {
            type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Intern'),
            allowNull: false
        },
        workSchedule: {
            type: DataTypes.ENUM('Regular', 'Shift', 'Flexible'),
            allowNull: false
        },
        basicSalary: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        bankName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        accountNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ifscCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        panNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        aadharNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        emergencyContactName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        emergencyContactPhone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        emergencyContactRelation: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'Employees',
        underscored: true
    });

    // Define associations after model initialization
    Employee.associate = (models) => {
        Employee.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return Employee;
};
