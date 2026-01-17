const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        lastName: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        UserRoleId: {
            type: DataTypes.BIGINT
        }
    },
        {
            tableName: "Users",
            paranoid: true,
            timestamps: true
        });

    User.beforeCreate(async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
    });

    User.beforeUpdate(async (user) => {
        if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10);
        }
    });

    User.associate = (models) => {
        User.belongsTo(models.UserRole);
    }

    return User;
}