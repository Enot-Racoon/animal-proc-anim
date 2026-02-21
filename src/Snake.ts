import p5 from 'p5';
import { Chain } from './Chain';

/**
 * Snake - procedural animated snake that follows the mouse
 */
export class Snake {
  spine: Chain;

  constructor(origin: p5.Vector) {
    this.spine = new Chain(origin, 48, 64, Math.PI / 8);
  }

  resolve(p: p5): void {
    const headPos = this.spine.joints[0];
    const mousePos = new p5.Vector(p.mouseX, p.mouseY);
    const targetPos = p5.Vector.add(headPos, p5.Vector.sub(mousePos, headPos).setMag(8));
    this.spine.resolve(targetPos);
  }

  display(p: p5): void {
    p.strokeWeight(4);
    p.stroke(255);
    p.fill(172, 57, 49);

    // === START BODY ===
    p.beginShape();

    // Right half of the snake
    for (let i = 0; i < this.spine.joints.length; i++) {
      p.curveVertex(this.getPosX(i, Math.PI / 2, 0), this.getPosY(i, Math.PI / 2, 0));
    }

    p.curveVertex(this.getPosX(47, Math.PI, 0), this.getPosY(47, Math.PI, 0));

    // Left half of the snake
    for (let i = this.spine.joints.length - 1; i >= 0; i--) {
      p.curveVertex(this.getPosX(i, -Math.PI / 2, 0), this.getPosY(i, -Math.PI / 2, 0));
    }

    // Top of the head (completes the loop)
    p.curveVertex(this.getPosX(0, -Math.PI / 6, 0), this.getPosY(0, -Math.PI / 6, 0));
    p.curveVertex(this.getPosX(0, 0, 0), this.getPosY(0, 0, 0));
    p.curveVertex(this.getPosX(0, Math.PI / 6, 0), this.getPosY(0, Math.PI / 6, 0));

    // Some overlap needed because curveVertex requires extra vertices that are not rendered
    p.curveVertex(this.getPosX(0, Math.PI / 2, 0), this.getPosY(0, Math.PI / 2, 0));
    p.curveVertex(this.getPosX(1, Math.PI / 2, 0), this.getPosY(1, Math.PI / 2, 0));
    p.curveVertex(this.getPosX(2, Math.PI / 2, 0), this.getPosY(2, Math.PI / 2, 0));

    p.endShape(p.CLOSE);
    // === END BODY ===

    // === START EYES ===
    p.fill(255);
    p.ellipse(this.getPosX(0, Math.PI / 2, -18), this.getPosY(0, Math.PI / 2, -18), 24, 24);
    p.ellipse(this.getPosX(0, -Math.PI / 2, -18), this.getPosY(0, -Math.PI / 2, -18), 24, 24);
    // === END EYES ===
  }

  debugDisplay(p: p5): void {
    this.spine.display(p);
  }

  bodyWidth(i: number): number {
    switch (i) {
      case 0:
        return 76;
      case 1:
        return 80;
      default:
        return 64 - i;
    }
  }

  getPosX(i: number, angleOffset: number, lengthOffset: number): number {
    return this.spine.joints[i].x + Math.cos(this.spine.angles[i] + angleOffset) * (this.bodyWidth(i) + lengthOffset);
  }

  getPosY(i: number, angleOffset: number, lengthOffset: number): number {
    return this.spine.joints[i].y + Math.sin(this.spine.angles[i] + angleOffset) * (this.bodyWidth(i) + lengthOffset);
  }
}
