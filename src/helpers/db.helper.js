import { Sequelize } from "sequelize";
import { Article } from "../models/Article";
import { User } from "../models/User";

const sequelize = new Sequelize("theblog", "postgres", "postgres", {
    host: "localhost",
    dialect: "postgres",
});

const initDatabase = async () => {
    sequelize.authenticate()
    await User.sync()
    await Article.sync()
}

export default initDatabase
