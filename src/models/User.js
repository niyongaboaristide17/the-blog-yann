import {Sequelize, DataTypes, Model} from 'sequelize'
import { Article } from './Article';

const sequelize = new Sequelize("theblog", "postgres", "postgres", {
    host: "localhost",
    dialect: "postgres",
});

const User = sequelize.define('user', {
    names: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true

    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

Article.belongsTo(User)
User.hasMany(Article)

export {User,}