// app/providers.tsx
'use client'

import theme from '@/theme'
import "../styles/global.css"

import { ChakraProvider, Box } from '@chakra-ui/react'
import {LanguageProvider} from '@/contexts/language-context'



export function Providers({ children }) {
  
  
  return <ChakraProvider theme={theme}>
    <LanguageProvider>
      <Box
          minHeight="100vh"
          display="flex"
          flexDirection="column"
          
          // //alignItems="center"
          bg="rgba(255, 255, 255, 0.8)"
          p={4}
          backgroundImage={`url('/images/bg.jpeg')`}
        >
          {children}
      </Box>
    </LanguageProvider>
  </ChakraProvider>
}