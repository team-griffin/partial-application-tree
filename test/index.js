import pat from '../src';
import { expect } from 'chai';

describe('pat', function() {
  it('passes a leaf to a node', function() {
    const out = pat([
      ['node', ['leaf']],
    ], {
      leaf: () => 'foo',
      node: (leaf) => leaf(),
    });

    expect(out.node()).to.equal('foo');
  });

  it('passes a nested leaf to a node', function() {
    const out = pat([
      ['node', ['nested.leaf']],
    ], {
      nested: { 
        leaf: () => 'foo',
      },
      node: (leaf) => leaf(),
    });

    expect(out.node()).to.equal('foo');
  });

  it('passes a leaf to a nested node', function() {
    const out = pat([
      ['nested.node', ['leaf']],
    ], {
      leaf: () => 'foo',
      nested: { 
        node: (leaf) => leaf(),
      },
    });

    expect(out.nested.node()).to.equal('foo');
  });

  it('passes a nested leaf to a nested node', function() {
    const out = pat([
      ['nested.node', ['nested.leaf']],
    ], {
      nested: { 
        leaf: () => 'foo',
        node: (leaf) => leaf(),
      },
    });

    expect(out.nested.node()).to.equal('foo');
  });

  it('handles multiple', function() {
    const out = pat([
      ['node', ['leaf1', 'leaf2']],
    ], {
      leaf1: () => 'foo',
      leaf2: () => 'bar',
      node: (leaf1, leaf2) => [leaf1(), leaf2()],
    });

    expect(out.node()).to.eql(['foo', 'bar']);
  });

  it('handles multiple tiers', function() {
    const out = pat([
      ['node', ['leaf']],
      ['root', ['node']],
    ], {
      leaf: () => 'foo',
      node: (leaf) => leaf() + 'bar',
      root: (node) => node() + 'baz',
    });

    expect(out.root()).to.eql('foobarbaz');
  });
});