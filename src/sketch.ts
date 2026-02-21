import p5 from 'p5';
import { Fish } from './Fish';
import { Snake } from './Snake';
import { Lizard } from './Lizard';

/**
 * Animal Proc Anim - Procedural animal animation
 * Ported from Processing to p5.js + TypeScript
 * 
 * Click to switch between animals: Fish, Snake, Lizard
 */

// Type for animal enum
type AnimalType = 0 | 1 | 2;

const sketch = (p: p5): void => {
  let fish: Fish;
  let snake: Snake;
  let lizard: Lizard;
  let animal: AnimalType = 0;

  p.setup = (): void => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(60);

    const center = new p5.Vector(p.width / 2, p.height / 2);
    fish = new Fish(center);
    snake = new Snake(center);
    lizard = new Lizard(center);
  };

  p.draw = (): void => {
    p.background(40, 44, 52);

    switch (animal) {
      case 0:
        fish.resolve(p);
        fish.display(p);
        break;
      case 1:
        snake.resolve(p);
        snake.display(p);
        break;
      case 2:
        lizard.resolve(p);
        lizard.display(p);
        break;
    }
  };

  p.mousePressed = (): void => {
    animal = ((animal + 1) % 3) as AnimalType;
  };

  p.windowResized = (): void => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(sketch);
