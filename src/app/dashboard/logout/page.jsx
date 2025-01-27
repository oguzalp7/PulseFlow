"use client";

import { useContext, useState, useEffect } from "react";
import ProtectedRoute from "@/components/protected-route.component";
import UserContext from "@/contexts/user-context";
import { useLanguage } from "@/contexts/language-context";
import {Text, Stack} from "@chakra-ui/react";
import GlowingNeonRedButton from "@/components/glowing-neon-red-button.component";

const DashboardLogoutPage = () => {
    const { logout } = useContext(UserContext);
    const { language } = useLanguage();

    

    return (
        <ProtectedRoute>
            <Stack
                direction='column'
                spacing={4}
                align='center'
                // justify='center'
                h='100%'
                minH='50vh'
                p={4}

            >
                <Text color='gray.300'>{language == 'en' ? "Are you sure to logout?" : "Çıkmak istediğinize emin misiniz?"}</Text>
                <GlowingNeonRedButton onClick={logout}>{language === 'en' ? 'Sign-out': 'Çıkış'}</GlowingNeonRedButton>
            </Stack>
        </ProtectedRoute>
    );
}

export default DashboardLogoutPage;