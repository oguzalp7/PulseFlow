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
import { Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Text, useToast, Spinner, SkeletonText, Skeleton, Box, Stack, Select, HStack, VStack, IconButton, Checkbox } from '@chakra-ui/react'

import RelayCard from '@/components/relay-card.component';
import RelayCreateForm from '@/forms/relay-create.form';

const RelaysPage = () => {
    const {user} = useContext(UserContext);
    const {language} = useLanguage();
    const toast = useToast();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);

    const [showPagination, setShowPagination] = useState(false);

    const { data: projects, loading: projectsLoading, error: projectsError, setData: setProjects, refetch: refetchProjects } = useFetchData(`/users/projects/${user.id}`);
    const [selectedProject, setSelectedProject] = useState(projects && projects.length > 0 ? projects[0].id : null);

    const {data: devices, loading: devicesLoading, error: devicesError, setData: setDevices, refetch: refetchDevices} = useFetchData(`/devices/raw/project/${selectedProject}?page=${1}&size=${50}`);
    const [selectedDevice, setSelectedDevice] = useState(devices && devices.length > 0 ? devices[0].id : null);

    const {data: relays, loading: relaysLoading, error: relaysError, setData: setRelays, refetch: refetchRelays} = useFetchData(`/relays/device/${selectedDevice}?page=${page}&size=${limit}`);
    const {data: newRelay, loading: newRelayLoading, error: newRelayError, createData: createRelay} = useCreateData('/relays/raw/');
    const handleIncreasePage = () => setPage(page + 1);

    const handleDecreasePage = () => setPage(page - 1);

    const {data: updatedRelay, loading: updatedRelayLoading, error: updatedRelayError, updateData: updateRelay} = useUpdateData('/relays/raw');
    const {data: deletedRelay, loading: deletedRelayLoading, error: deletedRelayError, deleteData: deleteRelay} = useDeleteData('/relays/raw');

    useEffect(() => {
        if(projects  && !projectsLoading){ 
            setSelectedProject(projects[0].id);
        }
    }, [projects, projectsLoading, projectsError]);
    
    useEffect(() => {
            if (projects && projects.length > 0) {
                // Set the first project as the default selected option
                document.querySelector('select').value = projects[0].id;
            }else if(projects && projects.length === 0){
                document.querySelector('select').value = '';
            }
    }, [projects]);

    useEffect(() => {
        if(devices && !devicesLoading && devices.devices && devices.devices.length > 0){ 
            setSelectedDevice(devices.devices[0].id);
        }
    }, [selectedProject, devices, devicesLoading]);

    // useEffect(() => {
    //     if (devices && devices.devices && devices.devices.length > 0) {
    //         // Set the first device as the default selected option
    //         document.querySelector('select').value = devices.devices[0].id;
    //     }else if(devices && devices.devices && devices.devices.length === 0){
    //         document.querySelector('select').value = '';
    //     }
    // }, [devices]);

    useEffect(() => {
        if(relays && relays.total >= relays.page * relays.size){
            setShowPagination(true);
        } else {
            setShowPagination(false);
        }
    }, [selectedProject, selectedDevice, relays]);

    const handleCreateRelay = async (data) => {
        await createRelay(data);
        if(newRelayError){
            toast({
                title: language === 'en' ? 'Error' : 'Hata',
                description: language === 'en' ? 'An error occurred while creating the relay.' : 'Röle oluşturulurken bir hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        
        } else {
            toast({
                title: language === 'en' ? 'Success' : 'Başarılı',
                description: language === 'en' ? 'Relay created successfully.' : 'Röle başarıyla oluşturuldu.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            refetchRelays();
        }

        
    }

    const handleUpdateRelay = async (id, data) => {
        await updateRelay(id, data);
        if(updatedRelayError){
            toast({
                title: language === 'en' ? 'Error' : 'Hata',
                description: language === 'en' ? 'An error occurred while updating the relay.' : 'Röle güncellenirken bir hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                title: language === 'en' ? 'Success' : 'Başarılı',
                description: language === 'en' ? 'Relay updated successfully.' : 'Röle başarıyla güncellendi.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            refetchRelays();
        }
    }

    const handleDeleteRelay = async (id) => {
        await deleteRelay(id);
        if(deletedRelayError){
            toast({
                title: language === 'en' ? 'Error' : 'Hata',
                description: language === 'en' ? 'An error occurred while deleting the relay.' : 'Röle silinirken bir hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                title: language === 'en' ? 'Success' : 'Başarılı',
                description: language === 'en' ? 'Relay deleted successfully.' : 'Röle başarıyla silindi.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            refetchRelays();
        }
    }

    return(
        <Tabs variant='soft-rounded' colorScheme='purple'  w={['xs', 'md', 'full']}  p={4} boxShadow="lg">
            <TabList border={'1px'} borderRadius={'10px'} borderColor={'rgba(0, 255, 0, 0.3)'} mr={[10, 0]} paddingRight={[10, 0]} p={2} mb={4}  boxSize={['90%', '100%']} overflowX={'auto'}>
                {user && user.auth_id > 3 && <Tab color={'green'}>{language === 'en' ? 'New Relay' : 'Yeni Röle'}</Tab>}
                <Tab color={'green'}>{language === 'en' ? 'Relays' : 'Röleler'}</Tab>
            </TabList>

            <TabPanels boxSize={'100%'}>
                {user && user.auth_id > 3 && 
                    <TabPanel align={['center', 'left']} >
                    {/* <ProjectCreateForm onSubmit={handleCreateProject}/> */}
                    {/* <DeviceCreateForm onSubmit={handleCreateDevice}/> */}
                    {/* <ActuatorCreateForm onSubmit={handleCreateActuator}/> */}
                        <RelayCreateForm onSubmit={handleCreateRelay}/>
                    </TabPanel>
                }
                <TabPanel align={['center', 'left']} >
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

                    {relaysLoading ? (
                        <Flex align='center' justify='center' direction='column'>
                            <Spinner size="xl" color="green.500" />
                            <Skeleton height="20px"/>
                        </Flex>
                    ) : relays && relays.relays && relays.relays.length > 0 ? (
                        <CardGrid >
                            {relays.relays.map((relay, index) => (
                                <RelayCard key={index} relay={relay} onUpdate={handleUpdateRelay} onDelete={handleDeleteRelay} />
                            ))}
                        </CardGrid>
                    ) : (
                        <Flex align='center' justify='center' direction='column'>
                            <Text color='gray.500'>{language === 'en' ? 'No relays found.' : 'Röle bulunamadı.'}</Text>
                        </Flex>
                    )}

                    {showPagination && (
                        <VStack>
                            <HStack>
                                {page > 1 && <IconButton variant={'ghost'} color={'green.500'} onClick={handleDecreasePage} icon={<GrPrevious />} />}
                                {relays && relays.total >= relays.page * relays.size && <IconButton variant={'ghost'} color={'green.500'} onClick={handleIncreasePage} icon={<GrNext />} />}
                            </HStack>
                            <HStack justifyContent='center' mt={4}>
                                <Text color='gray.500'>{language === 'en' ? 'Page' : 'Sayfa'}</Text>
                                <Text color='gray.500'>{page}</Text>
                                <Text color='gray.500'>{language === 'en' ? 'of' : '/'}</Text>
                                <Text color='gray.500'>{relays && relays.total && Math.ceil(relays.total / relays.size)}</Text>
                                
                            </HStack>
                            <HStack>
                                <Text color='gray.500'>{language === 'en' ? 'Total' : 'Toplam'}</Text>
                                <Text color='gray.500'>{relays && relays.total}</Text>
                                <Text color='gray.500'>{language === 'en' ? 'Actuators' : 'Aktüatör'}</Text>
                            </HStack>
                        </VStack>
                    )}
                </TabPanel>
        
            </TabPanels>
        
        </Tabs>

    );
}

export default RelaysPage;