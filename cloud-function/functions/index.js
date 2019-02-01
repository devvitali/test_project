/* eslint-disable consistent-return */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendPush = functions.database.ref('/notification/{notificationId}')
  .onCreate((event, context) => {
    const notification = event.val();
    if (notification) {
      console.log('New notification', notification.type, notification.drinkupId);
      if (notification.type === 'JOIN_DRINKUP_REQUEST') {
        admin.database().ref(`/drinkUps_sand/${notification.drinkupId}`)
          .once('value', (drinkupOnce) => {
            const drinkup = drinkupOnce.val();
            const { users } = drinkup;
            const payload = {
              notification: {
                title: `${notification.user.firstName} wants to join the drinkup!`,
                body: 'Open ALKO to send an invitation',
              },
            };
            Object.keys(users).forEach((userId) => {
              const { fcmToken } = users[userId];
              if (fcmToken && fcmToken.length > 0) {
                console.log('send JOIN_DRINKUP_REQUEST notification', fcmToken, payload);
                return admin.messaging().sendToDevice(fcmToken, payload);
              }
            });
          });
      } else if (notification.type === 'ACCEPT_DRINKUP_REQUEST') {
        const payload = {
          notification: {
            title: `You have been invited to ${notification.barName}`,
            body: notification.message,
          },
        };
        console.log('send ACCEPT_DRINKUP_REQUEST notification', notification.fcmToken, payload);
        if (notification.fcmToken && notification.fcmToken.length > 0) {
          return admin.messaging().sendToDevice(notification.fcmToken, payload);
        }
      }
    }
  });
