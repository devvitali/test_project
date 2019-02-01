import Base from './base';

export default class User extends Base {

  constructor(db, actions) {
    super(db, actions);
    this.ref = 'users_sand';
  }

}
