"use cliemt";

import React, { useState } from 'react';
import { Box, Heading, Text, Button, IconButton, HStack, VStack } from '@chakra-ui/react';
import { BiSolidHide, BiSolidShow, BiEdit, BiTrash } from "react-icons/bi";
import ProjectCreateForm from '@/forms/project-create.form';
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

  import {ChevronDownIcon} from "@chakra-ui/icons";

const ProjectCard = ({ project, onUpdate, onDelete }) => {
    const [showApiKey, setShowApiKey] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const {data, loading, error, updateData} = useUpdateData(`/projects/raw/${project.id}/`);

    const {language} = useLanguage();

    const toggleApiKey = () => setShowApiKey(!showApiKey);
    const toggleDescription = () => setShowFullDescription(!showFullDescription);
    const toggleEditing = () => setIsEditing(!isEditing);

    const handleUpdate = async (updatedProject) => {
        await onUpdate(project.id, updatedProject);
        setIsEditing(false);
    };
    
    const handleDelete = async () => {
    await onDelete(project.id);
    };

    const isDescriptionLong = project.description.length > 100; // Adjust the length as needed

    return (
        <Box align={'center'} borderWidth="1px" borderRadius="lg" overflow="hidden" p="6">
            {isEditing ? (
                <ProjectCreateForm onSubmit={handleUpdate} defaultValues={project} />
            ) : (
                <VStack position="relative" w="full">
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

                    <Box>
                        <Heading color={'gray.300'} as="h3" size="lg" mb="4">
                            {project.name}
                        </Heading>
                        <Text color={'gray.300'} noOfLines={showFullDescription ? undefined : 1}>
                            {project.description}
                        </Text>
                        {isDescriptionLong && (
                            <Button color={'gray.300'} variant={'ghost'} size="sm" onClick={toggleDescription} mt="2">
                                {showFullDescription ? 'Show Less' : 'Show More'}
                            </Button>
                        )}
                        <HStack justifyContent={'center'}>
                            <Text color={'gray.300'} fontWeight="bold">
                                API Key:
                            </Text>
                            <Text color={'gray.300'} fontWeight="bold">
                                {showApiKey ? project.api_key : '*******'}
                            </Text>
                            <IconButton rounded='full' bgColor='transparent' color='gray.500' h="1.75rem" size="lg" onClick={toggleApiKey} icon={showApiKey ? <BiSolidHide /> : <BiSolidShow />} />
                        </HStack>
                    </Box>
                </VStack>
            )}
        </Box>
    );
};

export default ProjectCard;