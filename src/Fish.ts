import p5 from 'p5';
import { Chain } from './Chain';
import { relativeAngleDiff } from './Util';

/**
 * Fish - procedural animated fish that follows the mouse
 */
export class Fish {
  spine: Chain;

  bodyColor: p5.Color;
  finColor: p5.Color;

  // Width of the fish at each vertebra
  bodyWidth: number[] = [68, 81, 84, 83, 77, 64, 51, 38, 32, 19];

  constructor(origin: p5.Vector) {
    // 12 segments, first 10 for body, last 2 for caudal fin
    this.spine = new Chain(origin, 12, 64, Math.PI / 8);

    // Colors will be initialized later in display using p5 instance
    this.bodyColor = undefined as unknown as p5.Color;
    this.finColor = undefined as unknown as p5.Color;
  }

  resolve(p: p5): void {
    const headPos = this.spine.joints[0];
    const mousePos = new p5.Vector(p.mouseX, p.mouseY);
    const targetPos = p5.Vector.add(headPos, p5.Vector.sub(mousePos, headPos).setMag(16));
    this.spine.resolve(targetPos);
  }

  display(p: p5): void {
    // Initialize colors on first display using p5 instance
    if (!this.bodyColor) {
      this.bodyColor = p.color(58, 124, 165);
      this.finColor = p.color(129, 195, 215);
    }

    p.strokeWeight(4);
    p.stroke(255);
    p.fill(this.finColor);

    // Relative angle differences are used in some hacky computation for the dorsal fin
    const headToMid1 = relativeAngleDiff(this.spine.angles[0], this.spine.angles[6]);
    const headToMid2 = relativeAngleDiff(this.spine.angles[0], this.spine.angles[7]);

    // For the caudal fin, we need to compute the relative angle difference from the head to the tail, but given
    // a joint count of 12 and angle constraint of PI/8, the maximum difference between head and tail is 11PI/8,
    // which is >PI. This complicates the relative angle calculation (flips the sign when curving too tightly).
    // A quick workaround is to compute the angle difference from the head to the middle of the fish, and then
    // from the middle of the fish to the tail.
    const headToTail = headToMid1 + relativeAngleDiff(this.spine.angles[6], this.spine.angles[11]);

    // === START PECTORAL FINS ===
    p.push();
    p.translate(this.getPosX(3, Math.PI / 3, 0), this.getPosY(3, Math.PI / 3, 0));
    p.rotate(this.spine.angles[2] - Math.PI / 4);
    p.ellipse(0, 0, 160, 64); // Right
    p.pop();
    
    p.push();
    p.translate(this.getPosX(3, -Math.PI / 3, 0), this.getPosY(3, -Math.PI / 3, 0));
    p.rotate(this.spine.angles[2] + Math.PI / 4);
    p.ellipse(0, 0, 160, 64); // Left
    p.pop();
    // === END PECTORAL FINS ===

    // === START VENTRAL FINS ===
    p.push();
    p.translate(this.getPosX(7, Math.PI / 2, 0), this.getPosY(7, Math.PI / 2, 0));
    p.rotate(this.spine.angles[6] - Math.PI / 4);
    p.ellipse(0, 0, 96, 32); // Right
    p.pop();
    
    p.push();
    p.translate(this.getPosX(7, -Math.PI / 2, 0), this.getPosY(7, -Math.PI / 2, 0));
    p.rotate(this.spine.angles[6] + Math.PI / 4);
    p.ellipse(0, 0, 96, 32); // Left
    p.pop();
    // === END VENTRAL FINS ===

    // === START CAUDAL FINS ===
    p.beginShape();
    // "Bottom" of the fish
    for (let i = 8; i < 12; i++) {
      const tailWidth = 1.5 * headToTail * (i - 8) * (i - 8);
      p.curveVertex(
        this.spine.joints[i].x + Math.cos(this.spine.angles[i] - Math.PI / 2) * tailWidth,
        this.spine.joints[i].y + Math.sin(this.spine.angles[i] - Math.PI / 2) * tailWidth
      );
    }

    // "Top" of the fish
    for (let i = 11; i >= 8; i--) {
      const tailWidth = Math.max(-13, Math.min(13, headToTail * 6));
      p.curveVertex(
        this.spine.joints[i].x + Math.cos(this.spine.angles[i] + Math.PI / 2) * tailWidth,
        this.spine.joints[i].y + Math.sin(this.spine.angles[i] + Math.PI / 2) * tailWidth
      );
    }
    p.endShape(p.CLOSE);
    // === END CAUDAL FINS ===

    p.fill(this.bodyColor);

    // === START BODY ===
    p.beginShape();

    // Right half of the fish
    for (let i = 0; i < 10; i++) {
      p.curveVertex(this.getPosX(i, Math.PI / 2, 0), this.getPosY(i, Math.PI / 2, 0));
    }

    // Bottom of the fish
    p.curveVertex(this.getPosX(9, Math.PI, 0), this.getPosY(9, Math.PI, 0));

    // Left half of the fish
    for (let i = 9; i >= 0; i--) {
      p.curveVertex(this.getPosX(i, -Math.PI / 2, 0), this.getPosY(i, -Math.PI / 2, 0));
    }

    // Top of the head (completes the loop)
    p.curveVertex(this.getPosX(0, -Math.PI / 6, 0), this.getPosY(0, -Math.PI / 6, 0));
    p.curveVertex(this.getPosX(0, 0, 4), this.getPosY(0, 0, 4));
    p.curveVertex(this.getPosX(0, Math.PI / 6, 0), this.getPosY(0, Math.PI / 6, 0));

    // Some overlap needed because curveVertex requires extra vertices that are not rendered
    p.curveVertex(this.getPosX(0, Math.PI / 2, 0), this.getPosY(0, Math.PI / 2, 0));
    p.curveVertex(this.getPosX(1, Math.PI / 2, 0), this.getPosY(1, Math.PI / 2, 0));
    p.curveVertex(this.getPosX(2, Math.PI / 2, 0), this.getPosY(2, Math.PI / 2, 0));

    p.endShape(p.CLOSE);
    // === END BODY ===

    p.fill(this.finColor);

    // === START DORSAL FIN ===
    p.beginShape();
    p.vertex(this.spine.joints[4].x, this.spine.joints[4].y);
    p.bezierVertex(
      this.spine.joints[5].x, this.spine.joints[5].y,
      this.spine.joints[6].x, this.spine.joints[6].y,
      this.spine.joints[7].x, this.spine.joints[7].y
    );
    p.bezierVertex(
      this.spine.joints[6].x + Math.cos(this.spine.angles[6] + Math.PI / 2) * headToMid2 * 16,
      this.spine.joints[6].y + Math.sin(this.spine.angles[6] + Math.PI / 2) * headToMid2 * 16,
      this.spine.joints[5].x + Math.cos(this.spine.angles[5] + Math.PI / 2) * headToMid1 * 16,
      this.spine.joints[5].y + Math.sin(this.spine.angles[5] + Math.PI / 2) * headToMid1 * 16,
      this.spine.joints[4].x, this.spine.joints[4].y
    );
    p.endShape();
    // === END DORSAL FIN ===

    // === START EYES ===
    p.fill(255);
    p.ellipse(this.getPosX(0, Math.PI / 2, -18), this.getPosY(0, Math.PI / 2, -18), 24, 24);
    p.ellipse(this.getPosX(0, -Math.PI / 2, -18), this.getPosY(0, -Math.PI / 2, -18), 24, 24);
    // === END EYES ===
  }

  debugDisplay(p: p5): void {
    this.spine.display(p);
  }

  // Various helpers to shorten lines
  getPosX(i: number, angleOffset: number, lengthOffset: number): number {
    return this.spine.joints[i].x + Math.cos(this.spine.angles[i] + angleOffset) * (this.bodyWidth[i] + lengthOffset);
  }

  getPosY(i: number, angleOffset: number, lengthOffset: number): number {
    return this.spine.joints[i].y + Math.sin(this.spine.angles[i] + angleOffset) * (this.bodyWidth[i] + lengthOffset);
  }
}
