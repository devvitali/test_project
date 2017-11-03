import Permissions from 'react-native-permissions';
import FCM from 'react-native-fcm';

const requestPermission = (...args) => (
  new Promise((resolve, reject) => {
    Permissions
      .check(...args)
      .then((response) => {
        console.log({
          name: 'PermissionStatus',
          value: { args, response },
          important: true,
        });

        //  Access was already granted
        if (response === 'authorized') {
          return resolve();
        }

        //  (iOS only) blocked by parental controls
        if (response === 'restricted') {
          return reject();
        }

        Permissions
          .check(...args)
          .then((permissionResponse) => {
            console.log({
              name: 'PermissionResponse',
              value: { args, permissionResponse },
              important: true,
            });

            if (permissionResponse === 'authorized') {
              console.log(`${args[0]}_permission_granted`);
              resolve();
            } else {
              console.log(`${args[0]}_permission_rejected`);
              reject();
            }

          })
          .catch(reject);

        return null;
      })
      .catch(reject);
  })
);

export const locationPermission = () => requestPermission('location', 'whenInUse');

export const notificationPermission = () => (
  new Promise((resolve, reject) => {
    requestPermission('notification')
      .then(() => {
        FCM.requestPermissions();
        FCM.getFCMToken()
          .then((token) => {
            console.log({
              name: 'FCM Token',
              value: { token },
              important: true,
            });
            resolve(token);
          })
          .catch(reject);

      })
      .catch(reject);
  })
);
