'use server';

import webpush from 'web-push';

import { pfClient } from '@/pulseflowApiClient';

webpush.setVapidDetails(
  'mailto:oguz@lavittoria.ai',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

let subscription = null;

export async function subscribeUser(sub, userId) {
  subscription = sub;
  console.log('Subscription stored:', subscription);

  // Send the subscription to the server
  try {
    await pfClient.post('/subscriptions', {
      userId,
      subscription: JSON.stringify(sub),
    });
  } catch (error) {
    console.error('Failed to store subscription:', error);
    return { success: false, error: 'Failed to store subscription' };
  }

  return { success: true };
}

export async function unsubscribeUser(subscription) {
  subscription = null;
  console.log('Subscription removed');
  
  // Send the subscription to the server
  try {
    const response = await pfClient.delete(`/subscriptions/${subscription.endpoint}`);
    console.log('Subscription removed:', response.data);
    return { success: true };
  } catch (error) {
    console.error('Failed to remove subscription:', error);
    return { success: false, error: 'Failed to remove subscription' };
  }
}

export async function sendNotification(message) {
  console.log('Sending notification with subscription:', subscription);
  if (!subscription) {
    throw new Error('No subscription available');
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icons/icon-192x192.png',
      })
    );
    return { success: true };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}