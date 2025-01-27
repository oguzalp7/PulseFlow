"use cliemt";

import React, { useState, useContext } from 'react';
import { Box, Heading, Text, Button, IconButton, HStack, VStack } from '@chakra-ui/react';
import { BiSolidHide, BiSolidShow, BiEdit, BiTrash } from "react-icons/bi";
import UserContext from '@/contexts/user-context';
import { useLanguage } from '@/contexts/language-context';

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

import { GrTroubleshoot, GrPower  } from "react-icons/gr";
import RelayCreateForm from '@/forms/relay-create.form';

const  RelayCard = ({ relay, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const {language} = useLanguage();
    const [showData, setShowData] = useState(false); // show instensive data
    const { user } = useContext(UserContext);

    const toggleData = () => setShowData(!showData);
    const toggleEditing = () => setIsEditing(!isEditing);

    const handleUpdate = async (updatedRelay) => {
        await onUpdate(relay.id, updatedRelay);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        await onDelete(relay.id);
    };

    return (
        <Box align={'center'} borderWidth="1px" borderRadius="lg" overflow="hidden" p="6">
            {isEditing ? (
                <RelayCreateForm onSubmit={handleUpdate} defaultValues={relay} />
            ) : (
                <VStack position="relative" w="full" minH={'150px'}>
                
                    <Box position="absolute" top="-5" right="-5">
                        {user && user.auth_id > 3 && (
                            <IconButton rounded='full' bgColor='transparent' color='gray.500' h="1.75rem" size="lg" onClick={toggleData} icon={showData ? <BiSolidHide /> : <BiSolidShow />} />
                        )}
                        <Menu bgColor={'transparent'}>
                            <MenuButton as={Button} variant={'ghost'} colorScheme='transparent' color={'gray.300'}>
                                ...
                            </MenuButton>
                            <MenuList bgColor={'rgba(0, 0, 0, 0.7)'}>
                                <VStack>
                                    <Button onClick={toggleEditing} colorScheme='transparent' color={'orange'} variant={'ghost'} leftIcon={<BiEdit />}>{language == 'en' ? 'Edit' : 'Düzenle'}</Button>
                                    <Button onClick={handleDelete} colorScheme='transparent' color={'red.500'} variant={'ghost'} leftIcon={<BiTrash/>}>{language == 'en' ? 'Delete' : 'Sil'}</Button>
                                </VStack>
                            </MenuList>
                        </Menu>
                    </Box>
                    <br/>

                    <Box mb={4}>
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
                    </Box>

                
                </VStack>   
            )}
        </Box>
    );
}

export default RelayCard;