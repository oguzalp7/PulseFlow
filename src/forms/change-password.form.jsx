"use client";

import React, {useContext, useState, useEffect} from 'react';
import { Box, useToast, Button, FormControl, FormLabel, Input, Select, Text, Textarea, Stack, Flex, Spinner, Skeleton } from '@chakra-ui/react';
import { useLanguage } from '@/contexts/language-context';
import PasswordInput from '@/components/password-input.component';
import useUpdateData from '@/hooks/useUpdateData';
// const schema = yup.object().shape({
//     password: yup.string().min(6, "Min. 6 characters required.").required("Eski şifreniz zorunludur./ Existing password is required."),
//     new_password: yup.string().min(6, "Min. 6 characters required.").required("Eski şifreniz zorunludur./ Existing password is required.")
// });

const GlowingNeonButton = ({ children, ...props }) => {
    return (
        <Button
            {...props}
            bgGradient="linear(to-r, orange.400, orange.700)"
            color="gray.300"
            _hover={{
                bgGradient: "linear(to-r, orange.500, orange.600)",
                boxShadow: "0 0 40px rgba(255, 145, 0, 0.7)",
            }}
            _active={{
                bgGradient: "linear(to-r, orange.500, orange.600)",
                boxShadow: "0 0 40px rgba(255, 255, 0, 0.7)",
            }}
            boxShadow="0 0 40px rgba(255, 255, 0, 0.2)"
        >
            {children}
        </Button>
    );
};


const ChangePasswordForm = () => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { language } = useLanguage();
    const { data, loading, error, updateData } = useUpdateData('/users/password');
    const toast = useToast();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        await updateData(null, {
            password: password,
            new_password: newPassword
        })
        if (error) {
            
            toast({
                title: language === 'en' ? 'Error' : 'Hata',
                description: language === 'en' ? 'An error occurred while changing password.' : 'Şifre güncellenirken bir hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                title: language === 'en' ? 'Success' : 'Başarılı',
                description: language === 'en' ? 'Your password updated successfully.' : 'Şifreniz başarıyla güncellendi.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            
        }
        console.log(error)
    }

    return(
        <form  onSubmit={handleChangePassword}>
            <Stack w={'md'} spacing={5}  mr={10} p={4} >
                <PasswordInput label={language == 'en' ? 'Password' : 'Şifre'} placeholder="Şifre" name={'password'} value={password} onChange={(e) => setPassword(e.target.value)}/>
                <PasswordInput label={language == 'en' ? 'New Password' : 'Yeni Şifre'} placeholder="Yeni Şifre" name={'newPassword'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                <GlowingNeonButton type="submit">
                            {language == 'en' ? 'Change Password' : 'Şifre Değiştir'}
                </GlowingNeonButton>
            </Stack>
        </form>
    );
}

export default ChangePasswordForm;