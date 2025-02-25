"use client";

import React, { useState, useContext } from 'react';
import UserContext from '@/contexts/user-context';
import { 
    Box, 
    Heading,
    Text, 
    Button, 
    IconButton, 
    HStack, 
    VStack, 
    Icon,
    Menu,
    MenuButton,
    MenuList, 
    Tag,
} from '@chakra-ui/react';
import { BiEdit, BiTrash } from "react-icons/bi";

import { useLanguage } from '@/contexts/language-context';

const CardLayout = ({ FormComponent, cardChildren, data, onEdit, onDelete, formProps }) => {
    const [isEditing, setIsEditing] = useState(false);
    const {language} = useLanguage();

    const toggleEditing = () => setIsEditing(!isEditing);

    const handleUpdate = async (updatedData) => {
        await onEdit(data.id, updatedData);
        setIsEditing(false);
    }

    const handleDelete = async () => {
        await onDelete(data.id);
    }

    return(
        <Box align={'center'} borderWidth="1px" borderRadius="lg" overflow="hidden" p="6">
            {isEditing ? (
                <FormComponent onSubmit={handleUpdate} defaultValues={data}  {...formProps}/>
            ) : (
                <VStack position="relative" w="full" minH="150px">
                    <Box position="absolute" top="-5" right="-5">
                        <Menu bgColor={'transparent'}>
                            <MenuButton as={Button} variant={'ghost'} colorScheme='transparent' color={'gray.300'}>
                                ...
                            </MenuButton>
                            <MenuList bgColor={'rgba(0, 0, 0, 0.4)'}>
                                <VStack>
                                    <Button disabled={FormComponent ? false : true} onClick={toggleEditing} colorScheme='transparent' color={'orange'} variant={'ghost'} leftIcon={<BiEdit />}>{language == 'en' ? 'Edit' : 'Düzenle'}</Button>
                                    <Button onClick={handleDelete} colorScheme='transparent' color={'red.500'} variant={'ghost'} leftIcon={<BiTrash/>}>{language == 'en' ? 'Delete' : 'Sil'}</Button>
                                </VStack>
                            </MenuList>
                        </Menu>
                    </Box>
                    <br/>
                    {cardChildren}
                </VStack>
            )}
        </Box>
    );

};

export default CardLayout;