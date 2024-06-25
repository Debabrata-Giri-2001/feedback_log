import { z } from "zod";

export const usernameValidattion = z
  .string()
  .min(2, "username most be atleast 2 char")
  .max(20, "username most be no more then 20 char")
  .regex(/^[a-zA-Z0-9_]+$/, "username most not contain spcial char");

export const signUpSchema = z.object({
  username: usernameValidattion,
  email: z.string().email({ message: "Invalid email address" }),
  password:z.string().min(6,{message:"password at least more then 6"})
});
