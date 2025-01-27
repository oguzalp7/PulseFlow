"use client";

import React, {useContext, useState, useEffect} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, FormControl, FormLabel, Input, Select, Text, Textarea, Stack, Flex, Spinner, Skeleton } from '@chakra-ui/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useFetchData from '@/hooks/useFetchData';
import UserContext from '@/contexts/user-context';
import { useLanguage } from '@/contexts/language-context';
import GlowingGreenNeonButton from '@/components/glowing-neon-green-button.component';


const schema = yup.object().shape({
    name: yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
    value: yup.number().default(0.0).required('Value is required'),
    units_of_measure: yup.string().default('').required('Units of measure is required'),
    description: yup.string().default(''),
    sensor_type: yup.mixed().oneOf(['ammeter', 'voltmeter', 'pressure']).default('ammeter').required('Sensor type is required'),
    device_id: yup.number().positive('Device ID must be greater than 0').required('Device ID is required'),
    output_id: yup.number().positive('Output ID must be greater than 0').required('Output ID is required'),
});

const InternalSensorCreateForm = ({onSubmit, defaultValues}) => {
    const { user } = useContext(UserContext);
    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });

    const { language } = useLanguage();  

    const { data: projects, loading: projectsLoading, error: projectsError } = useFetchData(`/users/projects/${user.id}`);
    const [selectedProject, setSelectedProject] = useState(projects && projects.length > 0 ? projects[0].id : null);

    useEffect(() => {
        if(projects && projects.length > 0) {
            setSelectedProject(projects[0].id);
        }
    }, [projects]);

    const { data: devices, loading: devicesLoading, error: devicesError } = useFetchData(`/devices/raw/project/${selectedProject}?page=${1}&size=${50}`);
    //const [selectedDevice, setSelectedDevice] = useState(devices && devices.length > 0 ? devices[0].id : null);

    const { data: outputs, loading: outputsLoading, error: outputsError } = useFetchData(`/outputs/raw/project/${selectedProject}?page=${1}&size=${50}&outOfOrder=false`);
    //const [selectedOutput, setSelectedOutput] = useState(outputs && outputs.length > 0 ? outputs[0].id : null);

    return (
        <Box boxSize={['90%', '100%']}  mr={10} p={4}>
            <Text color={'gray.300'} fontWeight='bold' >{language === 'en' ? 'Project: ' : 'Proje: '}</Text>
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
            <br />

            <form onSubmit={handleSubmit(onSubmit)}>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Internal Sensor Name:' : 'Dahili Sensör Adı:'}</FormLabel>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => <Input color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please enter your device name.' : 'Cihaz adınızı giriniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text as={'b'} color="red.500">{errors.name?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Value:' : 'Değer:'}</FormLabel>
                    <Controller
                        name="value"
                        control={control}
                        render={({ field }) => <Input color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please enter the value.' : 'Değeri giriniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text as={'b'} color="red.500">{errors.value?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Units of Measure:' : 'Ölçüm Birimi:'}</FormLabel>
                    <Controller
                        name="units_of_measure"
                        control={control}
                        render={({ field }) => <Input color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please enter the units of measure.' : 'Ölçüm birimini giriniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text as={'b'} color="red.500">{errors.units_of_measure?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Description:' : 'Açıklama:'}</FormLabel>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => <Textarea color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please enter a description.' : 'Açıklama giriniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text as={'b'} color="red.500">{errors.description?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Sensor Type:' : 'Sensör Tipi:'}</FormLabel>
                    <Controller
                        name="sensor_type"
                        control={control}
                        render={({ field }) => <Select color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Select Sensor Type.' : 'Sensör Tipi Seçiniz.'} {...field}>
                            <option value="ammeter">{language === 'en' ? 'Ammeter' : 'Ampermetre'}</option>
                            <option value="voltmeter">{language === 'en' ? 'Voltmeter' : 'Voltmetre'}</option>
                            <option value="pressure">{language === 'en' ? 'Pressure' : 'Basınç'}</option>
                        </Select>}
                    />
                    <Text as={'b'} color="red.500">{errors.sensor_type?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Device:' : 'Cihaz:'}</FormLabel>
                    <Controller
                        name="device_id"
                        control={control}
                        render={({ field }) => <Select color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Select Device' : 'Cihaz Seçiniz.'} {...field}>
                            {devices && devices.devices.map((device, index) => (
                                <option key={index} value={device.id}>
                                    {device.name}
                                </option>
                            ))}
                        </Select>}
                    />
                    <Text as={'b'} color="red.500">{errors.device_id?.message}</Text>

                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Actuator:' : 'Aktüatör:'}</FormLabel>
                    <Controller
                        name="output_id"
                        control={control}
                        render={({ field }) => <Select color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Select Output.' : 'Çıkış Seçiniz.'} {...field}>
                            {outputs && outputs.outputs.map((output, index) => (
                                <option key={index} value={output.id}>
                                    {output.name}
                                </option>
                            ))}
                        </Select>}
                    />
                    <Text as={'b'} color="red.500">{errors.output_id?.message}</Text>
                </FormControl>



                <GlowingGreenNeonButton type="submit">{language === 'en' ? 'Save' : 'Kaydet'}</GlowingGreenNeonButton>
            </form>
        </Box>
    );

};

export default InternalSensorCreateForm;