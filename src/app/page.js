"use client"

import { Text, Button, useToast, Box, HStack } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import { subscribeUser, unsubscribeUser, sendNotification } from './actions';

import GlowingGreenNeonButton from "@/components/glowing-neon-green-button.component";
import LanguageDropdown from "@/components/language-dropdown.component";
import {useLanguage} from "@/contexts/language-context";

import {useRouter} from 'next/navigation';

import CookieConsent from "@/components/cookie-consent-banner.component";
import Cookies from 'js-cookie';


function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [message, setMessage] = useState('');
  const toast = useToast();


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

  const handleSubscribe = async () => {
    if (!isSupported) return;

    toast({
      title: "Subscribing...",
      status: "info",
      duration: 5000,
      isClosable: true,
    })

    const registration = await navigator.serviceWorker.ready;
    toast({
      title: "Service Worker ready",
      description: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      status: "info",
      duration: 5000,
      isClosable: true,
    })
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
    });
    console.log('New subscription:', subscription);
    setSubscription(subscription);
    await subscribeUser(subscription);
  };

  const handleUnsubscribe = async () => {
    if (!subscription) return;

    await subscription.unsubscribe();
    console.log('Unsubscribed:', subscription);
    setSubscription(null);
    await unsubscribeUser();
  };

  const handleSendNotification = async () => {
    if (!subscription) return;

    await sendNotification(message);
  };


  return (
    <div>
      <Text as="h1" fontFamily="heading">Support: {isSupported ? 'YES' : 'NO'}</Text>
      <Text as="h1" fontFamily="heading">{JSON.stringify(subscription)}</Text>
      <Text as="h1" fontFamily="heading">Message: {process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY}</Text>
      <Text as="h1" fontFamily="heading">Message: {process.env.VAPID_PRIVATE_KEY}</Text>
      <Button onClick={handleSubscribe} disabled={!!subscription}>Subscribe</Button>
      <Button onClick={handleUnsubscribe} disabled={!subscription}>Unsubscribe</Button>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Notification message" />
      <Button onClick={handleSendNotification} disabled={!subscription}>Send Notification</Button>
    </div>
  );
}

export default function Home() {
  const { language, changeLanguage, availableLanguages } = useLanguage();
  const router = useRouter();

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

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  }


  return (
    <Box
      // alignItems="flex-end"
      // justifyContent="flex-end"
      //mx="auto"
      //my="auto"
      p={4}
      // border="1px solid"
      display="flex"
      alignItems="flex-start"
      justifyContent="flex-end"
    >
    {!Cookies.get('cookiesAccepted')  && (<CookieConsent onAccept={handleAcceptCookies} />)}

      <HStack spacing={4} w="md" >
        <GlowingGreenNeonButton onClick={handleSignIn} >{language === 'en' ? 'Sign-in' : 'Giriş'}</GlowingGreenNeonButton>
        <GlowingGreenNeonButton onClick={handleRegister} >{language === 'en' ? 'Register' : 'Kayıt Ol'}</GlowingGreenNeonButton>
        <LanguageDropdown />
        
      </HStack>
      
      {/* <PushNotificationManager /> */}
      
    </Box>
  );
}