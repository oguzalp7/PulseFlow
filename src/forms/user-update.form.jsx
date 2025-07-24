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
    name: yup.string().required(),
    username: yup.string().required(),
    email: yup.string().email('Invalid email address').required('Email is required'),
    contact: yup.string().required(),
    address: yup.string().required()
});


const UserUpdateForm = ({ onSubmit, defaultValues }) => {
    const { user } = useContext(UserContext);
    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });
    const { language, changeLanguage, availableLanguages } = useLanguage();

    console.log(availableLanguages);

    return(
        <Box boxSize={['90%', '100%']} mr={10} p={4} alignContent={'center'}>
            <form onSubmit={handleSubmit(onSubmit)}>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'User Name: ' : 'Kullanıcı Adı: '}</FormLabel>
                    <Controller
                        name="username"
                        control={control}
                        render={({ field }) => <Input color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'johndoe' : 'johndoe'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text as={'b'} color="red.500">{errors.name?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Full Name: ' : 'Ad-Soyad: '}</FormLabel>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => <Input color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'John Doe' : 'John Doe'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text as={'b'} color="red.500">{errors.name?.message}</Text>
                </FormControl>

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
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Contact: ' : 'İletişim: '}</FormLabel>
                    <Controller
                        name="contact"
                        control={control}
                        render={({ field }) => <Input color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? '+90' : '+90'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text as={'b'} color="red.500">{errors.name?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Address: ' : 'Adres: '}</FormLabel>
                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => <Textarea color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? '+90' : '+90'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text as={'b'} color="red.500">{errors.name?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Preferred Language: ' : 'Varsayılan Dil: '}</FormLabel>
                    <Controller
                        name="preferred_language"
                        control={control}
                        render={({ field }) => (
                            <Select textAlign={'center'} color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please select role to assign.' : 'Atanacak rolü seçiniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field}>
                                {availableLanguages && availableLanguages.map((lang, index) => (
                                    <option style={optionStyle} key={index} value={lang.code}>
                                        {lang.name}
                                    </option>
                                ))}
                            </Select>
                        )}
                    />
                    <Text as={'b'} color="red.500">{errors.name?.message}</Text>
                </FormControl>

                <GlowingGreenNeonButton type="submit">{language === 'en' ? 'Save' : 'Kaydet'}</GlowingGreenNeonButton>
            </form>
        </Box>
    );
}

export default UserUpdateForm;