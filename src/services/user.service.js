import { User } from "../models/User";

export class UserService{

    static async save(data){
        return await User.create(data)
    }

    static async findByPk(pk){
        return await User.findByPk(pk)
    }

    static async findOneByEmail(email){

        return await User.findOne({ where: { email: email } })
        
    }

    static async findAll(){
        return await User.findAll()
    }

}