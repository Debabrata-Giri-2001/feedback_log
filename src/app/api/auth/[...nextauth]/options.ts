import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOption: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("user not fount with this email");
          }
          if (!user.isVerified) {
            throw new Error("user not verified");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password,
            user?.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("invalid password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session) {
        session.user._id = token._id;
        session.user.isVerified = token?.isVerified;
        session.user.isAcceptingMessage = token?.isAcceptingMessage;
        session.user.username = token?.username;
        session.user.email = token?.email;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user?.isVerified;
        token.isAcceptingMessage = user?.isAcceptingMessage;
        token.username = user?.username;
        token.email = user?.email;
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
