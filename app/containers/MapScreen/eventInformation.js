import { map } from 'lodash';
import { EventFactory } from '../../firebase/models';

class EventInformation {
  constructor() {
    this.events = {
    };
    this.eventModel = new EventFactory();
  }
  onEventEntered = async (eventId) => {
    this.events[eventId] = await this.eventModel.get(eventId, true);
    console.log('onEventEntered', this.events);
  };
  checkEventStatus = (barId) => {
    let ret = false;
    map(this.events, (event) => {
      if (event.bar === barId) {
        ret = true;
      }
    });
    return ret;
  };
  getEvent = () => {
    let ret = null;
    map(this.events, (event, index) => {
      if (index) {
        ret = event;
      }
    });
    return ret;
  };
}
export const EventsInformation = new EventInformation();

