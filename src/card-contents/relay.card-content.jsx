"use client";

import React, { useState, useContext } from 'react';
import { useLanguage } from '@/contexts/language-context';
import UserContext from '@/contexts/user-context';
import { Box, Heading, Text, Button, IconButton, HStack, VStack } from '@chakra-ui/react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Tag, Icon
} from '@chakra-ui/react'

import { BiSolidHide, BiSolidShow, BiEdit, BiTrash } from "react-icons/bi";

import { GrTroubleshoot, GrPower  } from "react-icons/gr";

const RelayCardContent = ({ relay }) => {
    const {language} = useLanguage();
    const [showData, setShowData] = useState(false); // show instensive data
    const { user } = useContext(UserContext);

    const toggleData = () => setShowData(!showData);

    return (
        <>  
        
            <Heading color={'gray.300'} as="h4" size="md" mb={4}>
                {relay.name}
            </Heading>
            {user && user.auth_id > 3 && (
                <HStack justifyContent={'center'} mb={4}>
                    <Text color={'gray.300'} fontWeight="bold">
                        Relay Type:
                    </Text>
                    <Text color={'gray.300'}>
                        {showData ? relay.relay_type : '*******'}
                    </Text>
                </HStack>
            )}

            {user && user.auth_id > 3 && (
                <HStack justifyContent={'center'} mb={4}>
                    <Text color={'gray.300'} fontWeight="bold">
                        GPIO Type:
                    </Text>
                    <Text color={'gray.300'}>
                        {showData ? relay.gpio_type : '*******'}
                    </Text>
                </HStack>
            )}

            {user && user.auth_id > 3 && (
                <HStack justifyContent={'center'} mb={4}>
                    <Text color={'gray.300'} fontWeight="bold">
                        GPIO Pin:
                    </Text>
                    <Text color={'gray.300'}>
                        {showData ? relay.gpio : '***'}
                    </Text>
                </HStack>
            )}

            {user && user.auth_id > 3 && relay.pcf8574_address && (
                <HStack justifyContent={'center'} mb={4}>
                    <Text color={'gray.300'} fontWeight="bold">
                        PCF8574 Address:
                    </Text>
                    <Text color={'gray.300'}>
                        {showData ? relay.pcf8574_address : '***'}
                    </Text>
                </HStack>
            )}
            <HStack justifyContent={'center'} mb={4}>
                <Text fontWeight="bold" color={'gray.300'}>{language === 'en' ? 'State: ' : 'Durum: '}</Text>
                <Tag colorScheme={relay.state === 1 ? 'green' : 'red'}><Icon as={GrPower}/></Tag>
            </HStack>

            {user && user.auth_id > 3 && (
            <IconButton rounded='full' bgColor='transparent' color='gray.500' h="1.75rem" size="lg" onClick={toggleData} icon={showData ? <BiSolidHide /> : <BiSolidShow />} />
            )}
        </>
    );

};

export default RelayCardContent;