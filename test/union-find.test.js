import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { UnionFind, NamedUnionFind } from '../src/index.js';

describe('UnionFind', () => {
  it('should start disconnected', () => {
    const uf = new UnionFind(5);
    assert.equal(uf.count, 5);
    assert.equal(uf.connected(0, 1), false);
  });
  it('should union elements', () => {
    const uf = new UnionFind(5);
    uf.union(0, 1);
    assert.equal(uf.connected(0, 1), true);
    assert.equal(uf.count, 4);
  });
  it('should handle transitive connectivity', () => {
    const uf = new UnionFind(5);
    uf.union(0, 1);
    uf.union(1, 2);
    assert.equal(uf.connected(0, 2), true);
  });
  it('should return false for redundant union', () => {
    const uf = new UnionFind(3);
    uf.union(0, 1);
    assert.equal(uf.union(0, 1), false);
  });
  it('should track component size', () => {
    const uf = new UnionFind(5);
    uf.union(0, 1);
    uf.union(1, 2);
    assert.equal(uf.componentSize(0), 3);
    assert.equal(uf.componentSize(3), 1);
  });
  it('should list components', () => {
    const uf = new UnionFind(5);
    uf.union(0, 1);
    uf.union(2, 3);
    const comps = uf.components();
    assert.equal(comps.length, 3); // {0,1}, {2,3}, {4}
  });
});

describe('Performance', () => {
  it('should handle 10000 elements', () => {
    const uf = new UnionFind(10000);
    for (let i = 0; i < 9999; i++) uf.union(i, i + 1);
    assert.equal(uf.count, 1);
    assert.equal(uf.connected(0, 9999), true);
  });
});

describe('NamedUnionFind', () => {
  it('should union by name', () => {
    const uf = new NamedUnionFind();
    uf.union('alice', 'bob');
    assert.equal(uf.connected('alice', 'bob'), true);
    assert.equal(uf.connected('alice', 'charlie'), false);
  });
  it('should track count', () => {
    const uf = new NamedUnionFind();
    uf.union('a', 'b');
    uf.union('c', 'd');
    assert.equal(uf.count, 2);
  });
});

describe('Kruskal example', () => {
  it('should find MST edges', () => {
    // Edges sorted by weight
    const edges = [[0,1,1], [1,2,2], [0,2,3], [2,3,4]];
    const uf = new UnionFind(4);
    const mst = [];
    for (const [u, v, w] of edges) {
      if (uf.union(u, v)) mst.push([u, v, w]);
    }
    assert.equal(mst.length, 3);
    assert.equal(mst.reduce((s, [,,w]) => s + w, 0), 7); // 1+2+4
  });
});
