"use client"

import React from 'react'
import { Box, Stack, Image, Text } from '@chakra-ui/react'

const LandingPageAdsContainer = ({imageSrc, rotate}) => {
  return (
    <Box display={['none', 'flex']} borderColor="gray.200" borderRadius="md" p={4} mb={4} w={['100%', '400px']} h={"full%"} flexDirection="column" alignItems="center" justifyContent="center">
      <Stack direction={['column', 'row']} spacing={4} align="center">
        <Image 
          boxSize={['50%', '100%']}
          objectFit='cover'
          src={imageSrc}
          alt="Advertisement"
          transform={`rotate(${rotate}deg)`}
          rounded={'md'}
          borderWidth={1}
        />
        
      </Stack>
      <Text mt={4} textAlign="center" color="gray.600">
        Advertisements
      </Text>
        
    </Box>
  )
}

export default LandingPageAdsContainer