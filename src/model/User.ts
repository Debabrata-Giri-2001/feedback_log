import mongoose, { Schema, Document } from "mongoose";

// message schema
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

// user schema
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  varifyCode: string;
  varifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "user name is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm, "enter valid email"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  varifyCode: {
    type: String,
    required: [true, "varify Code is required"],
  },
  varifyCodeExpiry: {
    type: Date,
    required: [true, "varify Code Expiry  is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [messageSchema],
});


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",userSchema)

export default UserModel;