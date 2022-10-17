import Message from './message.js';

/**
 * A function that listen to keyboard events.
 * @param listener
 */
function keyboard(listener) {
  ['keydown', 'keyup'].forEach((event) => {
    window.addEventListener(event, ({ key }) => {
      listener(new Message(event, key));
    });
  });
}

export default keyboard;
