import { sendEmailsCode } from "@/app/api/send-email/sendEmailsCode";
import { VarificationEmail } from "../../emails/VarificationEmail";

export async function sendVerifyCode(
  email: string,
  username: string,
  verifycode: string
) {

  try {
    await sendEmailsCode({
      email: email,
      subject: "feedback log | Verification Code",
      message: `this email for verify your feedback log page  the user is - ${username} & the verify code is -${verifycode}`,
    });
    return { success: true, message: "vefication email send" };
  } catch (emailError) {
    console.error("email sending verification email nodemailer", emailError);
    return {
      success: false,
      message: "failed to send vefication from nodemailer",
    };
  }
}
