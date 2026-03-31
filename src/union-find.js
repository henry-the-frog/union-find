// union-find.js — Disjoint Set with path compression and union by rank

export class UnionFind {
  constructor(n) {
    this._parent = new Int32Array(n);
    this._rank = new Int32Array(n);
    this._size = new Int32Array(n).fill(1);
    this._count = n;
    for (let i = 0; i < n; i++) this._parent[i] = i;
  }

  // Find with path compression
  find(x) {
    while (this._parent[x] !== x) {
      this._parent[x] = this._parent[this._parent[x]]; // Path halving
      x = this._parent[x];
    }
    return x;
  }

  // Union by rank
  union(x, y) {
    const rx = this.find(x), ry = this.find(y);
    if (rx === ry) return false;

    if (this._rank[rx] < this._rank[ry]) {
      this._parent[rx] = ry;
      this._size[ry] += this._size[rx];
    } else if (this._rank[rx] > this._rank[ry]) {
      this._parent[ry] = rx;
      this._size[rx] += this._size[ry];
    } else {
      this._parent[ry] = rx;
      this._size[rx] += this._size[ry];
      this._rank[rx]++;
    }

    this._count--;
    return true;
  }

  connected(x, y) { return this.find(x) === this.find(y); }
  get count() { return this._count; } // Number of disjoint sets
  componentSize(x) { return this._size[this.find(x)]; }

  // Get all components
  components() {
    const groups = new Map();
    for (let i = 0; i < this._parent.length; i++) {
      const root = this.find(i);
      if (!groups.has(root)) groups.set(root, []);
      groups.get(root).push(i);
    }
    return [...groups.values()];
  }
}

// Named union-find (string keys)
export class NamedUnionFind {
  constructor() {
    this._parent = new Map();
    this._rank = new Map();
    this._setCount = 0;
  }

  _ensure(name) {
    if (!this._parent.has(name)) {
      this._parent.set(name, name);
      this._rank.set(name, 0);
      this._setCount++;
    }
  }

  find(x) {
    this._ensure(x);
    while (this._parent.get(x) !== x) {
      this._parent.set(x, this._parent.get(this._parent.get(x)));
      x = this._parent.get(x);
    }
    return x;
  }

  union(a, b) {
    const ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;
    if (this._rank.get(ra) < this._rank.get(rb)) this._parent.set(ra, rb);
    else if (this._rank.get(ra) > this._rank.get(rb)) this._parent.set(rb, ra);
    else { this._parent.set(rb, ra); this._rank.set(ra, this._rank.get(ra) + 1); }
    this._setCount--;
    return true;
  }

  connected(a, b) {
    if (!this._parent.has(a) || !this._parent.has(b)) return false;
    return this.find(a) === this.find(b);
  }

  get count() { return this._setCount; }
}
