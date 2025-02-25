"use client";

import React, { useContext, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, FormControl, FormLabel, Input, Select, Text, Spinner } from '@chakra-ui/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useFetchData from '@/hooks/useFetchData';
import UserContext from '@/contexts/user-context';
import { useLanguage } from '@/contexts/language-context';
import GlowingGreenNeonButton from '@/components/glowing-neon-green-button.component';

const externalSensorSchema = yup.object().shape({
    name: yup.string().min(3, 'En az 3 karakter olmalı').required('Zorunlu alan'),
    value: yup.number().typeError('Sayı olmalı').default(0.0),
    units_of_measure: yup.string().required('Zorunlu alan'),
    description: yup.string(),
    device_id: yup.number().transform((value) => (isNaN(value) ? undefined : value))
        .nullable()
        .required('Cihaz seçimi zorunludur'),
    location: yup.string()
});

const INITIAL_FORM_STATE = {
    name: '',
    value: 0,
    units_of_measure: '',
    description: '',
    device_id: '',
    location: ''
};

const ExternalSensorCreateForm = ({ onSubmit, defaultValues = INITIAL_FORM_STATE }) => {
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const [selectedProject, setSelectedProject] = useState(null);

    const { data: projects, loading: projectsLoading, error: projectsError } = useFetchData(`/users/projects/${user.id}`);
    const { data: devices, loading: devicesLoading, error: devicesError } = useFetchData(
        selectedProject ? `/devices/raw/project/${selectedProject}?page=1&size=50` : null
    );

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(externalSensorSchema),
        defaultValues,
        mode: 'onChange'
    });

    useEffect(() => {
        if (projects?.length > 0 && !selectedProject) {
            setSelectedProject(projects[0].id);
        }
    }, [projects]);

    useEffect(() => {
        reset((formValues) => ({
            ...formValues,
            device_id: ''
        }));
    }, [selectedProject, reset]);

    const handleProjectChange = (e) => {
        const newProjectId = e.target.value ? Number(e.target.value) : null;
        setSelectedProject(newProjectId);
    };

    const onFormSubmit = (data) => {
        onSubmit({
            ...data,
            project_id: selectedProject,
            device_id: Number(data.device_id)
        });
    };

    return (
        <Box boxSize={['90%', '100%']} mr={10} p={4}>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <FormControl mb={4}>
                    <FormLabel color="gray.300">{language === 'en' ? 'Project:' : 'Proje:'}</FormLabel>
                    {projectsLoading ? (
                        <Spinner color="lime" />
                    ) : projectsError ? (
                        <Text color="red.500">{language === 'en' ? 'Error loading projects' : 'Projeler yüklenirken hata oluştu'}</Text>
                    ) : (
                        <Select
                            color="lime"
                            focusBorderColor="lime"
                            value={selectedProject || ''}
                            onChange={handleProjectChange}
                        >
                            <option value="">{language === 'en' ? 'Select a project' : 'Bir proje seçiniz'}</option>
                            {projects?.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </Select>
                    )}
                </FormControl>

                <FormControl mb={4} isInvalid={!!errors.device_id}>
                    <FormLabel color="gray.300">{language === 'en' ? 'Device:' : 'Cihaz:'}</FormLabel>
                    <Controller
                        name="device_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                color="lime"
                                focusBorderColor="lime"
                                isDisabled={!selectedProject}
                                value={field.value || ''}
                            >
                                <option value="">{language === 'en' ? 'Select a device' : 'Bir cihaz seçiniz'}</option>
                                {devices?.devices?.map((device) => (
                                    <option key={device.id} value={device.id}>
                                        {device.name}
                                    </option>
                                ))}
                            </Select>
                        )}
                    />
                    {errors.device_id && <Text color="red.500">{errors.device_id.message}</Text>}
                </FormControl>

                <FormControl mb={4} isInvalid={!!errors.name}>
                    <FormLabel color="gray.300">{language === 'en' ? 'Name:' : 'Adı:'}</FormLabel>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder={language === 'en' ? 'Sensor name' : 'Sensör adı'}
                                color="lime"
                                focusBorderColor="lime"
                                _placeholder={{opacity: 0.4, color: 'inherit'}}
                            />
                        )}
                    />
                    {errors.name && <Text color="red.500">{errors.name.message}</Text>}
                </FormControl>

                <FormControl mb={4} isInvalid={!!errors.value}>
                    <FormLabel color="gray.300">{language === 'en' ? 'Value:' : 'Değer:'}</FormLabel>
                    <Controller
                        name="value"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                placeholder={language === 'en' ? 'Enter sensor value' : 'Sensör değerini giriniz'}
                                color="lime"
                                focusBorderColor="lime"
                                _placeholder={{opacity: 0.4, color: 'inherit'}}
                            />
                        )}
                    />
                    {errors.value && <Text color="red.500">{errors.value.message}</Text>}
                </FormControl>

                <FormControl mb={4} isInvalid={!!errors.units_of_measure}>
                    <FormLabel color="gray.300">{language === 'en' ? 'Units of Measure:' : 'Ölçü Birimi:'}</FormLabel>
                    <Controller
                        name="units_of_measure"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder={language === 'en' ? 'e.g., Celsius, RPM' : 'örn. Celsius, RPM'}
                                color="lime"
                                focusBorderColor="lime"
                                _placeholder={{opacity: 0.4, color: 'inherit'}}
                            />
                        )}
                    />
                    {errors.units_of_measure && <Text color="red.500">{errors.units_of_measure.message}</Text>}
                </FormControl>

                <FormControl mb={4} isInvalid={!!errors.description}>
                    <FormLabel color="gray.300">{language === 'en' ? 'Description:' : 'Açıklama:'}</FormLabel>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder={language === 'en' ? 'Enter description' : 'Açıklama giriniz'}
                                color="lime"
                                focusBorderColor="lime"
                                _placeholder={{opacity: 0.4, color: 'inherit'}}
                            />
                        )}
                    />
                    {errors.description && <Text color="red.500">{errors.description.message}</Text>}
                </FormControl>

                <FormControl mb={4} isInvalid={!!errors.location}>
                    <FormLabel color="gray.300">{language === 'en' ? 'Location:' : 'Konum:'}</FormLabel>
                    <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder={language === 'en' ? 'Enter location' : 'Konumu giriniz'}
                                color="lime"
                                focusBorderColor="lime"
                                _placeholder={{opacity: 0.4, color: 'inherit'}}
                            />
                        )}
                    />
                    {errors.location && <Text color="red.500">{errors.location.message}</Text>}
                </FormControl>

                <GlowingGreenNeonButton type="submit">
                    {language === 'en' ? 'Save' : 'Kaydet'}
                </GlowingGreenNeonButton>
            </form>
        </Box>
    );
};

export default ExternalSensorCreateForm;
