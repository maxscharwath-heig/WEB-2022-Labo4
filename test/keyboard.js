import { assert } from 'chai';
import sinon from 'sinon';
import jsdom from 'jsdom';
import keyboard from '../src/keyboard.js';
import { keysValues } from '../src/constants.js';
import Message from '../src/message.js';

/**
 * A Mock to emulate the KeyboardEvent.
 * @returns {{reset(): void, emit(*, *): void}}
 */
function createMock() {
  global.window = new jsdom.JSDOM().window;
  return {
    // Emits an event
    emit(event, key) {
      global.window.dispatchEvent(new window.KeyboardEvent(event, { key }));
    },
    // resets the mock
    reset() {
      global.window = new jsdom.JSDOM().window;
    },
  };
}

const mock = createMock();
describe('keyboard.js', () => {
  beforeEach('reset mock', () => {
    mock.reset();
  });

  it('mock should have been initialized', () => {
    assert.isDefined(window);
    assert.isDefined(window.addEventListener);
  });
  it('mock should emit events', () => {
    const callback = sinon.fake();
    window.addEventListener('keydown', callback);
    mock.emit('keydown', 'a');
    assert.isTrue(callback.calledOnce);
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
    const callback = sinon.fake();
    keyboard(callback);
    mock.emit('keydown', keysValues.arrowLeft);
    mock.emit('keydown', keysValues.arrowLeft);
    assert.isTrue(callback.calledOnce);
  });

  it('keyboard should execute the listener when the same key is pressed twice and released', () => {
    const callback = sinon.fake();
    keyboard(callback);
    mock.emit('keydown', keysValues.arrowLeft);
    mock.emit('keydown', keysValues.arrowLeft);
    mock.emit('keyup', keysValues.arrowLeft);
    mock.emit('keydown', keysValues.arrowLeft);
    assert.isTrue(callback.calledThrice);
  });

  it('keyboard should not execute the listener when the key is not valid', () => {
    const callback = sinon.fake();
    keyboard(callback);
    mock.emit('keydown', 'a');
    assert.isFalse(callback.called);
  });

  it('keyboard should not execute the listener when the event is not keydown or keyup', () => {
    const callback = sinon.fake();
    keyboard(callback);
    mock.emit('click', keysValues.arrowLeft);
    assert.isFalse(callback.called);
  });
});
