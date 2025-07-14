import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ProtectedLayout from "@/components/protected-layout";
import React, { ReactNode } from "react";
const layout = ({ children }: { children: ReactNode }) => {
  return (
    <ProtectedLayout onlyRole="User">
      <Navbar />
      <div>{children}</div>
      <Footer />
    </ProtectedLayout>
  );
};

export default layout;
