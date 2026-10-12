const { add } = require('./sum');

describe('add', () => {
  test('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('handles negative numbers', () => {
    expect(add(-2, -3)).toBe(-5);
  });

  test('handles zero', () => {
    expect(add(0, 5)).toBe(5);
  });
});
