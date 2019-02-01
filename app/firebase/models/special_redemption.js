import moment from 'moment';
import Base from './base';

export default class SpecialRedemption extends Base {

  constructor(db, actions) {
    super(db, actions);
    this.ref = 'special_redemptions';
  }

  getByBarAndUser(barId, userId) {
    const date = moment().format('YYYY-MM-DD');
    const key = `special_redemptions/${userId}/${barId}/${date}`;

    return new Promise((resolve) => {
      this.dbRef(key).once('value', (snapshot) => {
        resolve(snapshot.val());
      });
    });
  }

  setByBarAndUser(barId, userId) {
    const date = moment().format('YYYY-MM-DD');
    const key = `special_redemptions/${userId}/${barId}/${date}`;
    const timestamp = (new Date()).getTime();

    this.dbRef(key).set({ timestamp });
    return { timestamp };
  }

  // eslint-disable-next-line class-methods-use-this
  hasExpired(timestamp) {
    return this.secondsRemaining(timestamp) === 0;
  }

  // eslint-disable-next-line class-methods-use-this
  secondsRemaining(timestamp) {
    const currentTimestamp = (new Date()).getTime();
    const diff = (currentTimestamp - timestamp) / 1000;
    return Math.max(0, (3 * 60) - diff); // 3 minutes
  }

}
