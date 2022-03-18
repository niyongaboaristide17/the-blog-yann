import {Sequelize, DataTypes, Model} from 'sequelize'

const sequelize = new Sequelize("theblog", "postgres", "postgres", {
    host: "localhost",
    dialect: "postgres",
});

const Article = sequelize.define('article', {
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.TEXT,
        nullable: false,

    },
    content: {
        type: DataTypes.TEXT,
        nullable: false
    }
})

export {Article,}