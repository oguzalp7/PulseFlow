"use client"

import React, {useState} from 'react';
import { SimpleGrid, Box, Button, HStack, Skeleton, Text } from '@chakra-ui/react';


const CardGrid = ({children}) => {
    return(
        <Box>
            <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                {children}
            </SimpleGrid>
        </Box>
    );
}

export default CardGrid;