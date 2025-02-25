"use client";
import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Flex, Heading, Table, Tbody, Td, Th, Thead, Tr, VStack, HStack, Text, Tabs, TabList, TabPanels, Tab, TabPanel, useToast, Spinner, SkeletonText, Select, Checkbox } from '@chakra-ui/react';
import useFetchData from '@/hooks/useFetchData';
import useCreateData from '@/hooks/useCreateData';
import useUpdateData from '@/hooks/useUpdateData';
import useDeleteData from '@/hooks/useDeleteData';
import AutomationCreateForm from '@/forms/automation-create.form';

import { useLanguage } from '@/contexts/language-context';
import UserContext from '@/contexts/user-context';
import CardGrid from '@/components/card-grid.component';
import CardLayout from '@/components/card-layout.component';

import AutomationCardContent from '@/card-contents/automation.card-content';
import CustomTabs from '@/components/CustomTabs';

const AutomationsPage = () => {
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const toast = useToast();
    const [automations, setAutomations] = useState([]);
    const [selectedAutomation, setSelectedAutomation] = useState(null);
    const [isActiveFilter, setIsActiveFilter] = useState(true);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedOutput, setSelectedOutput] = useState(null);
    const [automationType, setAutomationType] = useState(null);
    const [desiredState, setDesiredState] = useState(null);
    const { data: projects, loading: projectsLoading } = useFetchData(`/users/projects/${user.id}`);
    const { data: outputs, loading: outputsLoading, refetch: refetchOutputs } = useFetchData(`/outputs/raw/project/${selectedProject}?page=1&size=50&outOfOrder=false`);
    
    const buildUrl = () => {
        let url = `/automations/?`;
        const params = [];
        if (isActiveFilter) params.push(`is_active=${isActiveFilter}`);
        if (selectedProject) params.push(`project_id=${selectedProject}`);
        if (selectedOutput) params.push(`output_id=${selectedOutput}`);
        if (automationType) params.push(`automation_type=${automationType}`);
        if (desiredState) params.push(`desired_state=${desiredState}`);
        //if (sortBy) params.push(`sort_by=${sortBy}`);
        //if (sortOrder) params.push(`sort_order=${sortOrder}`);
        return url + params.join('&');
    };

    const { data, loading, error, setData, refetch } = useFetchData(buildUrl());
    //const { data, loading, error, setData, refetch } = useFetchData(`/automations/?is_active=${isActiveFilter}&project_id=${selectedProject}&output_id=${selectedOutput}&automation_type=${automationType}&desired_state=${desiredState}`);
    
    
    const { createData, error: createError } = useCreateData('/automations/raw/');
    const { updateData, error: updateError } = useUpdateData('/automations/raw');
    const { deleteData, error: deleteError } = useDeleteData('/automations/raw');

    useEffect(() => {
        if (data) {
            setAutomations(data.automations);
        }
    }, [data]);

    useEffect(() => {
        if (selectedProject) {
            refetchOutputs();
        }
    }, [selectedProject, refetchOutputs]);

    const handleCreateAutomation = async (newAutomation) => {
        await createData(newAutomation);
        if (!createError) {
            toast({
                title: language === 'en' ? 'Automation created successfully.' : 'Otomasyon başarıyla oluşturuldu.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            refetch(); // Re-fetch automations after creation
        } else {
            console.log(createError);
            toast({
                title: language === 'en' ? 'Error creating automation.' : 'Otomasyon oluşturulurken hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleUpdateAutomation = async (id, updatedAutomation) => {
        await updateData(id, updatedAutomation);
        if (!updateError) {
            toast({
                title: language === 'en' ? 'Automation updated successfully.' : 'Otomasyon başarıyla güncellendi.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            refetch(); // Re-fetch automations after update
            setSelectedAutomation(null); // Clear the selected automation after update
        } else {
            console.log(updateError);
            toast({
                title: language === 'en' ? 'Error updating automation.' : 'Otomasyon güncellenirken hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleDeleteAutomation = async (id) => {
        await deleteData(id);
        if (!deleteError) {
            toast({
                title: language === 'en' ? 'Automation deleted successfully.' : 'Otomasyon başarıyla silindi.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            refetch(); // Re-fetch automations after deletion
        } else {
            console.log(deleteError);
            toast({
                title: language === 'en' ? 'Error deleting automation.' : 'Otomasyon silinirken hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleFilterChange = () => {
        setIsActiveFilter(!isActiveFilter);
        refetch();
    };

    // const handleSortChange = (e) => {
    //     setSortBy(e.target.value);
    //     refetch();
    // };

    // const handleSortOrderChange = (e) => {
    //     setSortOrder(e.target.value);
    //     refetch();
    // };

    const handleProjectChange = (e) => {
        setSelectedProject(e.target.value);
        refetch();
    };

    const handleOutputChange = (e) => {
        setSelectedOutput(e.target.value);
        refetch();
    };

    const handleAutomationTypeChange = (e) => {
        setAutomationType(e.target.value);
        refetch();
    };

    const handleDesiredStateChange = (e) => {
        setDesiredState(e.target.value);
        refetch();
    };

    const handleToggleActive = async (automation) => {
        const updatedAutomation = { ...automation, is_active: !automation.is_active };
        await updateData(automation.id, updatedAutomation);
        if (!updateData.error) {
            toast({
                title: language === 'en' ? 'Automation updated successfully.' : 'Otomasyon başarıyla güncellendi.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            onUpdate(automation.id, updatedAutomation);
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
    
    const tabs = [
        {
            label: language === 'en' ? 'New Automation' : 'Yeni Otomasyon',
            content: <AutomationCreateForm onSubmit={selectedAutomation ? handleUpdateAutomation : handleCreateAutomation} defaultValues={selectedAutomation} />
        },
        {
            label: language === 'en' ? 'Automations' : 'Otomasyonlar',
            content: (
                <>
                    <Flex mb={4} justifyContent='space-between' alignItems='center'>
                        <Checkbox isChecked={isActiveFilter} onChange={handleFilterChange} colorScheme='green'>
                            {language === 'en' ? 'Show Active Only' : 'Sadece Aktifleri Göster'}
                        </Checkbox>
                        <Select value={selectedProject} onChange={handleProjectChange} w='200px' colorScheme='green'>
                            <option value=''>{language === 'en' ? 'All Projects' : 'Tüm Projeler'}</option>
                            {projects && projects.map((project) => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </Select>
                        <Select value={selectedOutput} onChange={handleOutputChange} w='200px' colorScheme='green'>
                            <option value=''>{language === 'en' ? 'All Outputs' : 'Tüm Çıkışlar'}</option>
                            {outputs && outputs.outputs.map((output) => (
                                <option key={output.id} value={output.id}>{output.name}</option>
                            ))}
                        </Select>
                        <Select value={automationType} onChange={handleAutomationTypeChange} w='200px' colorScheme='green'>
                            <option value=''>{language === 'en' ? 'All Types' : 'Tüm Tipler'}</option>
                            <option value='time'>{language === 'en' ? 'Time' : 'Zaman'}</option>
                            <option value='sensor'>{language === 'en' ? 'Sensor' : 'Sensör'}</option>
                            <option value='time_and_sensor'>{language === 'en' ? 'Time and Sensor' : 'Zaman ve Sensör'}</option>
                        </Select>
                        <Select value={desiredState} onChange={handleDesiredStateChange} w='200px' colorScheme='green'>
                            <option value=''>{language === 'en' ? 'All States' : 'Tüm Durumlar'}</option>
                            <option value='turn_on'>{language === 'en' ? 'Turn On' : 'Aç'}</option>
                            <option value='turn_off'>{language === 'en' ? 'Turn Off' : 'Kapat'}</option>
                            <option value='toggle'>{language === 'en' ? 'Toggle' : 'Değiştir'}</option>
                        </Select>
                        {/* <Select value={sortBy} onChange={handleSortChange} w='200px' colorScheme='green'>
                            <option value='name'>{language === 'en' ? 'Name' : 'İsim'}</option>
                            <option value='created_at'>{language === 'en' ? 'Created At' : 'Oluşturulma Tarihi'}</option>
                            <option value='updated_at'>{language === 'en' ? 'Updated At' : 'Güncellenme Tarihi'}</option>
                        </Select>
                        <Select value={sortOrder} onChange={handleSortOrderChange} w='200px' colorScheme='green'>
                            <option value='asc'>{language === 'en' ? 'Ascending' : 'Artan'}</option>
                            <option value='desc'>{language === 'en' ? 'Descending' : 'Azalan'}</option>
                        </Select> */}
                    </Flex>
                    <CardGrid>
                        {loading && (
                            <Box padding='6' boxShadow='lg' bg='gray.700'>
                                <Spinner color='green' size={'xl'} />
                                <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
                            </Box>
                        )}
                        {automations && automations.map((automation, index) => (
                            // <AutomationCard
                            //     key={index}
                            //     automation={automation}
                            //     onUpdate={handleUpdateAutomation}
                            //     onDelete={handleDeleteAutomation}
                            // />
                            <CardLayout key={index}
                             FormComponent={AutomationCreateForm}
                             data={automation} 
                             onEdit={handleUpdateAutomation} 
                             onDelete={handleDeleteAutomation}
                             cardChildren={<AutomationCardContent automation={automation} refetch={refetch} />}
                             />
                            
                        ))}
                    </CardGrid>
                </>
            )
        }
    ];

    return <CustomTabs tabs={tabs} />;
};

export default AutomationsPage;
