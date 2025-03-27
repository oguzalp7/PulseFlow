"use client";

import React, { useState, useEffect, useContext } from 'react';
import UserContext from '@/contexts/user-context';
import { useLanguage } from '@/contexts/language-context';

import useFetchData from '@/hooks/useFetchData';
import useCreateData from '@/hooks/useCreateData';
import useUpdateData from '@/hooks/useUpdateData';
import useDeleteData from '@/hooks/useDeleteData';

import { GrNext, GrPrevious } from "react-icons/gr";
import CardGrid from '@/components/card-grid.component';
import { Flex, Text, useToast, Spinner, Skeleton, Box, Stack, Select, HStack, VStack, IconButton } from '@chakra-ui/react';

import InternalSensorCreateForm from '@/forms/internal-sensor-create.form';
// import InternalSensorCard from '@/components/internal-sensor-card.component';
import CustomTabs from '@/components/CustomTabs';

import CardLayout from '@/components/card-layout.component';
import InternalSensorCardContent from '@/card-contents/internal-sensor.card-content';

const InternalSensorsPage = () => {
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const toast = useToast();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);

    const [showPagination, setShowPagination] = useState(false);

    const { data: projects, loading: projectsLoading, error: projectsError, setData: setProjects, refetch: refetchProjects } = useFetchData(`/users/projects/${user.id}`);
    const [selectedProject, setSelectedProject] = useState(projects && projects.length > 0 ? projects[0].id : null);

    const { data: devices, loading: devicesLoading, error: devicesError, setData: setDevices, refetch: refetchDevices } = useFetchData(`/devices/raw/project/${selectedProject}?page=${1}&size=${50}`);
    const [selectedDevice, setSelectedDevice] = useState(devices && devices.length > 0 ? devices[0].id : null);

    const query = new URLSearchParams();
    if (selectedProject) query.append('p', selectedProject);
    if (selectedDevice) query.append('d', selectedDevice);
    query.append('page', page);
    query.append('limit', limit);

    const { data: internalSensors, loading: internalSensorsLoading, error: internalSensorsError, setData: setInternalSensors, refetch: refetchInternalSensors } = useFetchData(`/internal-sensors/?${query.toString()}`);

    const { data: newInternalSensor, loading: newInternalSensorLoading, error: newInternalSensorError, createData: createInternalSensor } = useCreateData(`/internal-sensors/raw/`);
    const { data: updateInternalSensor, loading: updateInternalSensorLoading, error: updateInternalSensorError, updateData: updateInternalSensorData } = useUpdateData(`/internal-sensors/raw`);
    const { data: deleteInternalSensor, loading: deleteInternalSensorLoading, error: deleteInternalSensorError, deleteData: deleteInternalSensorData } = useDeleteData(`/internal-sensors/raw`);

    const handleIncreasePage = () => setPage(page + 1);
    const handleDecreasePage = () => setPage(page - 1);

    useEffect(() => {
        if (projects && projects.length > 0) {
            setSelectedProject(projects[0].id);
        }
    }, [projects]);

    useEffect(() => {
        if (internalSensors && internalSensors.total >= internalSensors.page * internalSensors.size) {
            setShowPagination(true);
        } else {
            setShowPagination(false);
        }
    }, [internalSensors, selectedDevice, selectedProject]);

    const handleCreateInternalSensor = async (data) => {
        await createInternalSensor(data);
        if (newInternalSensorError) {
            toast({
                title: language === 'en' ? 'Error' : 'Hata',
                description: language === 'en' ? 'An error occurred while creating the internal sensor.' : 'Dahili sensör oluşturulurken bir hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                title: language === 'en' ? 'Success' : 'Başarılı',
                description: language === 'en' ? 'Internal sensor created successfully.' : 'Dahili sensör başarıyla oluşturuldu.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            refetchInternalSensors();
        }
    };

    const handleUpdateInternalSensor = async (id, data) => {
        await updateInternalSensorData(id, data);
        if (updateInternalSensorError) {
            toast({
                title: language === 'en' ? 'Error' : 'Hata',
                description: language === 'en' ? 'An error occurred while updating the internal sensor.' : 'Dahili sensör güncellenirken bir hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                title: language === 'en' ? 'Success' : 'Başarılı',
                description: language === 'en' ? 'Internal sensor updated successfully.' : 'Dahili sensör başarıyla güncellendi.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            refetchInternalSensors();
        }
    };

    const handleDeleteInternalSensor = async (id) => {
        await deleteInternalSensorData(id);
        if (deleteInternalSensorError) {
            toast({
                title: language === 'en' ? 'Error' : 'Hata',
                description: language === 'en' ? 'An error occurred while deleting the internal sensor.' : 'Dahili sensör silinirken bir hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                title: language === 'en' ? 'Success' : 'Başarılı',
                description: language === 'en' ? 'Internal sensor deleted successfully.' : 'Dahili sensör başarıyla silindi.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            refetchInternalSensors();
        }
    };

    const tabs = [
        {
            label: language === 'en' ? 'New Internal Sensor' : 'Yeni Dahili Sensör',
            content: <InternalSensorCreateForm onSubmit={handleCreateInternalSensor} />,
        },
        {
            label: language === 'en' ? 'Sensors' : 'Sensörler',
            content: (
                <>
                    <Stack flexDir={['column', 'row']} spacing={4} align='center' justify='center'>
                        {projectsLoading && (
                            <Flex align='center' justify='center' direction='column'>
                                <Spinner size="xl" color="green.500" />
                                <Skeleton height="20px" />
                            </Flex>
                        )}
                        {projects && !projectsLoading && (
                            <Select color={'green'} backgroundColor={'rgba(127, 127, 127, 0.2)'} textAlign={'center'} placeholder={language === 'en' ? 'Select Project.' : 'Proje Seçiniz.'} onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject}>
                                {projects.map((project, index) => (
                                    <option key={index} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </Select>
                        )}
                        {devicesLoading && (
                            <Flex align='center' justify='center' direction='column'>
                                <Spinner size="xl" color="green.500" />
                                <Skeleton height="20px" />
                            </Flex>
                        )}
                        {devices && !devicesLoading && (
                            <Select color={'green'} backgroundColor={'rgba(127, 127, 127, 0.2)'} textAlign={'center'} placeholder={language === 'en' ? 'Select Device' : 'Cihaz Seçiniz.'} onChange={(e) => setSelectedDevice(e.target.value)} value={selectedDevice}>
                                {devices && devices.devices && devices.devices.map((device, index) => (
                                    <option key={index} value={device.id}>
                                        {device.name}
                                    </option>
                                ))}
                            </Select>
                        )}
                    </Stack>
                    <br />
                    {internalSensorsLoading && (
                        <Flex align='center' justify='center' direction='column'>
                            <Spinner size="xl" color="green.500" />
                            <Skeleton height="20px" />
                        </Flex>
                    )}
                    {internalSensors && !internalSensorsLoading && internalSensors.internal_sensors && internalSensors.internal_sensors.length > 0 && (
                        <CardGrid>
                            {internalSensors.internal_sensors.map((internalSensor, index) => (
                                // <InternalSensorCard key={index} internalSensor={internalSensor} onUpdate={handleUpdateInternalSensor} onDelete={handleDeleteInternalSensor} />
                                <CardLayout 
                                    key={index} 
                                    cardChildren={<InternalSensorCardContent internalSensor={internalSensor}/>} 
                                    data={internalSensor} 
                                    onEdit={handleUpdateInternalSensor} 
                                    onDelete={handleDeleteInternalSensor}
                                    FormComponent={InternalSensorCreateForm}
                                />
                            ))}
                        </CardGrid>
                    )}
                </>
            ),
        },
        
    ];

    if(user.auth_id < 3){
        tabs.shift();
    }

    return (
        <CustomTabs tabs={tabs} />
    );
};

export default InternalSensorsPage;