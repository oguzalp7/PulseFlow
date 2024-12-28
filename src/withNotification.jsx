"use client";

import React, { useState, useEffect } from 'react';
import { useToast } from "@chakra-ui/react";
import { subscribeUser, unsubscribeUser, sendNotification } from './actions';

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

const withNotifications = (WrappedComponent) => {
  return (props) => {
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
              });
            },
            (error) => {
              console.log("Service Worker registration failed:", error);
              toast({
                title: "Service Worker registration failed",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
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
      });

      const registration = await navigator.serviceWorker.ready;
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
      await unsubscribeUser(subscription);
    };

    const handleSendNotification = async () => {
      if (!subscription) return;

      await sendNotification(message);
    };

    return (
      <WrappedComponent
        {...props}
        isSupported={isSupported}
        subscription={subscription}
        message={message}
        setMessage={setMessage}
        handleSubscribe={handleSubscribe}
        handleUnsubscribe={handleUnsubscribe}
        handleSendNotification={handleSendNotification}
      />
    );
  };
};

export default withNotifications;