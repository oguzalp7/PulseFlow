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
import { optionStyle } from '@/utils';

const schema = yup.object().shape({
    name: yup.string().min(3, "Relay name must be at least 3 characters long.").required("Relay name required. / Röle adı zorunludur."),
    device_id: yup.number().positive("Device ID must be positive.").required("Device is required. / Cihaz zorunludur."),
    gpio_type: yup.string().oneOf(['builtin', 'pcf8574']).default('builtin'),
    gpio: yup.number().required("GPIO number is required."),
    pcf8574_address: yup.string().default(''),
    state: yup.number().default(0),
    relay_type: yup.string().oneOf(['start', 'stop', 'toggle']).default('toggle'),
    output_id: yup.number().positive("Output ID must be positive.").required("Output ID is required.")
});

const RelayCreateForm = ({ onSubmit, defaultValues }) => {
    const { user } = useContext(UserContext);
    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });

    const { language } = useLanguage();

    const { data: projects, loading: projectsLoading, error: projectsError, setData: setProjects, refetch: refetchProjects } = useFetchData(`/users/projects/${user.id}`);
    const [selectedProject, setSelectedProject] = useState(projects && projects.length > 0 ? projects[0].id : null);

    const {data: devices, loading: devicesLoading, error: devicesError, setData: setDevices, refetch: refetchDevices} = useFetchData(`/devices/raw/project/${selectedProject}?page=${1}&size=${50}`);
    const [selectedDevice, setSelectedDevice] = useState(devices && devices.length > 0 ? devices[0].id : null);

    const {data: actuators, loading: actuatorsLoading, error: actuatorsError, setData: setActuators, refetch: refetchActuators} = useFetchData(`/outputs/raw/project/${selectedProject}?page=${1}&size=${50}&outOfOrder=false`); // outOfOrder=true is added to the URL to get actuators in the order they are created.
    const [selectedActuator, setSelectedActuator] = useState(actuators && actuators.length > 0 ? actuators[0].id : null);

    useEffect(() => {
        refetchDevices();
        refetchActuators();
    }, [selectedProject]);


    return(
        <Box boxSize={['90%', '100%']} mr={10} p={4}>
            
            {projectsLoading && (
                <Flex align='center' justify='center' direction='column'>
                    <Spinner size="xl" color="green.500" />
                    <Skeleton height="20px"/>
                </Flex>
            )}
            {projects && !projectsLoading && (
                <Select color={'green'} backgroundColor={'rgba(127, 127, 127, 0.2)'} textAlign={'center'} placeholder={language === 'en' ? 'Select Project.' : 'Proje Seçiniz.'} onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject}>
                    {projects && projects.map((project, index) => (
                        <option style={optionStyle} key={index} value={project.id}>
                            {project.name}
                        </option>
                    ))}
                </Select>
            )}
            <br />
            <form onSubmit={handleSubmit(onSubmit)}>
                

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Device:' : 'Cihaz:'}</FormLabel>
                    <Controller
                        name="device_id"
                        control={control}
                        render={({ field }) => (
                            <Select textAlign={'center'} color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please select your device.' : 'Cihaz seçimi yapınız.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field}>
                                {devices && devices.devices.map((devices, index) => (
                                    <option style={optionStyle} key={index} value={devices.id}>
                                        {devices.name}
                                    </option>
                                ))}
                            </Select>
                        )}
                    />
                    <Text as={'b'} color="red.500">{errors.project_id?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Relay Name:' : 'Röle Adı:'}</FormLabel>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => <Input color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please enter your device name.' : 'Cihaz adınızı giriniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text as={'b'} color="red.500">{errors.name?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'GPIO Type:' : 'GPIO Tipi:'}</FormLabel>
                    <Controller
                        name="gpio_type"
                        control={control}
                        render={({ field }) => (
                            <Select textAlign={'center'} color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please select GPIO type.' : 'GPIO tipini seçiniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field}>
                                <option style={optionStyle} value="builtin">Builtin</option>
                                <option style={optionStyle} value="pcf8574">PCF8574</option>
                            </Select>
                        )}
                    />
                    <Text as={'b'} color="red.500">{errors.gpio_type?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'GPIO:' : 'GPIO:'}</FormLabel>
                    <Controller
                        name="gpio"
                        control={control}
                        render={({ field }) => <Input color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please enter GPIO number.' : 'GPIO numarasını giriniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text as={'b'} color="red.500">{errors.gpio?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'PCF8574 Address:' : 'PCF8574 Adresi:'}</FormLabel>
                    <Controller
                        name="pcf8574_address"
                        control={control}
                        render={({ field }) => <Input color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please enter PCF8574 address.' : 'PCF8574 adresini giriniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text as={'b'} color="red.500">{errors.pcf8574_address?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'State:' : 'Durum:'}</FormLabel>
                    <Controller
                        name="state"
                        control={control}
                        render={({ field }) => <Input color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please enter state.' : 'Durumu giriniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text as={'b'} color="red.500">{errors.state?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Relay Type:' : 'Röle Tipi:'}</FormLabel>
                    <Controller
                        name="relay_type"
                        control={control}
                        render={({ field }) => (
                            <Select textAlign={'center'} color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please select relay type.' : 'Röle tipini seçiniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field}>
                                <option style={optionStyle} value="start">Start</option>
                                <option style={optionStyle} value="stop">Stop</option>
                                <option style={optionStyle} value="toggle">Toggle</option>
                            </Select>
                        )}
                    />
                    <Text as={'b'} color="red.500">{errors.relay_type?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Actuator:' : 'Aktüatör:'}</FormLabel>
                    <Controller
                        name="output_id"
                        control={control}
                        render={({ field }) => (
                            <Select textAlign={'center'} color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please select output.' : 'Çıkışı seçiniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} value={selectedActuator} onChange={(e) => setSelectedActuator(e.target.value)} {...field}>
                                {actuators && actuators.outputs && actuators.outputs.map((actuator, index) => (
                                    <option style={optionStyle} key={index} value={actuator.id}>
                                        {actuator.name}
                                    </option>
                                ))}
                            </Select>

                        )}
                    />
                    <Text as={'b'} color="red.500">{errors.output_id?.message}</Text>
                </FormControl>

                <GlowingGreenNeonButton type="submit">{language === 'en' ? 'Save' : 'Kaydet'}</GlowingGreenNeonButton>

            </form>
        </Box>
    );
}

export default RelayCreateForm;