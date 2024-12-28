"use client";

import { useContext, useState, useEffect } from "react";
import UserContext from "@/contexts/user-context";
import {useLanguage} from "@/contexts/language-context";
import { Box, VStack, Image, Text, FormControl, FormLabel, Input, Button, Stack, Heading, HStack } from "@chakra-ui/react";
import LanguageDropdown from "@/components/language-dropdown.component";
import Cookies from 'js-cookie';
import PasswordInput from "@/components/password-input.component";
import CookieConsent from "@/components/cookie-consent-banner.component";



const GlowingNeonButton = ({ children, ...props }) => {
    return (
        <Button
            {...props}
            bgGradient="linear(to-r, green.400, green.700)"
            color="purple.900"
            _hover={{
                bgGradient: "linear(to-r, green.500, green.600)",
                boxShadow: "0 0 40px rgba(0, 255, 0, 0.7)",
            }}
            _active={{
                bgGradient: "linear(to-r, green.500, green.600)",
                boxShadow: "0 0 40px rgba(0, 255, 0, 0.7)",
            }}
            boxShadow="0 0 40px rgba(0, 255, 0, 0.2)"
        >
            {children}
        </Button>
    );
};



const LoginPage = () => {
    const { login } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { language, changeLanguage, availableLanguages } = useLanguage();

    useEffect(() => {
        if (Cookies.get('cookiesAccepted')) {
        //getGeolocation();
        changeLanguage(Cookies.get('language') || 'tr');
        // @TODO : dump the data into a file or database.
        }
    }, [changeLanguage]);

    const handleAcceptCookies = () => {
        Cookies.set('cookiesAccepted', 'true', { expires: 7 });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        login(username, password);
    }

    return (
         
            <VStack spacing={[8]}  w='full'>
            {!Cookies.get('cookiesAccepted')  && (<CookieConsent onAccept={handleAcceptCookies} />)}
                <HStack w={['full', 'sm']} >
                    <LanguageDropdown/>
                </HStack>
                <Image boxSize={'300'} src="/icons/icon-192x192.png" alt="PulseFlow Logo" />
                <Heading>{language == 'en' ? 'Welcome to Pulse Flow!' : "Pulse Flow I/O"}</Heading>
                <form  onSubmit={handleLogin}>
                    <Stack  w='full' spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>
                                <Text as='b'>
                                    {language == 'en' ? 'Username: ' : 'Kullanıcı Adı: '}
                                </Text>
                            </FormLabel>
                            <Input rounded='md' variant='filled' type="text" name="username" required placeholder="Kullanıcı Adı" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </FormControl>
                        <PasswordInput label={language == 'en' ? 'Password' : 'Şifre'} placeholder="Şifre" name={'password'} value={password} onChange={(e) => setPassword(e.target.value)}/>
                        {/* <Button type="submit">{language == 'en' ? 'Sign-in' : 'Giriş'}</Button> */}
                        <GlowingNeonButton type="submit">
                            {language == 'en' ? 'Sign-in' : 'Giriş'}
                        </GlowingNeonButton>
                    </Stack>
                </form>
            </VStack>
      
    );
}

export default LoginPage;