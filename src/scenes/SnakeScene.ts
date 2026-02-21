import p5 from 'p5';
import { Snake } from '../Snake';

/**
 * Snake scene - procedural animated snake that follows the mouse
 */
export const snakeScene = (p: p5): void => {
  let snake: Snake;

  p.setup = (): void => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(60);
    snake = new Snake(new p5.Vector(p.width / 2, p.height / 2));
  };

  p.draw = (): void => {
    p.background(40, 44, 52);
    snake.resolve(p);
    snake.display(p);
  };

  p.windowResized = (): void => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};
