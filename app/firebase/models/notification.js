import Base from './base';

export default class Notification extends Base {
  constructor(db, actions) {
    super(db, actions);
    this.ref = 'notification';
  }
}
