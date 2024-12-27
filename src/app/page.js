"use client"

import { Text, Button } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
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

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [message, setMessage] = useState('');

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
    await unsubscribeUser();
  };

  const handleSendNotification = async () => {
    if (!subscription) return;

    await sendNotification(message);
  };

  return (
    <div>
      <Text as="h1" fontFamily="heading">Support: {isSupported ? 'YES' : 'NO'}</Text>
      <Button onClick={handleSubscribe} disabled={!!subscription}>Subscribe</Button>
      <Button onClick={handleUnsubscribe} disabled={!subscription}>Unsubscribe</Button>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Notification message" />
      <Button onClick={handleSendNotification} disabled={!subscription}>Send Notification</Button>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <PushNotificationManager />
    </div>
  );
}