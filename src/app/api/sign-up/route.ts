import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { sendVerifyCode } from "@/helpers/sendVerifyCode";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const exitingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (exitingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "username already taken",
        },
        {
          status: 400,
        }
      );
    }

    const exitingUserByEmail = await UserModel.findOne({
      email,
    });

    const verifyCode = Math.floor(10000 + Math.random() * 900000).toString();

    if (exitingUserByEmail) {
      if (exitingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exits with this email",
          },
          {
            status: 400,
          }
        );
      } else {
        const hasedPassword = await bcryptjs.hash(password, 10);
        exitingUserByEmail.password = hasedPassword;
        exitingUserByEmail.verifyCode = verifyCode;
        exitingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await exitingUserByEmail.save();
      }
    } else {
      const hasedPassword = await bcryptjs.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 1);


      const newUser = new UserModel({
        username: username,
        email,
        password: hasedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // send verification email

    const emailResponse = await sendVerifyCode(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. place verify your email",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error in register user", error);
    return Response.json(
      {
        success: false,
        message: "Error in register user",
      },
      {
        status: 500,
      }
    );
  }
}
