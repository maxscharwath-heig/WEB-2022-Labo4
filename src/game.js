import {
  width,
  height,
  rocketTTL,
  rocketIncrement,
  collisionRadius,
  keysValues, tick,
} from './constants.js';
import { Vehicle, Rocket } from './model.js';
import { collision } from './util.js';
import Message from './message.js';

/**
 * A class to manage the state of the game.
 */
class Game extends Map {
  /**
   * Construct a Game object
   */
  constructor() {
    super();
    this.counter = 0;
    this.ticks = 0;
  }

  /**
   * Returns the current timestamp.
   */
  timestamp() {
    return this.ticks;
  }

  /**
   * Return the vehicles.
   */
  // TODO: Create the vehicles() method (generator)
  * vehicles() {
    for (const entity of this.values()) {
      if (entity instanceof Vehicle) {
        yield entity;
      }
    }
  }

  /**
   * Return the rockets.
   */
  * rockets() {
    for (const entity of this.values()) {
      if (entity instanceof Rocket) {
        yield entity;
      }
    }
  }

  /**
   * Generate a unique identifier for storing and synchronizing objects.
   */
  id() {
    return this.counter++;
  }

  /**
   * Initialize a vehicle and set a new key-value pair in the class map,
   * then return the ID of the new-created vehicle.
   *
   * @returns {*}
   */
  join() {
    const id = this.id();
    const vehicle = new Vehicle(id, 0, width / 2, height / 2, 0, -Math.PI / 2, false, false, false, false, '#000');
    this.set(id, vehicle);
    return id;
  }

  fire(id) {
    const entity = this.get(id);
    const rocket = new Rocket(
      this.id(),
      this.timestamp(),
      entity.x,
      entity.y,
      entity.speed + rocketIncrement,
      entity.angle,
    );
    this.set(rocket.id, rocket);
    return rocket.id;
  }

  /**
   * Delete a vehicle by its id.
   *
   * @param id
   */
  quit(id) {
    this.delete(id);
  }

  /**
   * Handle the player messages.
   *
   * @param id {number} The id of the player
   * @param message {Message}
   */
  // TODO: Create the onMessage(id, message) method
  onMessage(id, message) {
    /**
     * @type {Vehicle}
     */
    const entity = this.get(id);
    // eslint-disable-next-line default-case
    const isDown = message.action === 'keydown';
    switch (message.object) {
      case keysValues.arrowUp:
        entity.isAccelerating = isDown;
        break;
      case keysValues.arrowDown:
        entity.isReversing = isDown;
        break;
      case keysValues.arrowLeft:
        entity.isTurningLeft = isDown;
        break;
      case keysValues.arrowRight:
        entity.isTurningRight = isDown;
        break;
      case keysValues.space:
        // only fire if the key is pressed down
        if (isDown) this.fire(id);
        break;
      default:
    }
  }

  /**
   * Updates the state of the game
   */
  move() {
    this.ticks += tick;
    for (const entity of this.values()) {
      entity.move();
      if (entity instanceof Rocket) {
        if (this.timestamp() - entity.created > rocketTTL) {
          this.delete(entity.id);
          // eslint-disable-next-line no-continue
          continue;
        }
        for (const vehicle of this.vehicles()) {
          if (collision(entity.x, entity.y, vehicle.x, vehicle.y, collisionRadius)) {
            this.delete(entity.id);
            vehicle.health -= 1;
            break;
          }
        }
      }
    }
  }
}

export default Game;
