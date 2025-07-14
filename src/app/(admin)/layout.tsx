import ProtectedLayout from "@/components/protected-layout";
import React, { ReactNode } from "react";

const LayoutAdmin = ({ children }: { children: ReactNode }) => {
  return <ProtectedLayout onlyRole="Admin">{children}</ProtectedLayout>;
};

export default LayoutAdmin;
