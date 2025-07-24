"use client";

import React, { useState, useEffect, useContext } from 'react';
import UserContext from '@/contexts/user-context';
import { useLanguage } from '@/contexts/language-context';

import useFetchData from '@/hooks/useFetchData';
import useCreateData from '@/hooks/useCreateData';
import useUpdateData from '@/hooks/useUpdateData';
import useDeleteData from '@/hooks/useDeleteData';

import { Button, Flex, Text, useToast, Spinner, SkeletonText, Box, Select } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import CustomTabs from '@/components/CustomTabs';

import SubscriptionComponent from '@/components/notification-settings/subscription.component';
import ChangePasswordForm from '@/forms/change-password.form';
import ProfileComponent from '@/components/profile.component';

const ProfilePage = () => {

    const router = useRouter();
    const handleProceedNotification = () => {
        router.push('/dashboard/notification-manager');
    };
    const {language} = useLanguage();

    const tabs = [
        { label: language === 'en' ? "Profile" : "Profil Bilgileri", content: <ProfileComponent />},
        { label: language === 'en' ? "Change Password" : "Şifre Değiştirme", content: <ChangePasswordForm /> },
        { label: language === 'en' ? "Notification Settings" : "Bildirim Ayarları", content: <SubscriptionComponent /> },
    ];

    return (
        <Box p={4} border={"1px"}>
            <CustomTabs tabs={tabs} />

            {/* <Button colorScheme="teal">Edit Profile</Button>
            <Button onClick={handleProceedNotification}>Manage Notifications</Button> */}
        </Box>
    );
};

export default ProfilePage;