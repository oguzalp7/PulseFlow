import React, { useState, useContext } from 'react';
import UserContext from '@/contexts/user-context';
import { Box, Heading, Text, Button, IconButton, HStack, VStack } from '@chakra-ui/react';
import { BiSolidHide, BiSolidShow, BiEdit, BiTrash } from "react-icons/bi";
import useUpdateData from '@/hooks/useUpdateData';

import { useLanguage } from '@/contexts/language-context';
import useFetchData from '@/hooks/useFetchData';

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

import InternalSensorCreateForm from '@/forms/internal-sensor-create.form';

const InternalSensorCard = ({ internalSensor, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const {language} = useLanguage();
    const toggleEditing = () => setIsEditing(!isEditing);
    const { user } = useContext(UserContext);

    const { data: deviceData, loading: deviceLoading, error: deviceError } = useFetchData(`/devices/raw/${internalSensor.device_id}`);
    const { data: outputData, loading: outputLoading, error: outputError } = useFetchData(`/outputs/raw/${internalSensor.output_id}`);

    const handleUpdate = async (updatedData) => {
        await onUpdate(internalSensor.id, updatedData);
        setIsEditing(false);
    };
    
    const handleDelete = async () => {
    await onDelete(internalSensor.id);
    };

    return (
        <Box align={'center'} borderWidth="1px" borderRadius="lg" overflow="hidden" p="6">
            {isEditing ? (
            
                <InternalSensorCreateForm onSubmit={handleUpdate} defaultValues={internalSensor} />

            ) : (
                <VStack textColor={'gray.300'} position="relative" w="full" minH="150px">
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
                    <Heading as="h3" size="lg">
                        {internalSensor.name}
                    </Heading>
                    <Text>
                        {internalSensor.description}
                    </Text>
                    <Text>
                        {internalSensor.value} {internalSensor.units_of_measure}
                    </Text>
                    <Text>
                        {internalSensor.sensor_type}
                    </Text>
                    <Text>
                        {deviceData && deviceData.name}
                    </Text>
                    <Text>
                        {outputData && outputData.name}
                    </Text>
                </VStack>
            )}
        </Box>
    );
};

export default InternalSensorCard;