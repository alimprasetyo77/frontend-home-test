import { Input } from "./ui/input";
import { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputPassword = (props: InputHTMLAttributes<HTMLInputElement>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        placeholder="Input Password"
        className="h-10 pr-10"
        {...props}
        type={showPassword ? "text" : "password"}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default InputPassword;
