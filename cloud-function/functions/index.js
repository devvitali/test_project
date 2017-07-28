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
          console.log('notification', notification, drinkup);
          const payload = {
            notification: {
              title: `${notification.user.firstName} want to join drinkup`,
              body: `${notification.user.firstName} want to join drinkup`,
            }
          };
          Object.keys(users).forEach((userId) => {
            const fcmToken = users[userId].fcmToken;
            return admin.messaging().sendToDevice(fcmToken, payload);
          });
        });
      }
    }
  });