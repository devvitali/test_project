import { remoteConfig } from './firestack';

export const fetch = (key, expiration = 86400) => (
  new Promise((resolve, reject) => (
    remoteConfig
      .fetchWithExpiration(expiration)
      .then(() => remoteConfig.config(key))
      .then(resolve)
      .catch(reject)
  ))
);
