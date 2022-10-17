// TODO: Test the keyboard function or one of its components
import { assert } from 'chai';
import { EventEmitter } from 'events';
import keyboard from '../src/keyboard.js';
import { keysValues } from '../src/constants.js';
import Message from '../src/message.js';

function createMock() {
  const events = new EventEmitter();
  return {
    emit(event, key) {
      events.emit(event, { key });
    },
    clear() {
      events.removeAllListeners();
    },
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
});
