import { resend } from "@/lib/resend";
import VarificationEmail from "../../emails/VarificationEmail";
import { ApiResponce } from "@/types/ApiResponce";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifycode: string
): Promise<ApiResponce> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "feedback log | Verification Code",
      react: VarificationEmail({ username, otp: verifycode }),
    });

    return { success: true, message: "vefication email send" };
  } catch (emailError) {
    console.error("email sending verification email", emailError);
    return { success: false, message: "failed to send vefication email" };
  }
}
