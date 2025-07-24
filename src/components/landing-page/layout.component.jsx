"use client"
import React from 'react'
import { Box, Stack } from '@chakra-ui/react'


const LandingPageLayout = ({children}) => {
  return (
    <Box >
        <Stack flexDir={['column','row']} p={4} justifyContent="space-between">
            {children}
        </Stack>
    </Box>
  )
}

export default LandingPageLayout