import p5 from 'p5';
import { Fish } from '../Fish';

/**
 * Fish scene - procedural animated fish that follows the mouse
 */
export const fishScene = (p: p5): void => {
  let fish: Fish;

  p.setup = (): void => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(60);
    fish = new Fish(new p5.Vector(p.width / 2, p.height / 2));
  };

  p.draw = (): void => {
    p.background(40, 44, 52);
    fish.resolve(p);
    fish.display(p);
  };

  p.windowResized = (): void => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};
