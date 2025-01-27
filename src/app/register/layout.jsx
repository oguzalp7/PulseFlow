"use client";

import React from 'react';
import { ChakraProvider, Box } from "@chakra-ui/react";
import theme from "../../theme";
import Footer from '@/components/footer.component';

const RegisterLayout = ({ children }) => {
    return (
        
            <Box
            maxHeight="150vh"
            w={['full', 'full']} 
            minHeight={'70vh'}
            h={'full'}
            margin={'auto'}
            mx='auto'
            my='auto'
            mt={10}
            // border={['none', '1px']}
            // borderColor={['', 'gray.300']}
            // borderRadius={10}
            
            p={4}
            >
                {children}
                <br/>
                <Footer/>
            </Box>
       
    );
}

export default RegisterLayout;