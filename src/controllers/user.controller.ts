import { User, UserAttrsWithoutId, UserDoc } from "../models/user.model";

class Create {
    static newUser = async (user: UserAttrsWithoutId) => {
        const newUser = User.build(user);
        await newUser.save();

        return newUser;
    }
}

class Read {
    static byId = async (userId: UserDoc['id']) => {
        const user = await User.findOne({ _id: userId });
        return user;
    }
    static byPhone = async (phone: number) => {
        const user = await User.findOne({ phone });
        return user;
    }
    static byEmail = async (email: string) => {
        const user = await User.findOne({ email });
        return user;
    }

    static userCount = async (phone: number, email: string) => {
        const count = await User.countDocuments({ email, phone });
        return count;
    }
}

export default {
    Create,
    Read
}