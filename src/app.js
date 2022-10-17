import { tick } from './constants.js';
import Game from './game.js';
import Renderer from './renderer.js';
import keyboard from './keyboard.js';

// Game initialization
const game = new Game();

// Vehicle initialization
const id = game.join();

// Listen to keyboard events
keyboard((message) => {
  game.onMessage(id, message);
});

// Game loop initialization
setInterval(() => {
  game.move();
}, tick);

// Rendering loop initialization
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const renderer = new Renderer(game, context);
const render = () => {
  renderer.render();
  requestAnimationFrame(render);
};
requestAnimationFrame(render);
