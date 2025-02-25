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

// Schema güncellemesi: is_out_of_order alanında transform ekleniyor
const schema = yup.object().shape({
    name: yup.string().min(3, "Name must be at least 3 characters long"),
    circuit_type: yup.string().oneOf(['sealed', 'switch']).default('sealed'),
    state: yup.number().min(0).max(1).required(),
    is_out_of_order: yup.boolean().default(false).transform((value, originalValue) => {
        if (originalValue === "true") return true;
        if (originalValue === "false") return false;
        return value;
    }),
    project_id: yup.number().positive().required(),
});

const ActuatorCreateForm = ({ onSubmit, defaultValues }) => {
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
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Name:' : 'Adı:'}</FormLabel>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => <Input color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please enter your actuator name.' : 'Aktüatör adınızı giriniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text as={'b'} color="red.500">{errors.name?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Circuit Type:' : 'Devre Tipi:'}</FormLabel>
                    <Controller
                        name="circuit_type"
                        control={control}
                        render={({ field }) => (
                            <Select textAlign={'center'} color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please select your circuit type.' : 'Devre tipinizi seçiniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field}>
                                <option value="sealed">Sealed</option>
                                <option value="switch">Switch</option>
                            </Select>
                        )}
                    />
                    <Text as={'b'} color="red.500">{errors.circuit_type?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'State:' : 'Durum:'}</FormLabel>
                    <Controller
                        name="state"
                        control={control}
                        render={({ field }) => <Input type="number" color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please enter the state of the actuator.' : 'Aktüatörün durumunu giriniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text as={'b'} color="red.500">{errors.state?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Is Out of Order:' : 'Arızalı Durumu:'}</FormLabel>
                    <Controller
                        name="is_out_of_order"
                        control={control}
                        render={({ field }) => (
                            <Select textAlign={'center'} color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please select if the actuator is out of order.' : 'Aktüatörün arızalı olup olmadığını seçiniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field}>
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </Select>
                        )}
                    />
                    <Text as={'b'} color="red.500">{errors.is_out_of_order?.message}</Text>
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Project:' : 'Proje:'}</FormLabel>
                    <Controller
                        name="project_id"
                        control={control}
                        render={({ field }) => (
                            <Select textAlign={'center'} color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please select your project.' : 'Projenizi seçiniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field}>
                                {projects && projects.map((project, index) => (
                                    <option key={index} value={project.id}>
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

export default ActuatorCreateForm;