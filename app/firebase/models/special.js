import Base from './base';

export default class Special extends Base {
  constructor(db, actions) {
    super(db, actions);
    this.ref = 'specials';
  }
}
