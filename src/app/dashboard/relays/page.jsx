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

//import RelayCard from '@/depreciated-components/relay-card.component';
import RelayCreateForm from '@/forms/relay-create.form';
import CustomTabs from '@/components/CustomTabs';

import CardLayout from '@/components/card-layout.component';
import RelayCardContent from '@/card-contents/relay.card-content';

import { optionStyle } from '@/utils';

const RelaysPage = () => {
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

    const { data: relays, loading: relaysLoading, error: relaysError, setData: setRelays, refetch: refetchRelays } = useFetchData(`/relays/device/${selectedDevice}?page=${page}&size=${limit}`);
    const { data: newRelay, loading: newRelayLoading, error: newRelayError, createData: createRelay } = useCreateData('/relays/raw/');
    const { data: updatedRelay, loading: updatedRelayLoading, error: updatedRelayError, updateData: updateRelay } = useUpdateData('/relays/raw');
    const { data: deletedRelay, loading: deletedRelayLoading, error: deletedRelayError, deleteData: deleteRelay } = useDeleteData('/relays/raw');

    const handleIncreasePage = () => setPage(page + 1);
    const handleDecreasePage = () => setPage(page - 1);

    useEffect(() => {
        if (projects && !projectsLoading) {
            setSelectedProject(projects[0].id);
        }
    }, [projects, projectsLoading, projectsError]);

    useEffect(() => {
        if (devices && !devicesLoading && devices.devices && devices.devices.length > 0) {
            setSelectedDevice(devices.devices[0].id);
        }
    }, [selectedProject, devices, devicesLoading]);

    useEffect(() => {
        if (relays && relays.total >= relays.page * relays.size) {
            setShowPagination(true);
        } else {
            setShowPagination(false);
        }
    }, [selectedProject, selectedDevice, relays]);

    const handleCreateRelay = async (data) => {
        await createRelay(data);
        if (newRelayError) {
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
    };

    const handleUpdateRelay = async (id, data) => {
        await updateRelay(id, data);
        if (updatedRelayError) {
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
    };

    const handleDeleteRelay = async (id) => {
        await deleteRelay(id);
        if (deletedRelayError) {
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
    };

    const tabs = [
        {
            label: language === 'en' ? 'Relays' : 'Röleler',
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
                            <Select color={'green'} backgroundColor={'rgba(127, 127, 127, 0.2)'} textAlign={'center'} onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject}>
                                <option style={optionStyle} value=''>{language === 'en' ? 'Select Project' : 'Proje Seçiniz.'}</option>
                                {projects.map((project, index) => (
                                    <option style={optionStyle} key={index} value={project.id}>
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
                            <Select color={'green'} backgroundColor={'rgba(127, 127, 127, 0.2)'} textAlign={'center'}  onChange={(e) => setSelectedDevice(e.target.value)} value={selectedDevice}>
                                <option style={optionStyle} value=''>{language === 'en' ? 'Select Device' : 'Cihaz Seçiniz.'}</option>
                                {devices.devices.map((device, index) => (
                                    <option style={optionStyle} key={index} value={device.id}>
                                        {device.name}
                                    </option>
                                ))}
                            </Select>
                        )}
                    </Stack>
                    <br />
                    {relaysLoading ? (
                        <Flex align='center' justify='center' direction='column'>
                            <Spinner size="xl" color="green.500" />
                            <Skeleton height="20px" />
                        </Flex>
                    ) : relays && relays.relays && relays.relays.length > 0 ? (
                        <CardGrid>
                            {relays.relays.map((relay, index) => (
                                // <RelayCard key={index} relay={relay} onUpdate={handleUpdateRelay} onDelete={handleDeleteRelay} />
                                <CardLayout
                                    key={index}
                                    cardChildren={<RelayCardContent relay={relay} />}
                                    FormComponent={RelayCreateForm}
                                    onEdit={handleUpdateRelay}
                                    onDelete={handleDeleteRelay}
                                    data={relay}
                                />
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
                </>
            ),
        },
    ];

    if (user && user.auth_id > 3) {
        tabs.unshift({
            label: language === 'en' ? 'New Relay' : 'Yeni Röle',
            content: <RelayCreateForm onSubmit={handleCreateRelay} />,
        });
    }

    return <CustomTabs tabs={tabs} />;
};

export default RelaysPage;