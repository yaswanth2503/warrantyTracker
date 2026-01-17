const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const UserRole = sequelize.define(
        "UserRole",
        {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            }
        },
        {
            tableName: "UserRoles",
            timestamps: true
        }
    );

    UserRole.associate = (models) => {
        UserRole.hasMany(models.User);
    };

    return UserRole;
};
