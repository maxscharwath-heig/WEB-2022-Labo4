import { assert } from 'chai';
import {
  width,
  height,
  maxHealth,
  rocketIncrement,
  rocketTTL,
  tick,
  keysValues,
} from '../src/constants.js';

import Game from '../src/game.js';
import Message from '../src/message.js';
import { Vehicle, Rocket } from '../src/model.js';

describe('game.js', () => {
  describe('Game methods', () => {
    it('01 - id() should return identifiers incrementally starting from 0', () => {
      const game = new Game();
      for (let i = 0; i < 1000; i++) {
        assert.equal(game.id(), i);
      }
    });
    it('02 - *vehicles() is a generator that lists the vehicles of the game', () => {
      const game = new Game();
      const vehicle = new Vehicle(0, 0, 0, 0, 0, 0, false, false, false, false, '#000');
      game.set(0, vehicle);
      const rocket = new Rocket(1, 0, 0, 0, 0, 0);
      game.set(1, rocket);
      const vehicles = Array.from(game.vehicles());
      assert.equal(vehicles.length, 1);
      assert.equal(vehicles[0], vehicle);
    });
    it('03 - *rockets() is a generator that lists the rockets of the game', () => {
      const game = new Game();
      const vehicle = new Vehicle(0, 0, 0, 0, 0, 0, false, false, false, false, '#000');
      game.set(0, vehicle);
      const rocket = new Rocket(1, 0, 0, 0, 0, 0);
      game.set(1, rocket);
      const rockets = Array.from(game.rockets());
      assert.equal(rockets.length, 1);
      assert.equal(rockets[0], rocket);
    });
    it('04 - join() should create a vehicle, add it to the game and return it', () => {
      const game = new Game();
      assert.equal(game.size, 0);
      const id = game.join();
      const vehicle = game.get(id);
      assert.isTrue(vehicle instanceof Vehicle);
      assert.equal(game.size, 1);
      assert.equal(vehicle.id, 0);
      assert.equal(vehicle.x, width / 2);
      assert.equal(vehicle.y, height / 2);
      assert.equal(vehicle.angle, -Math.PI / 2);
      assert.equal(vehicle.speed, 0);
      assert.equal(vehicle.health, maxHealth);
    });
    it('05 - quit(vehicle) should remove the vehicle from the game', () => {
      const game = new Game();
      const id1 = game.join();
      assert.equal(game.size, 1);
      const id2 = game.join();
      assert.equal(game.size, 2);
      game.quit(id1);
      assert.equal(game.size, 1);
      game.quit(id2);
      assert.equal(game.size, 0);
    });
    it(`06 - onMessage(id, new Message("keydown", "${keysValues.space}")) should create a rocket for the given vehicle and add it to the game`, () => {
      const game = new Game();
      const id = game.join();
      const vehicle = game.get(id);
      assert.equal(game.size, 1);
      game.onMessage(id, new Message('keydown', keysValues.space));
      const rocket1 = game.get(1);
      assert.equal(game.size, 2);
      assert.isTrue(game.get(1) instanceof Rocket);
      assert.equal(rocket1.angle, vehicle.angle);
      assert.equal(rocket1.speed, vehicle.speed + rocketIncrement);
    });
    it(`07 - onMessage(id, new Message("keydown", "${keysValues.arrowLeft}")) should rotate the vehicle on the left`, () => {
      const game = new Game();
      const id = game.join();
      game.onMessage(id, new Message('keydown', keysValues.arrowLeft));
      const vehicle = game.get(id);
      assert.isTrue(vehicle.isTurningLeft);
    });
    it(`08 - onMessage(id, new Message("keydown", "${keysValues.arrowRight}")) should rotate the vehicle on the right`, () => {
      const game = new Game();
      const id = game.join();
      game.onMessage(id, new Message('keydown', keysValues.arrowRight));
      const vehicle = game.get(id);
      assert.isTrue(vehicle.isTurningRight);
    });
    it(`09 - onMessage(id, new Message("keydown", "${keysValues.arrowUp}")) should accelerate the vehicle`, () => {
      const game = new Game();
      const id = game.join();
      game.onMessage(id, new Message('keydown', keysValues.arrowUp));
      const vehicle = game.get(id);
      assert.isTrue(vehicle.isAccelerating);
    });
    it(`10 - onMessage(id, new Message("keydown", "${keysValues.arrowDown}")) should reverse the vehicle`, () => {
      const game = new Game();
      const id = game.join();
      game.onMessage(id, new Message('keydown', keysValues.arrowDown));
      const vehicle = game.get(id);
      assert.isTrue(vehicle.isReversing);
    });
    it('11 - move() should detect collisions between rockets and vehicles and decrease the health', () => {
      const game = new Game();
      const vehicle = new Vehicle(0, 0, 0, 0, 0, 0, false, false, false, false, '#000');
      game.set(0, vehicle);
      const rocket = new Rocket(1, 0, 0, 0, 0, 0);
      game.set(1, rocket);
      assert.equal(game.size, 2);
      game.move();
      assert.equal(game.size, 1);
    });
    it('12 - move() should delete rockets when they expire (rocketTTL constant)', () => {
      const game = new Game();
      game.set(0, new Rocket(0, game.timestamp(), 0, 0, 0, 0));
      for (let i = 0; i < rocketTTL; i += tick) {
        game.move();
        assert.equal(game.size, 1);
      }
      game.move();
      assert.equal(game.size, 0);
    });
  });
});
