"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import UserContext from "@/contexts/user-context";
import { Stack, Flex } from "@chakra-ui/react";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  return user ? (
    <>
        {children}
    </>
  ) : null;
}

export default ProtectedRoute;