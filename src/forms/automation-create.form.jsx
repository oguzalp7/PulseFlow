"use client";
import React, { useState, useEffect, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, FormControl, FormLabel, Input, Select, Text, Flex, Spinner, Skeleton } from '@chakra-ui/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useFetchData from '@/hooks/useFetchData';
import UserContext from '@/contexts/user-context';
import { useLanguage } from '@/contexts/language-context';
import FormInput from '@/components/form-input.component';
import FormSelect from '@/components/form-select.component';
import GlowingGreenNeonButton from '@/components/glowing-neon-green-button.component';

const schema = yup.object().shape({
    name: yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
    is_active: yup.boolean().default(true).required('Is Active is required'),
    automation_type: yup.mixed().oneOf(['time', 'sensor', 'time_and_sensor', 'external_event']).default('time').required('Automation type is required'),
    desired_state: yup.mixed().oneOf(['turn_on', 'turn_off', 'toggle']).default('turn_on').required('Desired state is required'),
    project_id: yup.number().positive('Project ID must be greater than 0').required('Project ID is required'),
    output_id: yup.number().positive('Output ID must be greater than 0').required('Output ID is required'),
});

const AutomationCreateForm = ({ onSubmit, defaultValues }) => {
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: defaultValues || {
            name: '',
            is_active: true,
            automation_type: 'time',
            desired_state: 'turn_on',
            project_id: '',
            output_id: '',
        }
    });

    const { data: projects, loading: projectsLoading, error: projectsError } = useFetchData(`/users/projects/${user.id}`);
    const [selectedProject, setSelectedProject] = useState(null);
    const { data: outputs, loading: outputsLoading, error: outputsError, refetch: refetchOutputs } = useFetchData(`/outputs/raw/project/${selectedProject}?page=1&size=50&outOfOrder=false`);

    useEffect(() => {
        if (selectedProject) {
            refetchOutputs();
        }
    }, [selectedProject, refetchOutputs]);

    useEffect(() => {
        if (projects && projects.length > 0) {
            setSelectedProject(projects[0].id);
        }
    }, [projects]);

    useEffect(() => {
        if (defaultValues) {
            Object.keys(defaultValues).forEach(key => {
                setValue(key, defaultValues[key]);
            });
        }
    }, [defaultValues, setValue]);

    return (
        <Box p={4} as="form" onSubmit={handleSubmit(onSubmit)}>
            <FormSelect
                name="project_id"
                control={control}
                errors={errors}
                label={`*${language === 'en' ? 'Project:' : 'Proje:'}`}
                placeholder={language === 'en' ? 'Select Project' : 'Proje Seçiniz.'}
                options={projects ? projects.map(project => ({ value: project.id, label: project.name })) : []}
                loading={projectsLoading}
                onChange={(e) => setSelectedProject(e.target.value)}
            />
            <FormSelect
                name="output_id"
                control={control}
                errors={errors}
                label={`*${language === 'en' ? 'Output:' : 'Çıkış:'}`}
                placeholder={language === 'en' ? 'Select Output' : 'Çıkış Seçiniz.'}
                options={outputs ? outputs.outputs.map(output => ({ value: output.id, label: output.name })) : []}
                loading={outputsLoading}
            />
            <FormSelect
                name="automation_type"
                control={control}
                errors={errors}
                label={`*${language === 'en' ? 'Automation Type:' : 'Otomasyon Tipi:'}`}
                placeholder={language === 'en' ? 'Select Automation Type' : 'Otomasyon Tipi Seçiniz.'}
                options={[
                    { value: 'time', label: language === 'en' ? 'Time' : 'Zaman' },
                    { value: 'sensor', label: language === 'en' ? 'Sensor' : 'Sensör' },
                    { value: 'time_and_sensor', label: language === 'en' ? 'Time and Sensor' : 'Zaman ve Sensör' },
                    { value: 'external_event', label: language === 'en' ? 'External Event' : 'Harici Olay' },
                ]}
                loading={false}
            />
            <FormSelect
                name="desired_state"
                control={control}
                errors={errors}
                label={`*${language === 'en' ? 'Desired State:' : 'İstenen Durum:'}`}
                placeholder={language === 'en' ? 'Select Desired State' : 'İstenen Durumu Seçiniz.'}
                options={[
                    { value: 'turn_on', label: language === 'en' ? 'Turn On' : 'Aç' },
                    { value: 'turn_off', label: language === 'en' ? 'Turn Off' : 'Kapat' },
                    { value: 'toggle', label: language === 'en' ? 'Toggle' : 'Değiştir' },
                ]}
                loading={false}
            />
            <FormInput
                name="name"
                control={control}
                errors={errors}
                label={`*${language === 'en' ? 'Name:' : 'İsim:'}`}
                placeholder={language === 'en' ? 'Enter Automation Name' : 'Otomasyon İsmini Giriniz.'}
            />
            <Controller
                name="is_active"
                control={control}
                render={({ field }) => <input type="hidden" {...field} />}
            />
            <GlowingGreenNeonButton type="submit">{language === 'en' ? 'Save' : 'Kaydet'}</GlowingGreenNeonButton>
        </Box>
    );
};

export default AutomationCreateForm;
