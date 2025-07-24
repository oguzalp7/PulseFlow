"use client";

import React, { useState, useEffect, useContext } from 'react';
import UserContext from '@/contexts/user-context';
import { useLanguage } from '@/contexts/language-context';
import useFetchData from '@/hooks/useFetchData';
import useCreateData from '@/hooks/useCreateData';
import useUpdateData from '@/hooks/useUpdateData';
import useDeleteData from '@/hooks/useDeleteData';
import { GrNext, GrPrevious } from 'react-icons/gr';
import CardGrid from '@/components/card-grid.component';
import CardLayout from '@/components/card-layout.component';
import { Flex, Text, useToast, Spinner, SkeletonText, Skeleton, Box, Select, HStack, VStack, IconButton } from '@chakra-ui/react';
import DeviceCreateForm from '@/forms/device-create.form';
// import DeviceCard from '@/depreciated-components/device-card.component';
import CustomTabs from '@/components/CustomTabs';

import DeviceCardContent from '@/card-contents/device.card-content';
import { optionStyle } from '@/utils';

const DevicesPage = () => {
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const toast = useToast();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const { data: projects, loading: projectsLoading, error: projectsError, setData: setProjects, refetch: refetchProjects } = useFetchData(`/users/projects/${user.id}`);
    const [selectedProject, setSelectedProject] = useState(projects && projects.length > 0 ? projects[0].id : null);
    const { data: newDevice, loading: newDeviceLoading, error: newDeviceError, createData } = useCreateData('/devices/raw/');
    const { data: devices, loading: devicesLoading, error: devicesError, setData: setDevices, refetch: refetchDevices } = useFetchData(`/devices/raw/project/${selectedProject}?page=${page}&size=${limit}`);
    const { data: updatedDevice, loading: updatedDeviceLoading, error: updatedDeviceError, updateData } = useUpdateData('/devices/raw');
    const { data: deletedDevice, loading: deletedDeviceLoading, error: deletedDeviceError, deleteData } = useDeleteData('/devices/raw');

    const [showPagination, setShowPagination] = useState(false);

    useEffect(() => {
        if (devices && devices.total >= devices.page * devices.size) {
            setShowPagination(true);
        } else {
            setShowPagination(false);
        }
    }, [selectedProject, devices]);

    const handleIncreasePage = () => setPage(page + 1);

    const handleDecreasePage = () => setPage(page - 1);

    useEffect(() => {
        if (projects && !projectsLoading) {
            setSelectedProject(projects[0].id);
        }
    }, [projects, projectsLoading, projectsError]);

    useEffect(() => {
        if (projects && projects.length > 0) {
            document.querySelector('select').value = projects[0].id;
        } else if (projects && projects.length === 0) {
            document.querySelector('select').value = '';
        }
    }, [projects]);

    const handleCreateDevice = async (formData) => {
        await createData(formData);
        if (!newDeviceError) {
            toast({
                title: language === 'en' ? 'New device created successfully. 🎊' : 'Yeni cihaz kaydı başarıyla oluşturuldu. 🎊',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            refetchDevices(); // Re-fetch projects after creation
        } else {
            console.log(error);
            toast({
                title: language === 'en' ? 'Error creating new device record.' : 'Yeni cihaz kaydı oluşturulurken hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleUpdateDevice = async (id, formData) => {
        await updateData(id, formData);
        if (!updatedDeviceError) {
            toast({
                title: language === 'en' ? 'Device updated successfully. 🎊' : 'Cihaz kaydı başarıyla güncellendi. 🎊',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            refetchDevices(); // Re-fetch projects after update
        } else {
            toast({
                title: language === 'en' ? 'Error updating device record.' : 'Cihaz kaydı güncellenirken hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleDeleteDevice = async (id) => {
        await deleteData(id);
        if (!deletedDeviceError) {
            toast({
                title: language === 'en' ? 'Device deleted successfully. 🎊' : 'Cihaz kaydı başarıyla silindi. 🎊',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            refetchDevices(); // Re-fetch projects after deletion
        } else {
            toast({
                title: language === 'en' ? 'Error deleting device record.' : 'Cihaz kaydı silinirken hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const tabs = [
        {
            label: language === 'en' ? 'New Device' : 'Yeni Cihaz',
            content: user && user.auth_id > 3 && <DeviceCreateForm onSubmit={handleCreateDevice} />
        },
        {
            label: language === 'en' ? 'Devices' : 'Cihazlarım',
            content: (
                <>
                    <HStack>
                        {projectsLoading && (
                            <Flex align='center' justify='center' direction='column'>
                                <Spinner size="xl" color="green.500" />
                                <Skeleton height="20px" />
                            </Flex>
                        )}
                        {projects && !projectsLoading && (
                            <Select color={'green'} backgroundColor={'rgba(127, 127, 127, 0.2)'} textAlign={'center'}  onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject}>
                                <option style={optionStyle} value=''>{language === 'en' ? 'All Projects' : 'Tüm Projeler'}</option>
                                {projects && projects.map((project, index) => (
                                    <option style={optionStyle} key={index} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </Select>
                        )}
                    </HStack>
                    <br />
                    {devicesLoading ? (
                        <Flex align='center' justify='center' direction='column'>
                            <Spinner size="xl" color="green.500" />
                            <Skeleton height="20px" />
                        </Flex>
                    ) : (
                        <CardGrid>
                            {devices && devices.devices && devices.devices.map((device) => (
                                //<DeviceCard key={device.id} device={device} onUpdate={handleUpdateDevice} onDelete={handleDeleteDevice} />
                                <CardLayout 
                                    key={device.id} 
                                    FormComponent={DeviceCreateForm} 
                                    cardChildren={<DeviceCardContent device={device} />}
                                    data={device} onEdit={handleUpdateDevice} 
                                    onDelete={handleDeleteDevice} />
                            ))}
                        </CardGrid>
                    )}
                    {showPagination && (
                        <VStack>
                            <HStack>
                                {page > 1 && <IconButton variant={'ghost'} color={'green.500'} onClick={handleDecreasePage} icon={<GrPrevious />} />}
                                {devices && devices.total > devices.page * devices.size && <IconButton variant={'ghost'} color={'green.500'} onClick={handleIncreasePage} icon={<GrNext />} />}
                            </HStack>
                            <HStack justifyContent='center' mt={4}>
                                <Text color='gray.500'>{language === 'en' ? 'Page' : 'Sayfa'}</Text>
                                <Text color='gray.500'>{page}</Text>
                                <Text color='gray.500'>{language === 'en' ? 'of' : '/'}</Text>
                                <Text color='gray.500'>{devices && devices.total && Math.ceil(devices.total / devices.size)}</Text>
                            </HStack>
                            <HStack>
                                <Text color='gray.500'>{language === 'en' ? 'Total' : 'Toplam'}</Text>
                                <Text color='gray.500'>{devices && devices.total}</Text>
                                <Text color='gray.500'>{language === 'en' ? 'Devices' : 'Cihaz'}</Text>
                            </HStack>
                        </VStack>
                    )}
                </>
            )
        }
    ];

    if(user.auth_id < 3){
        tabs.shift();
    }

    return <CustomTabs tabs={tabs} />;
};

export default DevicesPage;