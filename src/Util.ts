import p5 from 'p5';

const TWO_PI = Math.PI * 2;

/**
 * Constrain the vector to be at a certain distance from the anchor
 */
export function constrainDistance(pos: p5.Vector, anchor: p5.Vector, constraint: number): p5.Vector {
  return p5.Vector.add(anchor, p5.Vector.sub(pos, anchor).setMag(constraint));
}

/**
 * Constrain the angle to be within a certain range of the anchor
 */
export function constrainAngle(angle: number, anchor: number, constraint: number): number {
  if (Math.abs(relativeAngleDiff(angle, anchor)) <= constraint) {
    return simplifyAngle(angle);
  }

  if (relativeAngleDiff(angle, anchor) > constraint) {
    return simplifyAngle(anchor - constraint);
  }

  return simplifyAngle(anchor + constraint);
}

/**
 * How many radians do you need to turn the angle to match the anchor?
 * Since angles are represented by values in [0, 2pi), it's helpful to rotate
 * the coordinate space such that PI is at the anchor. That way we don't have
 * to worry about the "seam" between 0 and 2pi.
 */
export function relativeAngleDiff(angle: number, anchor: number): number {
  angle = simplifyAngle(angle + Math.PI - anchor);
  anchor = Math.PI;

  return anchor - angle;
}

/**
 * Simplify the angle to be in the range [0, 2pi)
 */
export function simplifyAngle(angle: number): number {
  while (angle >= TWO_PI) {
    angle -= TWO_PI;
  }

  while (angle < 0) {
    angle += TWO_PI;
  }

  return angle;
}
