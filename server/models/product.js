const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Product = sequelize.define(
        "Product",
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },

            serialNumber: {
                type: DataTypes.STRING(255),
                allowNull: true,
                unique: true
            },

            category: {
                type: DataTypes.TEXT,
                allowNull: false
            },

            brand: {
                type: DataTypes.TEXT,
                allowNull: false
            },

            model: {
                type: DataTypes.TEXT,
                allowNull: false
            },

            purchasedFrom: {
                type: DataTypes.TEXT,
                allowNull: false
            },

            purchasedDate: {
                type: DataTypes.DATE,
                allowNull: false
            },

            warrantyStartDate: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },

            warrantyEndDate: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },

            warrantyExtendable: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },

            assetPrice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },

            assetImages: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: true
            },

            UserId: {
                type: DataTypes.BIGINT,
                allowNull: true
            }
        },
        {
            tableName: "Products",
            timestamps: true,
            paranoid: true,
            indexes: [
                {
                    unique: true,
                    fields: ["serialNumber"]
                }
            ],
            validate: {
                checkWarrantyDates() {
                    if (
                        this.warrantyStartDate &&
                        this.purchasedDate &&
                        new Date(this.warrantyStartDate) < new Date(this.purchasedDate)
                    ) {
                        throw new Error(
                            "Warranty start date must be on or after purchase date"
                        );
                    }

                    if (
                        this.warrantyEndDate &&
                        this.warrantyStartDate &&
                        new Date(this.warrantyEndDate) <= new Date(this.warrantyStartDate)
                    ) {
                        throw new Error(
                            "Warranty end date must be after warranty start date"
                        );
                    }
                },

                checkPrice() {
                    if (this.assetPrice <= 0) {
                        throw new Error("Asset price must be greater than 0");
                    }
                }
            }
        }
    );

    Product.associate = (models) => {
        Product.belongsTo(models.User, {
            foreignKey: "UserId",
            as: "User",
            onUpdate: "CASCADE",
            onDelete: "SET NULL"
        });
    };

    return Product;
};
