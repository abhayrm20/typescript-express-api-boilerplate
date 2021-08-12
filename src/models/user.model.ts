import mongoose, { Schema } from "mongoose";
import { Roles } from "../common";

export interface UserAttrsWithoutId {
    name: string;
    phone: number;
    email?: string;
    password: string;
    role?: Roles;
};

export interface UserAttrs extends UserAttrsWithoutId {
    id: string;
};

export interface UserDoc extends mongoose.Document, UserAttrs { };

export interface UserModel extends mongoose.Model<UserDoc> {
    build(user: UserAttrsWithoutId): UserDoc;
}

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            required: false,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: false,
            default: Roles.User,
            enum: Roles,
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.pin;
                delete ret.__v;
            },
        },
    }
);

userSchema.set('versionKey', 'version');

userSchema.statics.build = (user: UserAttrs) => {
    return new User(user);
  };

userSchema.index({ phone: 1 });

export const User = mongoose.model<UserDoc, UserModel>('Users', userSchema);
User.ensureIndexes();