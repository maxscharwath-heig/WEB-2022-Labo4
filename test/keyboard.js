// TODO: Test the keyboard function or one of its components
import { assert } from 'chai';
import { EventEmitter } from 'events';
import keyboard from '../src/keyboard.js';
import { keysValues } from '../src/constants.js';
import Message from '../src/message.js';

/**
 * A Mock to emulate the KeyboardEvent.
 * @returns {{clear(): void, window: {addEventListener(*, *): void}, emit(*, *): void}}
 */
function createMock() {
  const events = new EventEmitter();
  return {
    // Emits an event
    emit(event, key) {
      events.emit(event, { key });
    },
    // Clears all the listeners
    clear() {
      events.removeAllListeners();
    },
    // Mocks the window object
    window: {
      addEventListener(event, listener) {
        events.on(event, listener);
      },
    },
  };
}

const mock = createMock();
describe('keyboard.js', () => {
  before('initialize mock', () => {
    // create a tiny mock window object
    global.window = mock.window;
  });
  beforeEach('clear mock', () => {
    mock.clear();
  });

  it('mock should have been initialized', () => {
    assert.isDefined(window);
    assert.isDefined(window.addEventListener);
  });
  it('mock should emit events', () => {
    let called = false;
    window.addEventListener('keydown', () => {
      called = true;
    });
    mock.emit('keydown', 'a');
    assert.isTrue(called);
  });
  it('keyboard should be an function', () => {
    assert.isFunction(keyboard);
  });
  it('keyboard should execute the listener with Message when keydown', async (done) => {
    keyboard((message) => {
      assert.instanceOf(message, Message);
      assert.equal(message.action, 'keydown');
      assert.equal(message.object, keysValues.arrowLeft);
      done();
    });
    mock.emit('keydown', keysValues.arrowLeft);
  });
  it('keyboard should execute the listener with Message when keyup', async (done) => {
    keyboard((message) => {
      assert.instanceOf(message, Message);
      assert.equal(message.action, 'keyup');
      assert.equal(message.object, keysValues.arrowDown);
      done();
    });
    mock.emit('keyup', keysValues.arrowDown);
  });

  it('keyboard should not execute the listener when the same key is pressed twice', () => {
    let numberOfCalls = 0;
    keyboard(() => {
      numberOfCalls++;
    });
    mock.emit('keydown', keysValues.arrowLeft);
    mock.emit('keydown', keysValues.arrowLeft);
    assert.equal(numberOfCalls, 1);
  });

  it('keyboard should execute the listener when the same key is pressed twice and released', () => {
    let numberOfCalls = 0;
    keyboard(() => {
      numberOfCalls++;
    });
    mock.emit('keydown', keysValues.arrowLeft);
    mock.emit('keydown', keysValues.arrowLeft);
    mock.emit('keyup', keysValues.arrowLeft);
    mock.emit('keydown', keysValues.arrowLeft);
    assert.equal(numberOfCalls, 3);
  });
});
