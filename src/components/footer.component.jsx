"use client"

import React from 'react'
import { Text, useColorMode, VStack, Image } from '@chakra-ui/react'

const Footer = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <VStack>
        <Text fontSize="sm" color={'gray.500'} >
          &copy; {new Date().getFullYear()} <a href='https://lavittoria.ai'>La Vittoria AI</a>. All rights reserved.
        </Text>
        <Image alt='La Vittoria Logo' src="/images/LV.png" boxSize='50px'/>
    </VStack>
    

  )
}

export default Footer