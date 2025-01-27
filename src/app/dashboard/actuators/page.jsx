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
import { Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Text, useToast, Spinner, SkeletonText, Skeleton, Box, Select, HStack, VStack, IconButton, Checkbox } from '@chakra-ui/react'


import ActuatorCreateForm from '@/forms/actuator-create.form';
import ActuatorCard from '@/components/actuator-card.component';

const ActuatorsPage = () => {
    const {user} = useContext(UserContext);
    const {language} = useLanguage();
    const toast = useToast();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [outOfOrder, setOutOfOrder] = useState(false);

    const [showPagination, setShowPagination] = useState(false);

    const { data: projects, loading: projectsLoading, error: projectsError, setData: setProjects, refetch: refetchProjects } = useFetchData(`/users/projects/${user.id}`);
    const [selectedProject, setSelectedProject] = useState(projects && projects.length > 0 ? projects[0].id : null);

    // const {data: devices, loading: devicesLoading, error: devicesError, setData: setDevices, refetch: refetchDevices} = useFetchData(`/devices/raw/project/${selectedProject}?page=${page}&size=${limit}`);
    // const [selectedDevice, setSelectedDevice] = useState(devices && devices.length > 0 ? devices[0].id : null);

    const {data: newActuator, loading: newActuatorLoading, error: newActuatorError, createData} = useCreateData('/outputs/raw/');
    const {data: actuators, loading: actuatorsLoading, error: actuatorsError, setData: setActuators, refetch: refetchActuators} = useFetchData(`/outputs/raw/project/${selectedProject}?page=${page}&size=${limit}&outOfOrder=${outOfOrder}`);
    const {updateData} = useUpdateData('/outputs/raw');
    const {deleteData} = useDeleteData('/outputs/raw');

    useEffect(() => {
          if (actuators && actuators.total >= actuators.page * actuators.size ) {
            setShowPagination(true);
          } else {
            setShowPagination(false);
          }
        }, [selectedProject, actuators]);

    const handleIncreasePage = () => setPage(page + 1);

    const handleDecreasePage = () => setPage(page - 1);

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

    const handleCreateActuator = async (data) => {
        try {
            await createData(data);
            refetchActuators();
            toast({
                title: language === 'en' ? 'Actuator created successfully.' : 'Aktüatör başarıyla oluşturuldu.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.log(error);
            toast({
                title: language === 'en' ? 'Actuator creation failed.' : 'Aktüatör oluşturma başarısız.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }
    
    const handleUpdateActuator = async (id, data) => {
        try {
            await updateData(id, data);
            refetchActuators();
            toast({
                title: language === 'en' ? 'Actuator updated successfully.' : 'Aktüatör başarıyla güncellendi.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.log(error);
            toast({
                title: language === 'en' ? 'Actuator update failed.' : 'Aktüatör güncelleme başarısız.',    
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }

    const handleDeleteActuator = async (id) => {
        try {
            await deleteData(id);
            refetchActuators();
            toast({
                title: language === 'en' ? 'Actuator deleted successfully.' : 'Aktüatör silindi.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.log(error);
            toast({
                title: language === 'en' ? 'Actuator deletion failed.' : 'Aktüatör silme başarısız.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }

    return(
        <Tabs variant='soft-rounded' align='center' colorScheme='purple'  w={['sm', 'md', 'full']}  p={4} boxShadow="lg">
            <TabList border={'1px'} borderRadius={'10px'} borderColor={'rgba(0, 255, 0, 0.3)'} mr={[10, 0]} paddingRight={[10, 0]} p={2} mb={4}  boxSize={['100%', '100%']} overflowX={'auto'}>
                {user && user.auth_id > 3 && <Tab color={'green'}>{language === 'en' ? 'New Actuator' : 'Yeni Aktüatör'}</Tab>}
                <Tab color={'green'}>{language === 'en' ? 'Actuators' : 'Aktüatörler'}</Tab>
            </TabList>

            <TabPanels boxSize={'100%'}>
                {user && user.auth_id > 3 && 
                    <TabPanel align={['center', 'left']} >
                    {/* <ProjectCreateForm onSubmit={handleCreateProject}/> */}
                    {/* <DeviceCreateForm onSubmit={handleCreateDevice}/> */}
                    <ActuatorCreateForm onSubmit={handleCreateActuator}/>
                    </TabPanel>}
                <TabPanel>
                    <HStack>
                        {projectsLoading && (
                            <Flex align='center' justify='center' direction='column'>
                            <Spinner size="xl" color="green.500" />
                            <Skeleton height="20px"/>
                            {/* <SkeletonText mt={4} noOfLines={4} spacing="4" /> */}
                            </Flex>
                        )}
                        {projects && !projectsLoading && (
                            <Select color={'green'} backgroundColor={'rgba(127, 127, 127, 0.2)'} textAlign={'center'} placeholder='Select Project' onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject}>
                            {projects && projects.map((project, index) => (
                                <option key={index} value={project.id}>
                                {project.name}
                                </option>
                            ))}
                            </Select>
                        )}

                        <Checkbox colorScheme='green' textColor={"gray.300"} isChecked={outOfOrder} onChange={(e) => setOutOfOrder(e.target.checked)}>{language === 'en' ? ' Faulty?' : 'Arızalı?'}</Checkbox>
                        
                        </HStack>
                        
                        <br />

                        {actuatorsLoading ? (
                            <Flex align='center' justify='center' direction='column'>
                            <Spinner size="xl" color="green.500" />
                            <Skeleton height="20px"/>
                            {/* <SkeletonText mt={4} noOfLines={4} spacing="4" /> */}
                            </Flex>
                        ) : (
                            <CardGrid>
                            {actuators && actuators.outputs && actuators.outputs.map((actuator) => (
                                <ActuatorCard key={actuator.id} actuator={actuator} onUpdate={handleUpdateActuator} onDelete={handleDeleteActuator}/>
                                
                            ))}
                            </CardGrid>
                        )}

                        {showPagination && (
                            <VStack>
                                <HStack>
                                    {page > 1 && <IconButton variant={'ghost'} color={'green.500'} onClick={handleDecreasePage} icon={<GrPrevious />} />}
                                    {actuators && actuators.total > actuators.page * actuators.size && <IconButton variant={'ghost'} color={'green.500'} onClick={handleIncreasePage} icon={<GrNext />} />}
                                </HStack>
                                <HStack justifyContent='center' mt={4}>
                                    <Text color='gray.500'>{language === 'en' ? 'Page' : 'Sayfa'}</Text>
                                    <Text color='gray.500'>{page}</Text>
                                    <Text color='gray.500'>{language === 'en' ? 'of' : '/'}</Text>
                                    <Text color='gray.500'>{actuators && actuators.total && Math.ceil(actuators.total / actuators.size)}</Text>
                                    
                                </HStack>
                                <HStack>
                                    <Text color='gray.500'>{language === 'en' ? 'Total' : 'Toplam'}</Text>
                                    <Text color='gray.500'>{actuators && actuators.total}</Text>
                                    <Text color='gray.500'>{language === 'en' ? 'Actuators' : 'Aktüatör'}</Text>
                                </HStack>
                            </VStack>
                        )}
                </TabPanel>
            </TabPanels>    
        </Tabs>
    );
}

export default ActuatorsPage;