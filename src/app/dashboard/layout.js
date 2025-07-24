

import React from 'react';
import { Stack, Flex, Box } from '@chakra-ui/react';
import Footer from "@/components/footer.component";
import Navbar from "@/components/navbar.component";
import Sidebar from "@/components/sidebar.component";
import ProtectedRoute from '@/components/protected-route.component';

export const metadata = {
    title: "Pulse Flow | Dashboard",
    description: "Process control.",
  };

const DashboardLayout = ({ children }) => {
    
  return (
    <ProtectedRoute>
      <Flex direction="column" w="full" h="full">
        <Navbar pos='sticky' />
        <Flex direction="row" flex="1">
          
          <Sidebar />
          <Box
            ml="100px" // margin-left matches sidebar width
            transition="width 0.2s"
            w="20%"
            display={['full', 'none']}
          ></Box>
          <Box flex="1" p={4}>
            {children}
          </Box>
        </Flex>
        <Footer />
      </Flex>
    </ProtectedRoute>
  );
};

export default DashboardLayout;

