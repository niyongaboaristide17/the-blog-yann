import { Article } from "../models/Article";
import { User } from "../models/User";

export class ArticleService{

    static async save(data){
        return await Article.create(data)
    }

    static async findByPk(pk){
        return await Article.findByPk(pk)
    }

    static async findAll(){
        return await Article.findAll()
    }

    static async findAllByUser(userId){
        return await Article.findAll({
            include: {
                model: User,
                where: {
                    id: userId
                }
            }
        })
    }

}