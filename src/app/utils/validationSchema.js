import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 2 characters")
    .regex(/^[A-Za-z]/, "Name must start with letter"),

  email: z.string().trim().email("Please enter a valid email"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});
