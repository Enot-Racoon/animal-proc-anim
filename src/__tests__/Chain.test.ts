import { describe, it, expect } from 'vitest';
import { Chain } from '../Chain';
import p5 from 'p5';

describe('Chain', () => {
  const origin = new p5.Vector(100, 100);

  describe('constructor', () => {
    it('should create chain with correct number of joints', () => {
      const chain = new Chain(origin, 5, 50);
      expect(chain.joints.length).toBe(5);
      expect(chain.angles.length).toBe(5);
    });

    it('should initialize first joint at origin', () => {
      const chain = new Chain(origin, 3, 50);
      expect(chain.joints[0].x).toBeCloseTo(origin.x);
      expect(chain.joints[0].y).toBeCloseTo(origin.y);
    });

    it('should space joints by linkSize', () => {
      const chain = new Chain(origin, 3, 50);
      expect(chain.joints[1].y - chain.joints[0].y).toBeCloseTo(50);
      expect(chain.joints[2].y - chain.joints[1].y).toBeCloseTo(50);
    });

    it('should initialize all angles to 0', () => {
      const chain = new Chain(origin, 4, 50);
      chain.angles.forEach(angle => {
        expect(angle).toBe(0);
      });
    });

    it('should use default angle constraint of TWO_PI', () => {
      const chain = new Chain(origin, 3, 50);
      expect(chain.angleConstraint).toBeCloseTo(Math.PI * 2);
    });

    it('should accept custom angle constraint', () => {
      const chain = new Chain(origin, 3, 50, Math.PI / 8);
      expect(chain.angleConstraint).toBeCloseTo(Math.PI / 8);
    });
  });

  describe('resolve', () => {
    it('should move head to target position', () => {
      const chain = new Chain(origin, 3, 50);
      const target = new p5.Vector(150, 120);
      
      chain.resolve(target);
      
      expect(chain.joints[0].x).toBeCloseTo(target.x);
      expect(chain.joints[0].y).toBeCloseTo(target.y);
    });

    it('should update head angle to face target', () => {
      const chain = new Chain(origin, 3, 50);
      const target = new p5.Vector(200, 100); // Directly to the right
      
      chain.resolve(target);
      
      expect(chain.angles[0]).toBeCloseTo(0);
    });

    it('should maintain link distances', () => {
      const chain = new Chain(origin, 5, 50, Math.PI / 8);
      const target = new p5.Vector(300, 200);
      
      chain.resolve(target);
      
      for (let i = 1; i < chain.joints.length; i++) {
        const dist = p5.Vector.dist(chain.joints[i], chain.joints[i - 1]);
        expect(dist).toBeCloseTo(50);
      }
    });

    it('should respect angle constraints', () => {
      const maxAngleDiff = Math.PI / 8;
      const chain = new Chain(origin, 10, 50, maxAngleDiff);
      const target = new p5.Vector(500, 300);
      
      chain.resolve(target);
      
      for (let i = 1; i < chain.angles.length; i++) {
        const diff = Math.abs(chain.angles[i] - chain.angles[i - 1]);
        const normalizedDiff = diff > Math.PI ? Math.PI * 2 - diff : diff;
        expect(normalizedDiff).toBeLessThanOrEqual(maxAngleDiff + 0.001);
      }
    });
  });

  describe('fabrikResolve', () => {
    it('should position head near target', () => {
      // Use a longer chain to ensure reachability
      const chain = new Chain(origin, 10, 50);
      const target = new p5.Vector(150, 80);
      const anchor = new p5.Vector(100, 300);

      chain.fabrikResolve(target, anchor);

      // FABRIK may not reach exact target due to chain length constraints
      // but should be reasonably close (within 20 pixels)
      const distToTarget = p5.Vector.dist(chain.joints[0], target);
      expect(distToTarget).toBeLessThan(20);
    });

    it('should position end at anchor', () => {
      // Use a longer chain to ensure reachability
      const chain = new Chain(origin, 10, 50);
      const target = new p5.Vector(150, 80);
      const anchor = new p5.Vector(100, 300);

      chain.fabrikResolve(target, anchor);

      const distToAnchor = p5.Vector.dist(chain.joints[chain.joints.length - 1], anchor);
      expect(distToAnchor).toBeLessThan(20);
    });

    it('should maintain link distances', () => {
      // Use a longer chain to ensure reachability
      const chain = new Chain(origin, 10, 50);
      const target = new p5.Vector(150, 80);
      const anchor = new p5.Vector(100, 300);

      chain.fabrikResolve(target, anchor);

      for (let i = 1; i < chain.joints.length; i++) {
        const dist = p5.Vector.dist(chain.joints[i], chain.joints[i - 1]);
        expect(dist).toBeCloseTo(50);
      }
    });

    it('should create valid IK chain between target and anchor', () => {
      const chain = new Chain(origin, 6, 40);
      const target = new p5.Vector(120, 60);
      const anchor = new p5.Vector(80, 280);
      
      chain.fabrikResolve(target, anchor);
      
      // All joints should be between target and anchor
      chain.joints.forEach(joint => {
        expect(joint.x).toBeGreaterThanOrEqual(Math.min(target.x, anchor.x) - 50);
        expect(joint.x).toBeLessThanOrEqual(Math.max(target.x, anchor.x) + 50);
      });
    });
  });

  describe('linkSize property', () => {
    it('should store the correct link size', () => {
      const chain = new Chain(origin, 3, 75);
      expect(chain.linkSize).toBe(75);
    });
  });
});
