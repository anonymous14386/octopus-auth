const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// SQLite database for users
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'data', 'auth.db'),
    logging: false
});

// User model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// Initialize database
const initDatabase = async () => {
    try {
        await sequelize.sync();
        console.log('Auth database initialized');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
};

module.exports = { sequelize, User, initDatabase };
