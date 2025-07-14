import z from "zod";

export const loginSchema = z.object({
  username: z.string().nonempty({ error: "Username field cannot be empty" }),
  password: z.string().min(8, { error: "Password must be at least 8 characters long" }),
});

export const registerSchema = loginSchema.extend({
  role: z.enum(["User", "Admin"], { error: "Please select an account type" }),
});

export type LoginType = z.infer<typeof loginSchema>;
export type RegisterType = z.infer<typeof registerSchema>;

export interface IUser extends RegisterType {
  id: string;
}

export interface ILoginResponse {
  token: string;
  role: RegisterType["role"];
}
export interface IRegisterResponse extends ILoginResponse {}
