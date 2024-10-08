import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decodeUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodeUsername });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if the code is correct and not expired
    const isCodeValid = user?.verifyCode === code;


    let verifyCodeExpiryDate = new Date(user.verifyCodeExpiry);
    verifyCodeExpiryDate.setDate(verifyCodeExpiryDate.getDate() + 1);

    const isCodeNotExpired = new Date() < verifyCodeExpiryDate;

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired. Please sign up again to get a new code",
        },
        { status: 400 }
      );
    }else{
        return Response.json(
            { success: false, message: 'Incorrect verification code' },
            { status: 200 }
          );
    }


  } catch (error) {
    console.error("Error in checking verify user", error);
    return Response.json(
      {
        success: false,
        message: "Error checking verify user",
      },
      { status: 500 }
    );
  }
}
