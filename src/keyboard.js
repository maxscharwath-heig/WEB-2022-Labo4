import Message from './message.js';

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
  const lastEventEmitted = {};
  ['keydown', 'keyup'].forEach((event) => {
    window.addEventListener(event, ({ key }) => {
      if (lastEventEmitted[key] === event) {
        // The event was already emitted
        return;
      }
      lastEventEmitted[key] = event;
      listener(new Message(event, key));
    });
  });
}

export default keyboard;
