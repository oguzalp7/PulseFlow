import React, { useState, useContext } from 'react';
import UserContext from '@/contexts/user-context';
import { Box, Heading, Text, Button, IconButton, HStack, VStack } from '@chakra-ui/react';
import { BiSolidHide, BiSolidShow, BiEdit, BiTrash } from "react-icons/bi";
import useUpdateData from '@/hooks/useUpdateData';

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
  } from '@chakra-ui/react'


import DeviceCreateForm from '@/forms/device-create.form';

const DeviceCard = ({ device, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showMacAddress, setShowMacAddress] = useState(false);
    const toggleMacAddress = () => setShowMacAddress(!showMacAddress);
    const {language} = useLanguage();
    const toggleEditing = () => setIsEditing(!isEditing);
    const { user } = useContext(UserContext);

    const handleUpdate = async (updatedData) => {
        await onUpdate(device.id, updatedData);
        setIsEditing(false);
    };
    
    const handleDelete = async () => {
    await onDelete(device.id);
    };

    return (
        <Box align={'center'} borderWidth="1px" borderRadius="lg" overflow="hidden" p="6">
            {isEditing ? (
            
                <DeviceCreateForm onSubmit={handleUpdate} defaultValues={device} />

            ) : (
                <VStack position="relative" w="full" minH="150px">
                    <Box position="absolute" top="-5" right="-5">
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
                    <br />
                    <Box>
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
                    </Box>
                    
                </VStack>
            )}
        </Box>
    );
}

export default DeviceCard;