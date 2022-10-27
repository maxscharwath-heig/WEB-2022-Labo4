import Message from './message.js';
import { keysValues } from './constants.js';

/*
The keyboard function listens to keydown and keyup events and executes the listener with a Message.
The Message contains the event type and the key that was pressed.
The listener is only executed one time when the same key is pressed multiple times.
 */

/**
 * A function that listen to keyboard events.
 * @param listener
 */
function keyboard(listener) {
  // object key is the key, value is the event type to prevent multiple events for the same key
  // Do not use a Set because we will use more than two event types in the future.
  const lastEventEmitted = {};
  ['keydown', 'keyup'].forEach((type) => {
    window.addEventListener(type, (event) => {
      if (!Object.values(keysValues).includes(event.key) || lastEventEmitted[event.key] === type) {
        // The event was already emitted or the key is not a valid key
        return;
      }
      lastEventEmitted[event.key] = type;
      listener(new Message(type, event.key));
    });
  });
}

export default keyboard;
