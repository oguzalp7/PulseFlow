

import React from 'react';
import { Stack } from '@chakra-ui/react';
import Footer from "@/components/footer.component";

export const metadata = {
    title: "Pulse Flow | Dashboard",
    description: "Process control.",
  };

const DashboardLayout = ({ children }) => {
    return (
      
      <Stack  w={'full'} h={'full'} >
        <main>
          {children}
          <Footer/>
        </main>
      </Stack>
      
    );
  };
  
  export default DashboardLayout;