import p5 from 'p5';
import { Lizard } from '../Lizard';

/**
 * Lizard scene - procedural animated lizard with FABRIK limbs
 */
export const lizardScene = (p: p5): void => {
  let lizard: Lizard;

  p.setup = (): void => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(60);
    lizard = new Lizard(new p5.Vector(p.width / 2, p.height / 2));
  };

  p.draw = (): void => {
    p.background(40, 44, 52);
    lizard.resolve(p);
    lizard.display(p);
  };

  p.windowResized = (): void => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};
