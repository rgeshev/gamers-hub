import { it , expect } from 'vitest';
import * as calc from '../utils/calcUtils';

it('should add numbers correctly', () => {
    // Arrange
    const a = 5;
    const b = 3;
    const expected = 8;

    // Act
    const actual = calc.add(a, b);

    // Assert
    expect(actual).toBe(expected);
});

it('should subtract numbers correctly', () => {
    expect(calc.subtract(5, 3)).toBe(2);
});

it('should multiply numbers correctly', () => {
    expect(calc.multiply(5, 3)).toBe(15);
});

it('should divide numbers correctly', () => {
    expect(calc.divide(15, 3)).toBe(5);
});

