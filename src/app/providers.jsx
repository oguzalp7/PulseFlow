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
          maxHeight={["500vh","200vh"]}
          minHeight={"180vh"}
          minWidth={['175vw', '100vw', '100vw', '100vw']}
          display="flex"
          flexDirection="column"
          w={'full'}
          h={'full'}
          // //alignItems="center"
          bg="rgba(255, 255, 255, 0.8)"
          p={4}
          backgroundImage={'/images/bg.jpeg'}
        >{children}
      </Box>
    </LanguageProvider>
  </ChakraProvider>
}