import {
  width,
  height,
  rocketTTL,
  rocketIncrement,
  collisionRadius,
  keysValues,
} from './constants.js';
import { Vehicle, Rocket } from './model.js';
import { collision } from './util.js';

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
  }

  /**
   * Returns the current timestamp.
   */
  timestamp() {
    return new Date().getTime();
  }

  /**
   * Return the vehicles.
   */
  // TODO: Create the vehicles() method (generator)

  /**
   * Return the rockets.
   */
  // TODO: Create the rockets() method (generator)

  /**
   * Generate a unique identifier for storing and synchronizing objects.
   */
  // TODO: Create the id() method

  /**
   * Initialize a vehicle and set a new key-value pair in the class map,
   * then return the ID of the new-created vehicle.
   *
   * @returns {*}
   */
  // TODO: Create the join() method

  /**
   * Delete a vehicle by its id.
   *
   * @param id
   */
  // TODO: Create the quit(id) method

  /**
   * Handle the player messages.
   *
   * @param player
   * @param message
   */
  // TODO: Create the onMessage(id, message) method

  /**
   * Updates the state of the game
   */
  move() {
    for (const entity of this.values()) {
      entity.move();
    }

    // TODO: Check for collisions and remove old rockets
  }
}

export default Game;
