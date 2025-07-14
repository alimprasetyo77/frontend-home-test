"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { loginSchema, LoginType } from "@/types/auth-type";
import InputPassword from "@/components/input-password";
import { login } from "@/services/auth-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

const LoginPage = () => {
  const { changeToken } = useAuth();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginType) => {
    try {
      const result = await login(values);
      changeToken(result.token);
      toast.success("Login Successfull.");
      if (result.role === "Admin") {
        router.push("/dashboard/articles");
        return;
      }
      router.push("/");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <Card className="bg-white max-w-[400px] w-full rounded-lg">
        <CardHeader className="justify-center p-2">
          <Image src="/logo-dark.svg" alt="brand logo" width={134} height={24} priority />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Input Username" {...field} className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <InputPassword {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 mt-2">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-slate-600 text-sm text-center w-full">
            Don’t have an account?{" "}
            <span
              className="text-[#2563EB] cursor-pointer hover:underline underline-offset-4"
              onClick={() => router.push("/register")}
            >
              Register
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
