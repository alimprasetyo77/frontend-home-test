import Image from "next/image";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const LoginPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <Card className="bg-white max-w-[400px] w-full rounded-lg">
        <CardHeader className="justify-center">
          <Image src="/logo.svg" alt="brand logo" width={134} height={24} priority />
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
