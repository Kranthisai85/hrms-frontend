'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add new columns
        const columnsToAdd = [
            {
                name: 'sub_department_id',
                definition: {
                    type: Sequelize.DataTypes.INTEGER,
                    allowNull: true,
                },
            },
            {
                name: 'grade_id',
                definition: {
                    type: Sequelize.DataTypes.INTEGER,
                    allowNull: true,
                },
            },
            {
                name: 'category_id',
                definition: {
                    type: Sequelize.DataTypes.INTEGER,
                    allowNull: true,
                },
            },
            {
                name: 'reporting_manager_id',
                definition: {
                    type: Sequelize.DataTypes.INTEGER,
                    allowNull: true,
                },
            },
            {
                name: 'invite_sent',
                definition: {
                    type: Sequelize.DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
            },
            {
                name: 'confirmation_date',
                definition: {
                    type: Sequelize.DataTypes.DATEONLY,
                    allowNull: true,
                },
            },
            {
                name: 'resignation_date',
                definition: {
                    type: Sequelize.DataTypes.DATEONLY,
                    allowNull: true,
                },
            },
            {
                name: 'relieved_date',
                definition: {
                    type: Sequelize.DataTypes.DATEONLY,
                    allowNull: true,
                },
            },
            {
                name: 'reason',
                definition: {
                    type: Sequelize.DataTypes.TEXT,
                    allowNull: true,
                },
            },
        ];

        // Add columns if they don't exist
        for (const column of columnsToAdd) {
            try {
                await queryInterface.addColumn('Employees', column.name, column.definition);
            } catch (error) {
                if (error.message.includes('already exists')) {
                    console.log(`Column ${column.name} already exists, skipping...`);
                } else {
                    throw error;
                }
            }
        }

        // Update existing columns to match model
        const columnsToUpdate = [
            {
                name: 'address',
                definition: {
                    type: Sequelize.DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                name: 'city',
                definition: {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: true,
                },
            },
            {
                name: 'state',
                definition: {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: true,
                },
            },
            {
                name: 'country',
                definition: {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: true,
                },
            },
            {
                name: 'pin_code',
                definition: {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: true,
                },
            },
            {
                name: 'work_schedule',
                definition: {
                    type: Sequelize.DataTypes.ENUM('Regular', 'Shift', 'Flexible'),
                    allowNull: true,
                    defaultValue: 'Regular',
                },
            },
            {
                name: 'basic_salary',
                definition: {
                    type: Sequelize.DataTypes.DECIMAL(10, 2),
                    allowNull: true,
                    defaultValue: 0.0,
                },
            },
            {
                name: 'bank_name',
                definition: {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: true,
                },
            },
            {
                name: 'account_number',
                definition: {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: true,
                },
            },
            {
                name: 'ifsc_code',
                definition: {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: true,
                },
            },
            {
                name: 'emergency_contact_name',
                definition: {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: true,
                },
            },
            {
                name: 'emergency_contact_phone',
                definition: {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: true,
                },
            },
            {
                name: 'emergency_contact_relation',
                definition: {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: true,
                },
            },
            {
                name: 'employment_status',
                definition: {
                    type: Sequelize.DataTypes.ENUM('Active', 'Inactive', 'On Leave', 'Terminated', 'Probation'),
                    allowNull: false,
                    defaultValue: 'Probation',
                },
            },
        ];

        for (const column of columnsToUpdate) {
            try {
                await queryInterface.changeColumn('Employees', column.name, column.definition);
            } catch (error) {
                console.log(`Error updating column ${column.name}: ${error.message}`);
            }
        }
    },

    down: async (queryInterface, Sequelize) => {
        // Remove added columns
        const columnsToRemove = [
            'sub_department_id',
            'grade_id',
            'category_id',
            'reporting_manager_id',
            'invite_sent',
            'confirmation_date',
            'resignation_date',
            'relieved_date',
            'reason',
        ];

        for (const column of columnsToRemove) {
            try {
                await queryInterface.removeColumn('Employees', column);
            } catch (error) {
                console.log(`Error removing column ${column}: ${error.message}`);
            }
        }

        // Revert updated columns (example: make them non-nullable again if needed)
        await queryInterface.changeColumn('Employees', 'address', {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false,
        });
        // Repeat for other columns as needed
    },
};