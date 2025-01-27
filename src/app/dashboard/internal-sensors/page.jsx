"use client";

import React, { useState, useEffect, useContext } from 'react'
import UserContext from '@/contexts/user-context';
import {useLanguage} from '@/contexts/language-context';

import useFetchData from '@/hooks/useFetchData';
import useCreateData from '@/hooks/useCreateData';
import useUpdateData from '@/hooks/useUpdateData';
import useDeleteData from '@/hooks/useDeleteData';

import { GrNext, GrPrevious  } from "react-icons/gr";
import CardGrid from '@/components/card-grid.component';
import { Tabs, TabList, TabPanels , Stack, Tab, TabPanel, Flex, Text, useToast, Spinner, SkeletonText, Skeleton, Box, Select, HStack, VStack, IconButton, Checkbox } from '@chakra-ui/react'


import InternalSensorCreateForm from '@/forms/internal-sensor-create.form';
import InternalSensorCard from '@/components/internal-sensor-card.component';

const InternalSensorsPage = () => {
    const {user} = useContext(UserContext);
    const {language} = useLanguage();
    const toast = useToast();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);

    const [showPagination, setShowPagination] = useState(false);

    const handleIncreasePage = () => setPage(page + 1);

    const handleDecreasePage = () => setPage(page - 1);

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

    const {data: newInternalSensor, loading: newInternalSensorLoading, error: newInternalSensorError, createData: createInternalSensor} = useCreateData(`/internal-sensors/raw/`);
    const {data: updateInternalSensor, loading: updateInternalSensorLoading, error: updateInternalSensorError, updateData: updateInternalSensorData} = useUpdateData(`/internal-sensors/raw`);
    const {data: deleteInternalSensor, loading: deleteInternalSensorLoading, error: deleteInternalSensorError, deleteData: deleteInternalSensorData} = useDeleteData(`/internal-sensors/raw`);

    useEffect(() => {
        if(projects && projects.length > 0) {
            setSelectedProject(projects[0].id);
        }
    }, [projects]);

    // useEffect(() => {
    //     if(devices && devices.devices.length > 0) {
    //         setSelectedDevice(devices[0].id);
    //     }
    // }, [devices]);

    useEffect(() => {
        if(internalSensors && internalSensors.total >= internalSensors.page * internalSensors.size) {
            setShowPagination(true);
        }else {
            setShowPagination(false);
        }
    }, [internalSensors, selectedDevice, selectedProject]);



    const handleCreateInternalSensor = async (data) => {
        console.log(data);
        await createInternalSensor(data);
        if(newInternalSensor) {
            toast({
                title: 'Internal Sensor Created',
                description: 'Internal Sensor has been created successfully.',
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            refetchInternalSensors();
        }
        else {
            toast({
                title: 'Internal Sensor Creation Failed',
                description: 'Internal Sensor could not be created.',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    }

    const handleUpdateInternalSensor = async (id, data) => {
        await updateInternalSensor(id, data);
        if(updateInternalSensor) {
            toast({
                title: 'Internal Sensor Updated',
                description: 'Internal Sensor has been updated successfully.',
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            refetchInternalSensors();
        }
        else {
            toast({
                title: 'Internal Sensor Update Failed',
                description: 'Internal Sensor could not be updated.',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    }

    const handleDeleteInternalSensor = async (id) => {
        await deleteInternalSensor(id);
        if(deleteInternalSensor) {
            toast({
                title: 'Internal Sensor Deleted',
                description: 'Internal Sensor has been deleted successfully.',
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            refetchInternalSensors();
        }
        else {
            toast({
                title: 'Internal Sensor Deletion Failed',
                description: 'Internal Sensor could not be deleted.',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    }

    return(
        <Tabs variant='soft-rounded' colorScheme='purple'  w={['sm', 'md', 'full']}  p={4} boxShadow="lg">
            <TabList>
                {user && user.auth_id > 3 && 
                    <Tab color={'green'}>{language === 'en' ? 'New Internal Sensor' : 'Yeni Dahili Sensör'}</Tab> 
                }
                <Tab>Sensors</Tab>
            </TabList>
            <TabPanels>
                {user && user.auth_id > 3 &&
                    <TabPanel>
                        <InternalSensorCreateForm onSubmit={handleCreateInternalSensor} />
                    </TabPanel>
                }
                <TabPanel>
                    <Stack flexDir={['column', 'row']} spacing={4} align='center' justify='center'>
                        {projectsLoading && (
                            <Flex align='center' justify='center' direction='column'>
                            <Spinner size="xl" color="green.500" />
                            <Skeleton height="20px"/>
                            </Flex>
                        )}
                        {projects && !projectsLoading && (
                            <Select color={'green'} backgroundColor={'rgba(127, 127, 127, 0.2)'} textAlign={'center'} placeholder={language === 'en' ? 'Select Project.' : 'Proje Seçiniz.'} onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject}>
                            {projects && projects.map((project, index) => (
                                <option key={index} value={project.id}>
                                {project.name}
                                </option>
                            ))}
                            </Select>
                        )}

                        {devicesLoading && (
                        
                            <Flex align='center' justify='center' direction='column'>
                                <Spinner size="xl" color="green.500" /> 
                                <Skeleton height="20px"/>
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

                    <br/>

                    {internalSensorsLoading && (
                        <Flex align='center' justify='center' direction='column'>
                            <Spinner size="xl" color="green.500" />
                            <Skeleton height="20px"/>
                        </Flex>
                    )}
                    {internalSensors && !internalSensorsLoading && internalSensors.internal_sensors && internalSensors.internal_sensors.length > 0 && (
                        <CardGrid>
                            {internalSensors.internal_sensors.map((internalSensor, index) => (
                                <InternalSensorCard key={index} internalSensor={internalSensor} onUpdate={handleUpdateInternalSensor} onDelete={handleDeleteInternalSensor} />
                            ))}
                        </CardGrid>
                    )}
                </TabPanel>
            </TabPanels>

        </Tabs>
    );
};

export default InternalSensorsPage;