"use client";

import React, { useState, useContext } from 'react';
import UserContext from '@/contexts/user-context';
import { Box, Heading, Text, Button, IconButton, HStack, VStack, Icon } from '@chakra-ui/react';
import { BiSolidHide, BiSolidShow, BiEdit, BiTrash } from "react-icons/bi";


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

import {
    Tag,
    TagLabel,
    TagLeftIcon,
    TagRightIcon,
    TagCloseButton,
  } from '@chakra-ui/react'

import { GrTroubleshoot, GrPower  } from "react-icons/gr";

import ActuatorCreateForm from '@/forms/actuator-create.form';

const ActuatorCard = ({ actuator, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const {language} = useLanguage();
    const { user } = useContext(UserContext);
    const toggleEditing = () => setIsEditing(!isEditing);
    const handleUpdate = async (updatedData) => {
        await onUpdate(actuator.id, updatedData);
        setIsEditing(false);
    };
    
    const handleDelete = async () => {
    await onDelete(actuator.id);
    };

    return(
        <Box align={'center'} borderWidth="1px" borderRadius="lg" overflow="hidden" p="6">
            {isEditing ? (
                <ActuatorCreateForm onSubmit={handleUpdate} defaultValues={actuator} />
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
                    <br/>
                    <Heading color={'gray.300'} size="md">{actuator.name}</Heading>
                    <HStack>
                        <Text color={'gray.300'}>{language === 'en' ? 'Wiring: ' : 'Bağlantı şeması:'}</Text>
                        <Text color={'gray.300'} >{actuator.circuit_type === 'sealed' ? (language === 'en' ? "Star-Triangle" : "Yıldız-Üçgen") : (language === 'en' ? "Straight" : 'Düz')}</Text>
                    </HStack>
                    <HStack>
                        <Text color={'gray.300'}>{language === 'en' ? 'State: ' : 'Durum: '}</Text>
                        <Tag colorScheme={actuator.state === 1 ? 'green' : 'red'}><Icon as={GrPower}/></Tag>
                    </HStack>
                    <HStack>
                        <Text color={'gray.300'}>{language === 'en' ? 'Fault Status: ' : 'Arıza Durumu: '}</Text>
                        <Tag colorScheme={actuator.is_out_of_order ? 'red' : 'green'}><Icon as={GrTroubleshoot}/></Tag>
                    </HStack>
                    
                </VStack>
            )}
        </Box>
    );
}

export default ActuatorCard;