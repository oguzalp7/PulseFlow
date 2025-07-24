"use client"

import React from 'react';

import { urlBase64ToUint8Array } from "@/utils";

import { useState, useEffect, useContext } from 'react';
import UserContext from '@/contexts/user-context';
import { Stack, useToast } from "@chakra-ui/react";
import { Box, Text, Heading, HStack } from '@chakra-ui/react';
import NeonToggleSwitch from '@/components/neon-switch.component';
import { useLanguage } from '@/contexts/language-context';

import useCreateData from '@/hooks/useCreateData';
import useDeleteData from '@/hooks/useDeleteData';


const SubscriptionComponent = () => {
    const { user } = useContext(UserContext);
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const toast = useToast();
    const [isOn, setIsOn] = useState(subscription ? true : false);
    const { language } = useLanguage();

    // Custom hooks for creating and deleting data
    const { createData: subscribeUser } = useCreateData('/subscriptions/');
    const { deleteData: unsubscribeUser } = useDeleteData('/subscribe');

    // Update isOn when subscription changes
    useEffect(() => {
        setIsOn(!!subscription);
    }, [subscription]);

    useEffect(() => {
        if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("/sw.js").then(
            (registration) => {
                console.log("Service Worker registered with scope:", registration.scope);
                toast({
                    title: "Service Worker registered",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                })
            },
            (error) => {
                console.log("Service Worker registration failed:", error);
                toast({
                    title: "Service Worker registration failed",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }
            );
        });
        }
    }, []);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
        setIsSupported(true);
        navigator.serviceWorker.ready.then(registration => {
            registration.pushManager.getSubscription().then(sub => {
            console.log('Existing subscription:', sub);
            setSubscription(sub);
            });
        });
        }
    }, []);

    useEffect(() => {
        if (subscription) {
            console.log('Current subscription:', subscription);
        } else {
            console.log('No active subscription');
        }
    }, [subscription]);

    const handleSubscribe = async () => {
        if (!isSupported) return;

        toast({
            title: "Subscribing...",
            status: "info",
            duration: 3000,
            isClosable: true,
        })

        const registration = await navigator.serviceWorker.ready;
        toast({
            title: "Service Worker ready",
            // description: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            status: "info",
            duration: 5000,
            isClosable: true,
        })
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
        });
        console.log('New subscription:', JSON.stringify(subscription));
        console.log('p256dh subscription:', subscription.getKey('p256dh'));
        console.log('auth subscription:', subscription.getKey('auth'));
        console.log('p256dh:', subscription.getKey('p256dh') ? btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))) : null);
        console.log('auth:', subscription.getKey('auth') ? btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')))) : null);
        setSubscription(subscription);
        await subscribeUser({
            endpoint: subscription.endpoint,
            keys: {
                p256dh: subscription.getKey('p256dh') ? btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))) : null,
                auth: subscription.getKey('auth') ? btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')))) : null,
            },
            user_id: user.id, // Assuming user.id is available
        });
    };

    const handleUnsubscribe = async () => {
        if (!subscription) return;

        await subscription.unsubscribe();
        console.log('Unsubscribed:', subscription);
        setSubscription(null);
        // await unsubscribeUser();
    };


    const handleToggle = async () => {
        if (subscription) {
            await handleUnsubscribe();
        } else {
            await handleSubscribe();
        }
    };

    return(
        <Box
            p={4}
            borderWidth={1}
            borderRadius="md"
            boxShadow="md"
            alignContent="center"
            alignItems="center"
            display="flex"
            flexDirection="column"
        >
            <Heading fontSize="xl" color="white">
                {language === 'en' ? 'Notification Settings' : 'Bildirim Ayarları'}
            </Heading>
            <HStack>
                <Text color="white">
                    {language === 'en' ? 'Device Support: ' : 'Cihaz Desteği: '}
                </Text>
                <Text color={isSupported ? 'green.400' : 'red.400'}>
                    {isSupported
                        ? language === 'en'
                            ? 'Supported'
                            : 'Destekleniyor'
                        : language === 'en'
                        ? 'Not Supported'
                        : 'Desteklenmiyor'}
                </Text>
            </HStack>
            {/* <Text>Subscription: {JSON.stringify(subscription)}</Text> */}
            {isSupported ? (
                // <Box width="100%" display="flex" justifyContent="center" alignItems="center" mt={4}>
                    <HStack spacing={4} align="center" justify="center">
                        <Text color="white">
                            {language === 'en' ? 'Notifications: ' : 'Bildirimler: '}
                        </Text>
                        <NeonToggleSwitch isOn={isOn} toggleSwitch={handleToggle} outerWidth={["4em"]} outerHeight={["1.5em"]} innerHeight={["1.5em"]} innerWidth={["1.8em"]}/>
                    </HStack>
                // </Box>
            ) : (
                <Text color="red.400" textAlign="center">
                    {language === 'en'
                        ? 'Push notifications are not supported in this browser.'
                        : 'Bu tarayıcıda push bildirimleri desteklenmiyor.'}
                </Text>
            )}
        </Box>
    );
}

export default SubscriptionComponent;