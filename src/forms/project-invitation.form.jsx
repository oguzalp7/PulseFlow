"use client";

import React, {useState, useEffect, useContext} from 'react'
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, FormControl, FormLabel, HStack, Input, Select, Text, Stack } from '@chakra-ui/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useFetchData from '@/hooks/useFetchData';
import UserContext from '@/contexts/user-context';
import { useLanguage } from '@/contexts/language-context';
import GlowingGreenNeonButton from '@/components/glowing-neon-green-button.component';
import { optionStyle } from '@/utils';


const schema = yup.object().shape({
    email: yup.string().email('Invalid email address').required('Email is required'),
    role_id: yup.number().positive().required()
});

const ProjectInvitationForm = ({
    onSubmit, 
    defaultValues, 
    projects, 
    selectedProject
}) => {
    const { user } = useContext(UserContext);
    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });
    const {language} = useLanguage();
    
    if(!selectedProject){
        selectedProject = null;
    }

    const { data: roles, loading: rolesLoading, error: rolesError, setData: setRoles, refetch } = useFetchData(`/roles/`);


        
    return (
        <Box boxSize={['90%', '100%']} mr={10} p={4} alignContent={'center'}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Email: ' : 'Email: '}</FormLabel>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => <Input color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'example@domain.com' : 'ornek@organizasyon.com '} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text as={'b'} color="red.500">{errors.name?.message}</Text>
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Role:' : 'Kullanıcı Rolü:'}</FormLabel>
                    <Controller
                        name="role_id"
                        control={control}
                        render={({ field }) => (
                            <Select textAlign={'center'} color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please select role to assign.' : 'Atanacak rolü seçiniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field}>
                                {roles && roles.map((role, index) => (
                                    <option style={optionStyle} key={index} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </Select>
                        )}
                    />
                    <Text as={'b'} color="red.500">{errors.project_id?.message}</Text>
                </FormControl>
                
                <GlowingGreenNeonButton type="submit">{language === 'en' ? 'Save' : 'Kaydet'}</GlowingGreenNeonButton>
            </form>
            <br/>
            <Box border={'1px'} p={4}>
                {roles && roles.map((role, index) => (
                    <Stack key={role.id || index}>
                        <Text color={'white'} as={'u'}>{role.name}: </Text>
                        <Text color={'white'}>{role.description}</Text>
                        <br/>
                    </Stack>
                ))}
            </Box>
        </Box>
    )
}

export default ProjectInvitationForm