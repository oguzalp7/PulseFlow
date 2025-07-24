"use client";

import React, {useContext, useState} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, FormControl, FormLabel, Input, Select, Text, Textarea } from '@chakra-ui/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useFetchData from '@/hooks/useFetchData';
import UserContext from '@/contexts/user-context';
import { useLanguage } from '@/contexts/language-context';
import GlowingGreenNeonButton from '@/components/glowing-neon-green-button.component';

import { optionStyle } from '@/utils';

const schema = yup.object().shape({
    name: yup.string().required("Device name is required. / Cihaz adı zorunludur."),
    mac_address: yup.string().required("MAC address is required. / MAC adresi zorunludur."),
    project_id: yup.number().required("Project is required. / Proje zorunludur."),
});

const DeviceCreateForm = ({ onSubmit, defaultValues }) => {
    const { user } = useContext(UserContext);
    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });
    const { data: projects, loading: projectsLoading, error: projectsError, setData: setProjects, refetch } = useFetchData(`/users/projects/${user.id}`);
    
    const { language } = useLanguage();
    const [selectedProject, setSelectedProject] = useState(projects && projects.length > 0 ? projects[0].id : null);


    return (
        <Box boxSize={['90%', '100%']} mr={10} p={4}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Device Name:' : 'Cihaz Adı:'}</FormLabel>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => <Input color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please enter your device name.' : 'Cihaz adınızı giriniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text as={'b'} color="red.500">{errors.name?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'MAC Address:' : 'MAC Adresi:'}</FormLabel>
                    <Controller
                        name="mac_address"
                        control={control}
                        render={({ field }) => <Input color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? "Please enter your device's MAC address." : 'Cihazınızın MAC adresini giriniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text as={'b'} color="red.500">{errors.mac_address?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Project:' : 'Proje:'}</FormLabel>
                    <Controller
                        name="project_id"
                        control={control}
                        render={({ field }) => (
                            <Select textAlign={'center'} color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please select your project.' : 'Projenizi seçiniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field}>
                                {projects && projects.map((project, index) => (
                                    <option style={optionStyle} key={index} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </Select>
                        )}
                    />
                    <Text as={'b'} color="red.500">{errors.project_id?.message}</Text>
                </FormControl>
                <GlowingGreenNeonButton type="submit">{language === 'en' ? 'Save' : 'Kaydet'}</GlowingGreenNeonButton>

            </form>
        </Box>
    );
}

export default DeviceCreateForm;