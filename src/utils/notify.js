import admin from "../config/firebase.js";

export const sendPushNotification = async (fcmToken, title, body, data = {}) => {
  try {
    const message = {
      token: fcmToken,
      notification: { title, body },
      data
    };

    await admin.messaging().send(message);
    console.log(`✅ Notification sent to ${fcmToken}`);
  } catch (error) {
    console.error("❌ Notification error:", error.message);
  }
};
