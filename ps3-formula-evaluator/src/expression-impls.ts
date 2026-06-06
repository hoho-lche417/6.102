/**
 * expression-impls.ts
 *
 * Concrete variant classes that implement MemeExpression.
 * These classes form the recursive data type definition.
 *
 * Problem 1: Define these variant classes.
 *
 * REQUIREMENTS:
 *   ✓ Each variant must be immutable (readonly fields, no setters)
 *   ✓ Each must implement MemeExpression (toString, equalValue)
 *   ✓ toString() must be recursive and not use instanceof
 *   ✓ equalValue() must be recursive and SHOULD use instanceof
 *   ✓ Each must have TypeDoc specs for the class and each method
 *   ✓ Each must document AF, RI, SRE near the fields
 *   ✓ Each should implement checkRep() to verify the invariant
 *
 * ITERATE:
 *   Start with just Number and Variable.
 *   Write tests for those.
 *   Then add BinaryOp and test operator precedence.
 *   Then add UnaryOp and FunctionCall as you need them.
 */

import { MemeExpression } from './expression';

// ─────────────────────────────────────────────────────────────────────────────
// Data type definition
// ─────────────────────────────────────────────────────────────────────────────
//
// MemeExpression = Number(value: number)
//                | Variable(name: string)
//                | BinaryOp(left: MemeExpression, op: string, right: MemeExpression)
//                | UnaryOp(op: string, operand: MemeExpression)
//                | FunctionCall(name: string, args: MemeExpression[])
//
// Problem 1.1: Implement each variant class below.

/**
 * A numeric literal in an expression, like 42 or 3.14.
 *
 * Immutable. Examples:
 *   new Number(42)
 *   new Number(-1.5)
 *   new Number(0)
 */
export class Number implements MemeExpression {
  // Rep:
  //   value: the numeric value
  // AF: represents the numeric literal value
  // RI: value is a finite number
  // SRE: value is readonly and immutable

  public constructor(readonly value: number) {
    this.checkRep();
  }

  private checkRep(): void {
    if (!isFinite(this.value)) {
      throw new Error(`invalid number: ${this.value}`);
    }
  }

  public toString(): string {
    throw new Error('implement me! (Problem 1)');
  }

  public equalValue(other: unknown): boolean {
    throw new Error('implement me! (Problem 1)');
  }
}

/**
 * A variable in an expression, like x or radius.
 *
 * Immutable. Examples:
 *   new Variable("x")
 *   new Variable("radius")
 *   new Variable("theta")
 *
 * Variable names must match [a-zA-Z_][a-zA-Z0-9_]*
 */
export class Variable implements MemeExpression {
  public constructor(readonly name: string) {
    this.checkRep();
  }

  private checkRep(): void {
    if (!this.isValidName(this.name)) {
      throw new Error(`invalid variable name: ${this.name}`);
    }
  }

  private isValidName(s: string): boolean {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s);
  }

  public toString(): string {
    throw new Error('implement me! (Problem 1)');
  }

  public equalValue(other: unknown): boolean {
    throw new Error('implement me! (Problem 1)');
  }
}

/**
 * A binary operation in an expression, like a+b or x*y.
 *
 * Immutable. Examples:
 *   new BinaryOp(new Number(2), "+", new Number(3))
 *   new BinaryOp(new Variable("x"), "*", new Number(2))
 *
 * Valid operators: "+", "-", "*", "/", "^" (power)
 *
 * IMPORTANT for toString():
 *   Operator precedence (highest to lowest): ^ > {*, /} > {+, -}
 *   You may need to add parentheses around lower-precedence operators
 *   when they appear as sub-expressions of higher-precedence operators.
 */
export class BinaryOp implements MemeExpression {
  public constructor(
    readonly left: MemeExpression,
    readonly op: string,
    readonly right: MemeExpression
  ) {
    this.checkRep();
  }

  private checkRep(): void {
    if (!['+ ', '-', '*', '/', '^'].includes(this.op)) {
      throw new Error(`invalid operator: ${this.op}`);
    }
  }

  private precedence(op: string): number {
    if (op === '^') return 3;
    if (op === '*' || op === '/') return 2;
    if (op === '+' || op === '-') return 1;
    return 0;
  }

  public toString(): string {
    throw new Error('implement me! (Problem 1)');
  }

  public equalValue(other: unknown): boolean {
    throw new Error('implement me! (Problem 1)');
  }
}

/**
 * A unary operation in an expression, like -x (negation).
 *
 * Immutable. Examples:
 *   new UnaryOp("-", new Variable("x"))
 *   new UnaryOp("-", new Number(5))
 *
 * Valid operators: "-" (negation)
 */
export class UnaryOp implements MemeExpression {
  public constructor(readonly op: string, readonly operand: MemeExpression) {
    this.checkRep();
  }

  private checkRep(): void {
    if (this.op !== '-') {
      throw new Error(`invalid unary operator: ${this.op}`);
    }
  }

  public toString(): string {
    throw new Error('implement me! (Problem 1)');
  }

  public equalValue(other: unknown): boolean {
    throw new Error('implement me! (Problem 1)');
  }
}

/**
 * A function call in an expression, like sin(x) or sqrt(a^2 + b^2).
 *
 * Immutable. Examples:
 *   new FunctionCall("sin", [new Variable("x")])
 *   new FunctionCall("sqrt", [new BinaryOp(...)])
 *
 * Valid functions: "sin", "cos", "sqrt", "abs"
 * Arguments must be a non-empty array.
 */
export class FunctionCall implements MemeExpression {
  public constructor(readonly name: string, readonly args: readonly MemeExpression[]) {
    this.checkRep();
  }

  private checkRep(): void {
    const validFunctions = ['sin', 'cos', 'sqrt', 'abs'];
    if (!validFunctions.includes(this.name)) {
      throw new Error(`invalid function: ${this.name}`);
    }
    if (this.args.length === 0) {
      throw new Error('function call must have at least one argument');
    }
  }

  public toString(): string {
    throw new Error('implement me! (Problem 1)');
  }

  public equalValue(other: unknown): boolean {
    throw new Error('implement me! (Problem 1)');
  }
}
