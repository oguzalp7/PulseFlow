"use client"

import { useToast, Button, Stack, Image } from "@chakra-ui/react"
import PwaModal from "@/components/pwa-modal"

import { apiClient } from "@/apiClient"
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/protected-route.component";
import GlowingButton from "@/components/glowing-button.component";

const LoadingContent = () => {

  return(
    <Stack maxH={'120vh'} w={'full'} border={'1px'}>
      {/* <Image
        src="/lv-text.png"
        boxSize={600}
      /> */}
      <GlowingButton>

      </GlowingButton>
    </Stack>
  );
}

export default function CommercialPage() {
  const[res, setRes] = useState("");

  useEffect(() => {
    const checkAPI = async () => {
      const response = await apiClient.get("/")
      
      setRes(response.data);
    }
    checkAPI();
  }, []);

  const handleLogin = () => {
    Router.push('/login')
  }
  
  //const toast = useToast()
  return (
    <>
    {res ? (
      <ProtectedRoute>
        Reklam Alanı - Logged In
      </ProtectedRoute>
    ) : (
      <LoadingContent/>
    )}
    </>
  )
}
