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
import { Flex, Text, useToast, Spinner, Skeleton, Stack, Select, HStack, VStack, IconButton } from '@chakra-ui/react';

// import ExternalSensorCard from "@/depreciated-components/external-sensor-card.component";
import ExternalSensorCreateForm from '@/forms/external-sensor-create.form';
import CustomTabs from '@/components/CustomTabs';
import CardLayout from '@/components/card-layout.component';
import ExternalSensorCardContent from '@/card-contents/external-sensor.card-content';

const ExternalSensorsPage = () => {
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

    // Construct the query string with pagination parameters
    const query = new URLSearchParams();
    if (selectedProject) query.append('p', selectedProject);
    if (selectedDevice) query.append('d', selectedDevice);
    query.append('page', page);
    query.append('limit', limit);

    const { data: externalSensors, loading: externalSensorsLoading, error: externalSensorsError, setData: setExternalSensors, refetch: refetchExternalSensors } = useFetchData(`/external-sensors/?${query.toString()}`);

    const { data: newExternalSensor, loading: newExternalSensorLoading, error: newExternalSensorError, createData: createExternalSensor } = useCreateData(`/external-sensors/raw/`);
    const { data: updateExternalSensor, loading: updateExternalSensorLoading, error: updateExternalSensorError, updateData: updateExternalSensorData } = useUpdateData(`/external-sensors/raw`);
    const { data: deleteExternalSensor, loading: deleteExternalSensorLoading, error: deleteExternalSensorError, deleteData: deleteExternalSensorData } = useDeleteData(`/external-sensors/raw`);

    const handleIncreasePage = () => setPage(page + 1);
    const handleDecreasePage = () => setPage(page - 1);

    useEffect(() => {
        if (projects && projects.length > 0) {
            setSelectedProject(projects[0].id);
        }
    }, [projects]);

    useEffect(() => {
        if (externalSensors && externalSensors.total >= externalSensors.page * externalSensors.size) {
            setShowPagination(true);
        } else {
            setShowPagination(false);
        }
    }, [externalSensors, selectedDevice, selectedProject]);

    const handleCreateExternalSensor = async (data) => {
        try {
            await createExternalSensor(data);
            toast({
                title: language === 'en' ? 'External Sensor Created' : 'Harici Sensör Oluşturuldu',
                description: language === 'en' ? 'External Sensor has been created successfully.' : 'Harici Sensör başarıyla oluşturuldu.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            refetchExternalSensors();
        } catch (err) {
            toast({
                title: language === 'en' ? 'External Sensor Creation Failed' : 'Harici Sensör Oluşturulamadı',
                description: err.message || (language === 'en' ? 'External Sensor could not be created.' : 'Harici Sensör oluşturulamadı.'),
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleUpdateExternalSensor = async (id, data) => {
        await updateExternalSensorData(id, data);
        if (updateExternalSensorError) {
            toast({
                title: language === 'en' ? 'Error' : 'Hata',
                description: language === 'en' ? 'An error occurred while updating the external sensor.' : 'Harici sensör güncellenirken bir hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                title: language === 'en' ? 'Success' : 'Başarılı',
                description: language === 'en' ? 'External sensor updated successfully.' : 'Harici sensör başarıyla güncellendi.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            refetchExternalSensors();
        }
    };

    const handleDeleteExternalSensor = async (id) => {
        await deleteExternalSensorData(id);
        if (deleteExternalSensorError) {
            toast({
                title: language === 'en' ? 'Error' : 'Hata',
                description: language === 'en' ? 'An error occurred while deleting the external sensor.' : 'Harici sensör silinirken bir hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                title: language === 'en' ? 'Success' : 'Başarılı',
                description: language === 'en' ? 'External sensor deleted successfully.' : 'Harici sensör başarıyla silindi.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            refetchExternalSensors();
        }
    };

    const tabs = [
        {
            label: language === 'en' ? 'External Sensors' : 'Harici Sensörler',
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
                                {devices.devices.map((device, index) => (
                                    <option key={index} value={device.id}>
                                        {device.name}
                                    </option>
                                ))}
                            </Select>
                        )}
                    </Stack>
                    <br />
                    {externalSensorsLoading && (
                        <Flex align='center' justify='center' direction='column'>
                            <Spinner size="xl" color="green.500" />
                            <Skeleton height="20px" />
                        </Flex>
                    )}
                    {externalSensors && !externalSensorsLoading && externalSensors.external_sensors && externalSensors.external_sensors.length > 0 && (
                        <CardGrid>
                            {externalSensors.external_sensors.map((externalSensor, index) => (
                                // <ExternalSensorCard key={index} externalSensor={externalSensor} onUpdate={handleUpdateExternalSensor} onDelete={handleDeleteExternalSensor} />
                                <CardLayout 
                                    key={index} 
                                    data={externalSensor} 
                                    onEdit={handleUpdateExternalSensor} 
                                    onDelete={handleDeleteExternalSensor} 
                                    FormComponent={ExternalSensorCreateForm}
                                    cardChildren={<ExternalSensorCardContent externalSensor={externalSensor} />}
                                />
                            ))}
                        </CardGrid>
                    )}
                    {showPagination && (
                        <VStack>
                            <HStack>
                                {page > 1 && <IconButton variant={'ghost'} color={'green.500'} onClick={handleDecreasePage} icon={<GrPrevious />} />}
                                {externalSensors && externalSensors.total >= externalSensors.page * externalSensors.size && <IconButton variant={'ghost'} color={'green.500'} onClick={handleIncreasePage} icon={<GrNext />} />}
                            </HStack>
                            <HStack justifyContent='center' mt={4}>
                                <Text color='gray.500'>{language === 'en' ? 'Page' : 'Sayfa'}</Text>
                                <Text color='gray.500'>{page}</Text>
                                <Text color='gray.500'>{language === 'en' ? 'of' : '/'}</Text>
                                <Text color='gray.500'>{externalSensors && externalSensors.total && Math.ceil(externalSensors.total / externalSensors.size)}</Text>
                            </HStack>
                            <HStack>
                                <Text color='gray.500'>{language === 'en' ? 'Total' : 'Toplam'}</Text>
                                <Text color='gray.500'>{externalSensors && externalSensors.total}</Text>
                                <Text color='gray.500'>{language === 'en' ? 'Sensors' : 'Sensörler'}</Text>
                            </HStack>
                        </VStack>
                    )}
                </>
            ),
        },
    ];

    if (user && user.auth_id > 3) {
        tabs.unshift({
            label: language === 'en' ? 'New External Sensor' : 'Yeni Harici Sensör',
            content: <ExternalSensorCreateForm onSubmit={handleCreateExternalSensor} />,
        });
    }

    return <CustomTabs tabs={tabs} />;
};

export default ExternalSensorsPage;