'use server';

import webpush from 'web-push';


webpush.setVapidDetails(
  'mailto:oguz@lavittoria.ai',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);


export async function sendNotification(subscription, title, message) {
  console.log('Sending notification with subscription:', subscription);
  if (!subscription) {
    throw new Error('No subscription available');
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: title,
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