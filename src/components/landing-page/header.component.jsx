"use client"

import { Text, Button, useToast, Box, HStack, Image, Stack, Heading } from "@chakra-ui/react";
import { useState, useEffect } from 'react';

import GlowingGreenNeonButton from "@/components/glowing-neon-green-button.component";
import LanguageDropdown from "@/components/language-dropdown.component";
import {useLanguage} from "@/contexts/language-context";

import {useRouter} from 'next/navigation';
import CookieConsent from "@/components/cookie-consent-banner.component";
import Cookies from 'js-cookie';

const LandingPageHeader = () => {
    const { language, changeLanguage, availableLanguages } = useLanguage();
    const router = useRouter();
    const handleSignIn = () => {
        router.push('/login');
    };

    const handleRegister = () => {
        router.push('/register');
    }

    const handleAcceptCookies = () => {
          Cookies.set('cookiesAccepted', 'true', { expires: 7 });
    };

    useEffect(() => {
        if (Cookies.get('cookiesAccepted')) {
        //getGeolocation();
        changeLanguage(Cookies.get('language') || 'tr');
        // @TODO : dump the data into a file or database.
        }
    }, [changeLanguage]);

  


    return (
        <Box w="100%" display="flex" justifyContent="space-between" alignItems="center" p={4}>
            <HStack align="center" spacing={4}>
                <Image 
                    boxSize={['60px', '80px', '90px', '120px']}
                    objectFit='cover'
                    src="/icons/icon-transparent-512x512.png"
                    onClick={() => window.location.href = '/'}
                    cursor="pointer"
                />
                <Stack display={['flex', 'flex', 'flex']} direction={'column'} spacing={1}>
                    <Heading
                    mt={4}
                    color='gray.300'
                    onClick={() => window.location.href = '/'}
                    cursor="pointer"
                    >
                    Pulse Flow
                    </Heading>
                    <Text
                    ml={0}
                    color={'green'}
                    onClick={() => window.location.href = '/'}
                    cursor="pointer"
                    >
                    /* Powered By La Vittoria AI */
                    </Text>
                </Stack>
            </HStack>
            {!Cookies.get('cookiesAccepted') && (
                <CookieConsent onAccept={handleAcceptCookies} />
            )}
            <HStack spacing={4} align="center">
                {/* {!Cookies.get('cookiesAccepted') && (
                    <CookieConsent onAccept={handleAcceptCookies} />
                )} */}
                <GlowingGreenNeonButton onClick={handleSignIn}>
                    {language === 'en' ? 'Sign-in' : 'Giriş'}
                </GlowingGreenNeonButton>
                <GlowingGreenNeonButton onClick={handleRegister}>
                    {language === 'en' ? 'Register' : 'Kayıt Ol'}
                </GlowingGreenNeonButton>
                <LanguageDropdown />
            </HStack>
        </Box>
    );

}

export default LandingPageHeader;