"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { registerSchema, RegisterType } from "@/types/auth-type";
import InputPassword from "@/components/input-password";
import { register } from "@/services/auth-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterType) => {
    try {
      await register(values);
      toast.success("Registration successfully.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
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
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
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
            Already have an account?{" "}
            <span
              className="text-[#2563EB] cursor-pointer hover:underline underline-offset-4"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
