import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-blue-500 h-[100px] flex items-center justify-center mt-10">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-white">
        <Image src="/logo-light.svg" alt="brand logo" width={134} height={24} />
        <p className="text-sm md:textbase">© 2025 Blog genzet. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
