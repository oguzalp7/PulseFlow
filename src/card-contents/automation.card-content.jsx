"use client";

import React, { useState, useContext } from 'react';
import useUpdateData from '@/hooks/useUpdateData';
import { Box, Heading, Text, HStack, useToast

 } from '@chakra-ui/react';
import { useLanguage } from '@/contexts/language-context';

import DrawerComponent from '@/components/drawer.component';
import CustomTabs from '@/components/CustomTabs';

import AutomationConditionCreateForm from '@/forms/automation-condition-create.form';
import useCreateData from '@/hooks/useCreateData';
import useFetchData from '@/hooks/useFetchData';

import CardLayout from '@/components/card-layout.component';
import AutomationConditionCardContent from './automation-condition.card-content';

const AutomationCardContent = ({ automation, refetch }) => {
    const { updateData } = useUpdateData('/automations/raw');
    const { language } = useLanguage();
    const toast = useToast();


    const { data: condition, loading: conditionLoading, error: conditionError, createData: createCondition } = useCreateData('/conditions/raw/');
    const { data: conditions, loading: conditionsLoading, error: conditionsError, refetch: refetchConditions } = useFetchData(`/conditions/raw/automation/${automation.id}`);
    
    const handleToggleActive = async () => {
        const updatedAutomation = { ...automation, is_active: !automation.is_active };
        await updateData(automation.id, updatedAutomation);
        if (!updateData.error) {
            toast({
                title: language === 'en' ? 'Automation updated successfully.' : 'Otomasyon başarıyla güncellendi.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            //onUpdate(automation.id, updatedAutomation);
        } else {
            toast({
                title: language === 'en' ? 'Error updating automation.' : 'Otomasyon güncellenirken hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
        refetch();
    };

    const handleCreateCondition = async (data) => {
        console.log(data);
        try {
            //await createCondition(data);
            refetchConditions();
            toast({
                title: language === 'en' ? 'Condition created successfully.' : 'Kondisyon başarıyla oluşturuldu.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.log(error);
            toast({
                title: language === 'en' ? 'Error creating condition.' : 'Kondisyon oluşturulurken hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleUpdateCondition = async (id, data) => {
    };
    

    const tabs = [
        { label: language === 'en' ? 'Conditions' : 'Koşullar', content: (
            <Box  borderRadius='lg' p={4} w='100%'>
                {conditions && conditions.conditions && conditions.conditions.map((condition, index) => (
                    <CardLayout 
                        key={index} 
                        data={condition} 
                        FormComponent={AutomationConditionCreateForm} 
                        formProps={{automation}} 
                        cardChildren={
                            <AutomationConditionCardContent condition={condition}/>
                        }    
                    />
                ))}
            </Box>
        ) },
        { label: language === 'en' ? 'New Condition' : 'Yeni Kondisyon', content: (<AutomationConditionCreateForm automation={automation} onSubmit={handleCreateCondition} />) },
    ];
    
    return (
        <>
        <Heading size='md'>{automation.name}</Heading>
        <Text>{language === 'en' ? 'Output: ' : 'Çıkış: '} {automation.output_name}</Text>
        <Text>{language === 'en' ? 'Project: ' : 'Proje: '} {automation.project_name}</Text>
        <Text>{language === 'en' ? 'Automation Type: ' : 'Otomasyon Tipi: '} {automation.automation_type}</Text>
        <Text>{language === 'en' ? 'Desired State: ' : 'İstenen Durum: '} {automation.desired_state}</Text>
        <HStack>
            <Text>{language === 'en' ? 'Active:' : 'Aktif:'}</Text>
            <Box
                as='span'
                w='10px'
                h='10px'
                borderRadius='full'
                bg={automation.is_active ? 'green.500' : 'red.500'}
                boxShadow={`0 0 10px ${automation.is_active ? 'green' : 'red'}`}
                cursor='pointer'
                onClick={handleToggleActive}
            />
        </HStack>
        <DrawerComponent title={language === 'en' ? 'Manage Conditions' : 'Kondisyonları Yönet'} size='lg' placement='right'>
            {/* <Text>{automation.name}</Text> */}
            <CustomTabs tabs={tabs} />
        </DrawerComponent>
        </>
    );
}

export default AutomationCardContent;