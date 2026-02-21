import p5 from 'p5';
import { constrainAngle, constrainDistance } from './Util';

const TWO_PI = Math.PI * 2;

/**
 * Chain class represents a series of connected joints (inverse kinematics chain)
 * Used for procedural animation of animal spines and limbs
 */
export class Chain {
  joints: p5.Vector[];
  linkSize: number; // Space between joints

  // Only used in non-FABRIK resolution
  angles: number[];
  angleConstraint: number; // Max angle diff between two adjacent joints, higher = loose, lower = rigid

  constructor(origin: p5.Vector, jointCount: number, linkSize: number, angleConstraint: number = TWO_PI) {
    this.linkSize = linkSize;
    this.angleConstraint = angleConstraint;
    this.joints = [];
    this.angles = [];
    
    this.joints.push(origin.copy());
    this.angles.push(0);
    
    for (let i = 1; i < jointCount; i++) {
      this.joints.push(p5.Vector.add(this.joints[i - 1], new p5.Vector(0, this.linkSize)));
      this.angles.push(0);
    }
  }

  /**
   * Resolve the chain using forward kinematics with angle constraints
   * The head follows the target position
   */
  resolve(pos: p5.Vector): void {
    this.angles[0] = p5.Vector.sub(pos, this.joints[0]).heading();
    this.joints[0] = pos.copy();
    
    for (let i = 1; i < this.joints.length; i++) {
      const curAngle = p5.Vector.sub(this.joints[i - 1], this.joints[i]).heading();
      this.angles[i] = constrainAngle(curAngle, this.angles[i - 1], this.angleConstraint);
      this.joints[i] = p5.Vector.sub(
        this.joints[i - 1],
        p5.Vector.fromAngle(this.angles[i]).setMag(this.linkSize)
      );
    }
  }

  /**
   * FABRIK (Forward And Backward Reaching Inverse Kinematics) resolution
   * Used for limbs where both ends are constrained
   */
  fabrikResolve(pos: p5.Vector, anchor: p5.Vector): void {
    // Forward pass
    this.joints[0] = pos.copy();
    for (let i = 1; i < this.joints.length; i++) {
      this.joints[i] = constrainDistance(this.joints[i], this.joints[i - 1], this.linkSize);
    }

    // Backward pass
    this.joints[this.joints.length - 1] = anchor.copy();
    for (let i = this.joints.length - 2; i >= 0; i--) {
      this.joints[i] = constrainDistance(this.joints[i], this.joints[i + 1], this.linkSize);
    }
  }

  /**
   * Debug display - shows the chain structure
   */
  display(p: p5): void {
    p.strokeWeight(8);
    p.stroke(255);
    for (let i = 0; i < this.joints.length - 1; i++) {
      const startJoint = this.joints[i];
      const endJoint = this.joints[i + 1];
      p.line(startJoint.x, startJoint.y, endJoint.x, endJoint.y);
    }

    p.fill(42, 44, 53);
    for (const joint of this.joints) {
      p.ellipse(joint.x, joint.y, 32, 32);
    }
  }
}
