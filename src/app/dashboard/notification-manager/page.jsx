"use client";

import { urlBase64ToUint8Array } from "@/utils";
import { useState, useEffect } from 'react';
import { Text, Button, useToast, Box, HStack, Image, Stack, Heading } from "@chakra-ui/react";
import { sendNotification } from "../../actions";

import UserContext from "@/contexts/user-context";
import { useContext } from "react";
import useCreateData from "@/hooks/useCreateData";
import useDeleteData from "@/hooks/useDeleteData";

function PushNotificationManager() {
  const { user } = useContext(UserContext);
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [message, setMessage] = useState('');
  const toast = useToast();

  const { data, loading, error, createData } = useCreateData('/subscriptions');
  const { deleteData } = useDeleteData('/subscriptions');


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
    console.log('New subscription:', subscription);
    setSubscription(subscription);
    // const res = await subscribeUser(subscription, user.id);
    // console.log('Subscription result:', res);
  };

  const handleUnsubscribe = async () => {
    if (!subscription) return;

    await subscription.unsubscribe();
    console.log('Unsubscribed:', subscription);
    setSubscription(null);
    // await unsubscribeUser();
  };

  const handleSendNotification = async () => {
    if (!subscription) return;
    if (!message) {
      toast({
        title: "Please enter a message",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    await sendNotification(subscription, 'Test Notification', message);
  };

  
  return (
    <div>
      <Text color={'white'} as="h1" fontFamily="heading">Support: {isSupported ? 'YES' : 'NO'}</Text>
      <Text color={'white'} as="h1" fontFamily="heading">{JSON.stringify(subscription)}</Text>

      <Button onClick={handleSubscribe} disabled={!!subscription}>Subscribe</Button>
      <Button onClick={handleUnsubscribe} disabled={!subscription}>Unsubscribe</Button>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Notification message" />
      <Button onClick={() => handleSendNotification(subscription)} disabled={!subscription}>Send Notification</Button>
    </div>
  );
}

export default PushNotificationManager;