"use client";

import { useLanguage } from '@/contexts/language-context';
import React, { useState, useContext } from 'react';
import { Heading, Text, HStack, IconButton, Icon } from '@chakra-ui/react';
import { BiSolidShow, BiSolidHide } from 'react-icons/bi';
import UserContext from '@/contexts/user-context';

const DeviceCardContent = ({ device }) => {
    const [showMacAddress, setShowMacAddress] = useState(false);
    const toggleMacAddress = () => setShowMacAddress(!showMacAddress);
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    return(
        <>
        <Heading color={'gray.300'} as="h4" mb={"4"} size="md">
                                    {device.name}
        </Heading>
        {user && user.auth_id > 3 && (
        <HStack justifyContent={'center'}>
            <Text color={'gray.300'} fontWeight="bold">
                Mac Address:
            </Text>
            <Text color={'gray.300'} fontWeight="bold">
                {showMacAddress ? device.mac_address : '*******'}
            </Text>
            <IconButton rounded='full' bgColor='transparent' color='gray.500' h="1.75rem" size="lg" onClick={toggleMacAddress} icon={showMacAddress ? <BiSolidHide /> : <BiSolidShow />} />
        </HStack>
        )}
        </>
    );ş
};

export default DeviceCardContent;