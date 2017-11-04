  const functions = require('firebase-functions');
  let admin = require('firebase-admin');
  admin.initializeApp(functions.config().firebase);

  exports.sendPush = functions.database.ref('/notification/{notificationId}')
    .onWrite(event => {
      const notification = event.data.current.val();
      if (notification) {
        if (notification.type === 'JOIN_DRINKUP_REQUEST') {
          admin.database().ref(`/drinkUps_sand/${notification.drinkupId}`)
          .once('value', function(drinkupOnce) {
            const drinkup = drinkupOnce.val();
            const users = drinkup.users;
            const payload = {
              notification: {
                title: `${notification.user.firstName} want to join drinkup`,
                body: `${notification.user.firstName} want to join drinkup`,
              }
            };
            Object.keys(users).forEach((userId) => {
              const fcmToken = users[userId].fcmToken;
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
              }
            };
            console.log('send ACCEPT_DRINKUP_REQUEST notification', notification.fcmToken, payload);
            if (notification.fcmToken && notification.fcmToken.length > 0) {
              return admin.messaging().sendToDevice(notification.fcmToken, payload);
            }
        }
      }
    });