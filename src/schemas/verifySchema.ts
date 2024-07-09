import { z } from "zod";

export const verifySchema = z.object({
  code: z.string().min(4, "verification code"),
});
