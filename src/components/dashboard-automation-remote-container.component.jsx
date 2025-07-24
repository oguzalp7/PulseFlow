"use client";
import React, { useEffect, useState } from 'react'
import { Box, Text, Image, HStack, Button, Spinner, useToast } from "@chakra-ui/react";

import { useLanguage } from '@/contexts/language-context';
import useFetchData from '@/hooks/useFetchData';
import useUpdateData from '@/hooks/useUpdateData';

const AutomaticModeButton = ({ imgPath, onClick, label, disabled }) => {

    return (
        <Button disabled={disabled} colorScheme='green' rounded={'full'}  variant="ghost" onClick={onClick} bgColor={"whiteAlpha.200"} _hover={{ bgColor: "whiteAlpha.300" }} _active={{ bgColor: "whiteAlpha.400" }} p={4} w="100%" h="100%">
            <HStack>
                <Image src={imgPath} alt="Automation Remote Control Icon" boxSize="50px" rounded={'full'} />
                <Text color={'white'} fontSize="md" fontWeight="bold">
                    {label || "Automation Remote Control"}
                </Text>
            </HStack>
            
        </Button>
    )
}

const DashboardAutomationRemoteContainer = ({ projectId, output }) => {
    const { language } = useLanguage();
    // console.log(projectId, output);
    const toast = useToast();
    
    const { data: automations, loading: automationsLoading, error: automationsError, refetch: refetchAutomations } = useFetchData(`/automations/?page=1&size=10&project_id=${projectId}&output_id=${output.id}`);
    const { updateData, error: updateError } = useUpdateData('/automations/raw');
    // useEffect(() => {
    //     refetchAutomations();
    // }, [refetchAutomations]);
    useEffect(() => {
        const interval = setInterval(() => {
            refetchAutomations();
        }, 15000); // 15 seconds
        return () => clearInterval(interval);
    }, [refetchAutomations]);

    if (automationsLoading) {
        return <Spinner />;
    }

    const handleToggleAutomation = async (automation) => {
        // Implement the logic to toggle the automation state
        console.log(`Toggling automation with ID: ${automation.id} name: ${automation.name}`);
        const updatedAutomation = { ...automation, is_active: !automation.is_active };

        try {
            await updateData(automation.id, updatedAutomation);
            toast({
                title: language === 'en' ? 'Automation updated successfully.' : 'Otomasyon başarıyla güncellendi.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: language === 'en' ? 'Error updating automation.' : 'Otomasyon güncellenirken hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }
    return (
        <Box p={4}>
            { automations && automations.automations.length > 0 ? (
                automations.automations.map((automation) => (
                    <AutomaticModeButton
                        key={automation.id}
                        imgPath={ automation.is_active ? '/images/auto-mode-on.png' : '/images/auto-mode-off.png' }
                        onClick={() => handleToggleAutomation(automation)}
                        // label={`${automation.name}`}
                        label={language === 'en' ? "Automatic" : "Otomatik"}
                        disabled={false}
                    />
                ))
            ) : automationsError ? (
                <Text color="red.500">Error loading automations: {automationsError.message}</Text>
            ) : (
                <HStack>
                <Image src='/images/auto-mode-none.png' alt="Automation Remote Control Icon" boxSize="50px" rounded={'full'} />
                <Text color={'white'} fontSize="md" fontWeight="bold">
                    {language === 'en' ? "No Automations Found" : "Otomasyon Bulunamadı"}
                </Text>
            </HStack>
            )}

        </Box>
    );
};

export default DashboardAutomationRemoteContainer;