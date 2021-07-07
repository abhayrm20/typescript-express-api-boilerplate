import mongoose, { Schema } from "mongoose";

export interface UserAttrsWithoutId {
    name: string;
    phone: number;
    email: string;
    password: string;
};

export interface UserAttrs extends UserAttrsWithoutId {
    id: string;
};

export interface UserDoc extends mongoose.Document, UserAttrsWithoutId { };

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
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
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