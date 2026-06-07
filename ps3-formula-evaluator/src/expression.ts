/**
 * expression.ts
 *
 * Defines the MemeExpression recursive data type for mathematical expressions.
 * An expression is an abstract syntax tree (AST) representing a formula like:
 *   2 + 3 * x
 *   sin(x) + cos(y)
 *   (a + b) / (c - d)
 *
 * The variants of MemeExpression are defined in expression-impls.ts.
 *
 * READ THIS FILE before implementing expression-impls.ts.
 */

import { parseExpression } from './parser'

/**
 * An immutable, recursive abstract syntax tree representing a mathematical expression.
 *
 * MemeExpression has several variants:
 *   - Number: a numeric literal like 42 or 3.14
 *   - Variable: a named variable like x or radius
 *   - BinaryOp: a binary operation like a+b or x*y (with op: +, -, *, /, ^)
 *   - UnaryOp: a unary operation like -x (with op: -)
 *   - FunctionCall: a function call like sin(x) or sqrt(y)
 *
 * The concrete variant classes are part of the rep and are considered internal.
 * Tests should create MemeExpression values using parse() (Problem 2) once available,
 * or using helper creator functions (if you define them in Problem 1.1).
 */
export interface MemeExpression {

  /**
   * Return a string representation of this expression that is a valid formula.
   *
   * The output must be unambiguous and have the same meaning as the original.
   * You may use minimal parentheses (only where necessary for correctness).
   * Whitespace is optional and unspecified.
   *
   * Examples:
   *   Number(42).toString()  →  "42"
   *   BinaryOp(Number(2), "+", Number(3)).toString()  →  "2 + 3"
   *   BinaryOp(Number(2), "+", BinaryOp(Number(3), "*", Number(4))).toString()
   *     →  "2 + 3 * 4"   (no parens needed; * has higher precedence)
   *   BinaryOp(BinaryOp(Number(2), "+", Number(3)), "*", Number(4)).toString()
   *     →  "(2 + 3) * 4"  (parens needed; + has lower precedence)
   *
   * toString() must be recursive and must NOT use instanceof.
   *
   * @returns a valid expression string with the same meaning as this AST
   */
  toString(): string;

  /**
   * Return true iff this expression is structurally equal to other.
   *
   * Structural equality means:
   *   - Same variants (both Number, both BinaryOp, etc.)
   *   - Same fields (literals, operators, names, argument lists)
   *   - Same grouping (e.g., (a+b)*c ≠ a+(b*c), but a+b = (a+b))
   *
   * Examples:
   *   parse("2 + 3").equalValue(parse("2 + 3"))  →  true
   *   parse("2 + 3").equalValue(parse("2+3"))    →  true (spacing ignored in parsing)
   *   parse("(2 + 3) * 4").equalValue(parse("2 + 3 * 4"))  →  false (different grouping)
   *   parse("x + 1").equalValue(parse("y + 1"))  →  false (different variable)
   *
   * equalValue() must be recursive and SHOULD use instanceof to test variants.
   *
   * @param other the other expression to compare
   * @returns true iff structurally equal
   */
  equalValue(other: unknown): boolean;
}

/**
 * Parse a string into a MemeExpression.
 *
 * Valid expressions follow the grammar specified in parser.ts.
 * Operator precedence (highest to lowest): ^ > {*, /} > {+, -}
 * Parentheses can override precedence.
 * Whitespace is ignored.
 *
 * Examples:
 *   parse("42")  →  Number(42)
 *   parse("x + 1")  →  BinaryOp(Variable("x"), "+", Number(1))
 *   parse("2 + 3 * 4")  →  BinaryOp(Number(2), "+", BinaryOp(Number(3), "*", Number(4)))
 *   parse("sin(x)")  →  FunctionCall("sin", [Variable("x")])
 *   parse("sqrt(x^2 + y^2)")  →  FunctionCall("sqrt", [BinaryOp(...)])
 *
 * Problem 2: Implement this function.
 * You should move the implementation details to parser.ts.
 *
 * @param input a string containing a mathematical expression
 * @returns the abstract syntax tree for the expression
 * @throws Error if the input is not a valid expression
 */
export function parse(input: string): MemeExpression {
  return parseExpression(input);
}

/**
 * Evaluate an expression given variable values.
 *
 * Problem 3: Implement this function as a method on MemeExpression,
 * defined recursively in expression-impls.ts.
 *
 * For now, this is just a placeholder showing the intended signature.
 *
 * @param expr the expression to evaluate
 * @param values a map from variable names to their numeric values
 * @returns the numeric result of evaluating the expression
 * @throws Error if the expression references undefined variables or divides by zero
 */
export function evaluate(expr: MemeExpression, values: Map<string, number>): number {
  throw new Error('implement me! (Problem 3)');
}
