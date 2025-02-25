"use client";

import React, { useState, useContext } from 'react';
import { Heading, Text, Button, IconButton, HStack } from '@chakra-ui/react';

import { useLanguage } from '@/contexts/language-context';

import { BiSolidHide, BiSolidShow } from "react-icons/bi";

const ProjectCardContent = ({ project }) => {
    const { language } = useLanguage();
    const [showApiKey, setShowApiKey] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    const isDescriptionLong = project.description.length > 100; // Adjust the length as needed

    const toggleApiKey = () => setShowApiKey(!showApiKey);
    const toggleDescription = () => setShowFullDescription(!showFullDescription);
    return (
        <>
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
        </>
    );

};

export default ProjectCardContent;