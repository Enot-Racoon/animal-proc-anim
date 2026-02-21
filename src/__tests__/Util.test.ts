import { describe, it, expect } from 'vitest';
import { simplifyAngle, relativeAngleDiff, constrainAngle, constrainDistance } from '../Util';
import p5 from 'p5';

describe('Util', () => {
  describe('simplifyAngle', () => {
    it('should keep angles in [0, 2PI) range', () => {
      expect(simplifyAngle(0)).toBeCloseTo(0);
      expect(simplifyAngle(Math.PI)).toBeCloseTo(Math.PI);
      expect(simplifyAngle(Math.PI * 2)).toBeCloseTo(0);
      expect(simplifyAngle(Math.PI * 3)).toBeCloseTo(Math.PI);
    });

    it('should handle negative angles', () => {
      expect(simplifyAngle(-Math.PI)).toBeCloseTo(Math.PI);
      expect(simplifyAngle(-Math.PI * 2)).toBeCloseTo(0);
      expect(simplifyAngle(-Math.PI / 2)).toBeCloseTo(Math.PI * 1.5);
    });

    it('should handle large positive angles', () => {
      expect(simplifyAngle(Math.PI * 5)).toBeCloseTo(Math.PI);
      expect(simplifyAngle(Math.PI * 10)).toBeCloseTo(0);
    });
  });

  describe('relativeAngleDiff', () => {
    it('should return 0 for identical angles', () => {
      expect(relativeAngleDiff(0, 0)).toBeCloseTo(0);
      expect(relativeAngleDiff(Math.PI, Math.PI)).toBeCloseTo(0);
      expect(relativeAngleDiff(Math.PI / 2, Math.PI / 2)).toBeCloseTo(0);
    });

    it('should calculate correct difference', () => {
      expect(relativeAngleDiff(Math.PI / 2, 0)).toBeCloseTo(-Math.PI / 2);
      expect(relativeAngleDiff(0, Math.PI / 2)).toBeCloseTo(Math.PI / 2);
    });

    it('should handle angle wrapping correctly', () => {
      // Test angles near the 0/2PI seam
      expect(relativeAngleDiff(0.1, Math.PI * 2 - 0.1)).toBeCloseTo(0.2, 0);
      expect(relativeAngleDiff(Math.PI * 2 - 0.1, 0.1)).toBeCloseTo(-0.2, 0);
    });
  });

  describe('constrainAngle', () => {
    it('should not modify angle within constraint', () => {
      const result = constrainAngle(Math.PI / 4, 0, Math.PI / 2);
      expect(result).toBeCloseTo(Math.PI / 4);
    });

    it('should constrain angle that exceeds positive constraint', () => {
      const result = constrainAngle(Math.PI / 2, 0, Math.PI / 4);
      expect(result).toBeCloseTo(Math.PI / 4);
    });

    it('should constrain angle that exceeds negative constraint', () => {
      const result = constrainAngle(-Math.PI / 2, 0, Math.PI / 4);
      expect(result).toBeCloseTo(Math.PI * 2 - Math.PI / 4);
    });

    it('should handle constraint at PI', () => {
      // When constraining PI with anchor 0 and constraint PI/8,
      // the result wraps around to 2*PI - PI/8 (shortest path to constraint)
      const result = constrainAngle(Math.PI, 0, Math.PI / 8);
      expect(result).toBeCloseTo(Math.PI * 2 - Math.PI / 8);
    });
  });

  describe('constrainDistance', () => {
    it('should constrain vector to exact distance from anchor', () => {
      const pos = new p5.Vector(10, 0);
      const anchor = new p5.Vector(0, 0);
      const result = constrainDistance(pos, anchor, 5);
      
      expect(result.mag()).toBeCloseTo(5);
      expect(result.x).toBeCloseTo(5);
      expect(result.y).toBeCloseTo(0);
    });

    it('should work with non-zero anchor', () => {
      const pos = new p5.Vector(20, 10);
      const anchor = new p5.Vector(10, 10);
      const result = constrainDistance(pos, anchor, 5);
      
      expect(p5.Vector.dist(result, anchor)).toBeCloseTo(5);
    });

    it('should preserve direction', () => {
      const pos = new p5.Vector(10, 10);
      const anchor = new p5.Vector(0, 0);
      const result = constrainDistance(pos, anchor, 5);
      
      const expectedDir = pos.copy().normalize();
      const actualDir = result.copy().normalize();
      
      expect(actualDir.x).toBeCloseTo(expectedDir.x);
      expect(actualDir.y).toBeCloseTo(expectedDir.y);
    });
  });
});
