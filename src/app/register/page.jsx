"use client";

import React, {useState} from 'react';

import { Box, Heading, Text, Button, HStack, Flex, Image, useToast, FormControl, FormLabel, Input, VStack, Textarea, IconButton, Spinner } from '@chakra-ui/react';
import {useLanguage} from "@/contexts/language-context";
import LanguageDropdown from '@/components/language-dropdown.component';
import PasswordInput from "@/components/password-input.component";
import { useRouter } from 'next/navigation';
import { ArrowBackIcon } from '@chakra-ui/icons';

import useCreateData from '@/hooks/useCreateData';
import { pfClient } from '@/pulseflowApiClient';

const RegisterPage = () => {
    const {language} = useLanguage();
    const toast = useToast();
    const router = useRouter();

    // const [data, loading, error, createData] = useCreateData('/users/');

    const [creds, setCreds] = useState({
        name: '',
        username: '',
        is_active: true,
        auth_id: 2,
        email: '',
        contact: '+90',
        address: '',
        preferred_language: language,
        password: '',
    });

    const handleRegister = async (e) => {
        e.preventDefault();
        
        const headers = "Content-Type: application/json";
        try {
            const response = await pfClient.post('/users/standard/', creds, headers);
            toast({
                title: language === 'en' ? 'Welcome to Pulse Flow' : "Pulse Flow'a hoşgeldiniz.",
                description: language === 'en' ? 'You will be redirected to login page.' : 'Giriş sayfasına yönlendiriliyorsunuz.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setTimeout(() => { 
                router.push('/login');
            }, 5000);
        } catch (error) {
            console.log(error);
                toast({
                    title: language === 'en' ? 'Error registering user.' : 'Kullanıcı kaydı sırasında hata oluştu.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
        }
        // createData(creds);
        //     // if(loading) {
        //     //    return <Spinner color='green' /> 
        //     // }
        // if (!error) {
        
            
        // } else {
        //     console.log(error);
        
        // }
            
        
        
    }
    console.log(creds);
    return (
        <Flex direction="column" align="center" justify="center" h="full" >
            <Box align='center' p={4}   bg="transparent" w={['100%', '80%', '60%', '25%']} borderRadius="lg" border={['none', "1px solid"]} borderColor={['none', 'gray.300']}>
                <HStack>
                    <IconButton size={'lg'} color={'gray.300'} colorScheme='gray.900' variant={'ghost'} icon={<ArrowBackIcon />} onClick={() => router.push("/")} />
                    <LanguageDropdown />
                </HStack>
                
                <br />
                <Image boxSize={['200px', '300px']} src="/icons/icon-transparent-192x192.png" alt="PulseFlow Logo" />
                <Heading color='gray.300' as="h1" size="lg" textAlign="center" mt={4}>{language === 'en' ? 'Register' : 'Kayıt Ol'}</Heading>
                <Text color='gray.300' textAlign="center" mt={4}>{language === 'en' ? 'Please fill in the form below to register.' : 'Lütfen kayıt olmak için aşağıdaki formu doldurun.'}</Text>
                <Text color='gray.300' textAlign="center" mt={4}>{language === 'en' ? 'Language preference will be selected from above.' : 'Dil seçimini yukarıdan değiştirebilirsiniz.'}</Text>
                <form onSubmit={handleRegister}>
                    {/* <Box mt={4}>
                        <PasswordInput label={language === 'en' ? 'Password' : 'Şifre'} />
                    </Box>
                    <Box mt={4}>
                        <PasswordInput label={language === 'en' ? 'Confirm Password' : 'Şifreyi Onayla'} />
                    </Box> */}
                    <VStack spacing={4} mt={4} w='100%'>
                        <FormControl isRequired>
                            <FormLabel>
                                <Text as='b' color='gray.300'>
                                    {language == 'en' ? 'Name: ' : 'Ad-Soyad: '}
                                </Text>
                            </FormLabel>
                            <Input bgColor='transparent' color='gray.300'  type="text" required
                                name={creds.name}
                                placeholder={language === 'en' ? 'Type your full name here.' : 'Tam adınızı giriniz.'}
                                value={creds.name} 
                                onChange={(e) => setCreds({ ...creds, name: e.target.value })}
                            />
                        </FormControl>
                        
                        <FormControl isRequired>
                            <FormLabel>
                                <Text as='b' color='gray.300'>
                                    {language == 'en' ? 'Username: ' : 'Kullanıcı Adı: '}
                                </Text>
                            </FormLabel>
                            <Input bgColor='transparent' color='gray.300'  type="text" required
                                name={creds.username}
                                placeholder={language === 'en' ? 'Type your username here.' : 'Kullanıcı adınızı giriniz.'}
                                value={creds.username} 
                                onChange={(e) => setCreds({ ...creds, username: e.target.value })}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>
                                <Text as='b' color='gray.300'>
                                    {language == 'en' ? 'Email: ' : 'E-posta: '}
                                </Text>
                            </FormLabel>
                            <Input bgColor='transparent' color='gray.300'  type="email" required
                                name={creds.email}
                                placeholder={language === 'en' ? 'Type your email here.' : 'E-posta adresinizi giriniz.'}
                                value={creds.email}
                                onChange={(e) => setCreds({ ...creds, email: e.target.value })}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            {/* <FormLabel>
                                <Text as='b' color='gray.300'>
                                    {language == 'en' ? 'Password' : 'Şifre:'}
                                </Text>
                            </FormLabel> */}
                            <PasswordInput 
                                name={creds.password}
                                value={creds.password}
                                label={language == 'en' ? 'Password' : 'Şifre'}
                                placeholder={language === 'en' ? 'Type your password here.' : 'Şifrenizi giriniz.'}
                                onChange={(e) => setCreds({ ...creds, password: e.target.value })}
                            />      
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>
                                <Text as='b' color='gray.300'>
                                    {language == 'en' ? 'Phone: ' : 'Telefon: '}
                                </Text>
                            </FormLabel>
                            <Input bgColor='transparent' color='gray.300'  type="tel" required
                                name={creds.contact}
                                placeholder={language === 'en' ? 'Type your phone number here.' : 'Telefon numaranızı giriniz.'}
                                value={creds.contact}
                                onChange={(e) => setCreds({ ...creds, contact: e.target.value })}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>
                                <Text as='b' color='gray.300'>
                                    {language == 'en' ? 'Address: ' : 'Adres: '}
                                </Text>
                            </FormLabel>
                            <Textarea bgColor='transparent' color='gray.300'  type="text" required
                                name={creds.address}
                                placeholder={language === 'en' ? 'Type your address here.' : 'Adresinizi giriniz.'}
                                value={creds.address}
                                onChange={(e) => setCreds({ ...creds, address: e.target.value })}
                            />
                        </FormControl>

                        <Button mt={4} colorScheme="green" type="submit" w="100%">{language === 'en' ? 'Register' : 'Kayıt Ol'}</Button>
                    </VStack>
                </form>
            </Box>
        </Flex>
    );
};

export default RegisterPage;