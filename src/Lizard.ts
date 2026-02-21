import p5 from 'p5';
import { Chain } from './Chain';

/**
 * Lizard - procedural animated lizard that follows the mouse
 * Uses FABRIK inverse kinematics for limb animation
 */
export class Lizard {
  spine: Chain;
  arms: Chain[];
  armDesired: p5.Vector[];

  // Width of the lizard at each vertebra
  bodyWidth: number[] = [52, 58, 40, 60, 68, 71, 65, 50, 28, 15, 11, 9, 7, 7];

  constructor(origin: p5.Vector) {
    this.spine = new Chain(origin, 14, 64, Math.PI / 8);
    this.arms = [];
    this.armDesired = [];
    
    for (let i = 0; i < 4; i++) {
      this.arms[i] = new Chain(origin, 3, i < 2 ? 52 : 36);
      this.armDesired[i] = new p5.Vector(0, 0);
    }
  }

  resolve(p: p5): void {
    const headPos = this.spine.joints[0];
    const mousePos = new p5.Vector(p.mouseX, p.mouseY);
    const targetPos = p5.Vector.add(headPos, p5.Vector.sub(mousePos, headPos).setMag(12));
    this.spine.resolve(targetPos);

    for (let i = 0; i < this.arms.length; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const bodyIndex = i < 2 ? 3 : 7;
      const angle = i < 2 ? Math.PI / 4 : Math.PI / 3;
      const desiredPos = new p5.Vector(this.getPosX(bodyIndex, angle * side, 80), this.getPosY(bodyIndex, angle * side, 80));
      
      if (p5.Vector.dist(desiredPos, this.armDesired[i]) > 200) {
        this.armDesired[i] = desiredPos;
      }

      this.arms[i].fabrikResolve(
        p5.Vector.lerp(this.arms[i].joints[0], this.armDesired[i], 0.4),
        new p5.Vector(this.getPosX(bodyIndex, Math.PI / 2 * side, -20), this.getPosY(bodyIndex, Math.PI / 2 * side, -20))
      );
    }
  }

  display(p: p5): void {
    // === START ARMS ===
    p.noFill();
    for (let i = 0; i < this.arms.length; i++) {
      const shoulder = this.arms[i].joints[2];
      const foot = this.arms[i].joints[0];
      const elbow = this.arms[i].joints[1];
      
      // Doing a hacky thing to correct the back legs to be more physically accurate
      const para = p5.Vector.sub(foot, shoulder);
      const perp = new p5.Vector(-para.y, para.x).setMag(30);
      
      let correctedElbow = elbow.copy();
      if (i === 2) {
        correctedElbow = p5.Vector.sub(elbow, perp);
      } else if (i === 3) {
        correctedElbow = p5.Vector.add(elbow, perp);
      }
      
      p.strokeWeight(40);
      p.stroke(255);
      p.bezier(shoulder.x, shoulder.y, correctedElbow.x, correctedElbow.y, correctedElbow.x, correctedElbow.y, foot.x, foot.y);
      
      p.strokeWeight(32);
      p.stroke(82, 121, 111);
      p.bezier(shoulder.x, shoulder.y, correctedElbow.x, correctedElbow.y, correctedElbow.x, correctedElbow.y, foot.x, foot.y);
    }
    // === END ARMS ===

    p.strokeWeight(4);
    p.stroke(255);
    p.fill(82, 121, 111);

    // === START BODY ===
    p.beginShape();

    // Right half of the lizard
    for (let i = 0; i < this.spine.joints.length; i++) {
      p.curveVertex(this.getPosX(i, Math.PI / 2, 0), this.getPosY(i, Math.PI / 2, 0));
    }

    // Left half of the lizard
    for (let i = this.spine.joints.length - 1; i >= 0; i--) {
      p.curveVertex(this.getPosX(i, -Math.PI / 2, 0), this.getPosY(i, -Math.PI / 2, 0));
    }

    // Top of the head (completes the loop)
    p.curveVertex(this.getPosX(0, -Math.PI / 6, -8), this.getPosY(0, -Math.PI / 6, -10));
    p.curveVertex(this.getPosX(0, 0, -6), this.getPosY(0, 0, -4));
    p.curveVertex(this.getPosX(0, Math.PI / 6, -8), this.getPosY(0, Math.PI / 6, -10));

    // Some overlap needed because curveVertex requires extra vertices that are not rendered
    p.curveVertex(this.getPosX(0, Math.PI / 2, 0), this.getPosY(0, Math.PI / 2, 0));
    p.curveVertex(this.getPosX(1, Math.PI / 2, 0), this.getPosY(1, Math.PI / 2, 0));
    p.curveVertex(this.getPosX(2, Math.PI / 2, 0), this.getPosY(2, Math.PI / 2, 0));

    p.endShape(p.CLOSE);
    // === END BODY ===

    // === START EYES ===
    p.fill(255);
    p.ellipse(this.getPosX(0, 3 * Math.PI / 5, -7), this.getPosY(0, 3 * Math.PI / 5, -7), 24, 24);
    p.ellipse(this.getPosX(0, -3 * Math.PI / 5, -7), this.getPosY(0, -3 * Math.PI / 5, -7), 24, 24);
    // === END EYES ===
  }

  debugDisplay(p: p5): void {
    this.spine.display(p);
  }

  getPosX(i: number, angleOffset: number, lengthOffset: number): number {
    return this.spine.joints[i].x + Math.cos(this.spine.angles[i] + angleOffset) * (this.bodyWidth[i] + lengthOffset);
  }

  getPosY(i: number, angleOffset: number, lengthOffset: number): number {
    return this.spine.joints[i].y + Math.sin(this.spine.angles[i] + angleOffset) * (this.bodyWidth[i] + lengthOffset);
  }
}
