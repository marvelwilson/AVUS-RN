import User from "../../models/user.model";

class UserService {
    async getById(id: string) {
        return User.findById(id).populate("wallet");
    }

    async list() {
        return User.find().populate("wallet");
    }
}

export default new UserService();
