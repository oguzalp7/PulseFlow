"use client"

import React from 'react';
import { Box, Text, Button, useToast } from '@chakra-ui/react';

import { useLanguage } from '@/contexts/language-context';

const SettingsPage = () => {
    return (
        <Box>
            <Text fontSize="2xl">Settings Page</Text>
            <Button colorScheme="teal">Edit Settings</Button>
        </Box>
    );
};

export default SettingsPage;