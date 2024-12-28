import React from 'react';
import { ChakraProvider, Box } from "@chakra-ui/react";
import theme from "../../theme";
import Footer from '@/components/footer.component';
const LoginLayout = ({ children }) => {
    return (
        
            <Box
            minHeight="90vh"
            w={['full', 'md']} 
            
            // // margin={'auto'}
            mx='auto'
            my='auto'
            border={['none', '1px']}
            borderColor={['', 'gray.300']}
            borderRadius={10}
            p={4}
            >
                {children}
                <br/>
                <Footer/>
            </Box>
       
    );
}

export default LoginLayout;