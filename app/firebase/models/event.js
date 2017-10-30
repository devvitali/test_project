import Base from './base';

export default class Events extends Base {
  constructor(db, actions) {
    super(db, actions);
    this.ref = 'events';
  }
}
