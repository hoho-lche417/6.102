/**
 * expression.test.ts
 *
 * Test suite for MemeExpression and its operations.
 *
 * Problems 1, 2, 3: Write tests for each problem before implementing.
 *
 * WORKFLOW:
 *   Problem 1: Create variant classes, write tests for toString() and equalValue()
 *   Problem 2: Implement parse(), add tests for parse()
 *   Problem 3: Implement evaluate(), add tests for evaluate()
 *
 * NOTE ON ITERATION:
 *   For Problem 1, you may need to directly construct variant objects:
 *     const expr = new BinaryOp(new Number(2), "+", new Number(3));
 *   Once you implement parse() in Problem 2, refactor to use it:
 *     const expr = parse("2 + 3");
 *   This way your tests don't import the variant classes after Problem 2.
 */

import assert from 'assert';
import {
  MemeExpression,
  parse,
  evaluate,
} from '../src/expression';
import {
  Number,
  Variable,
  BinaryOp,
  UnaryOp,
  FunctionCall,
} from '../src/expression-impls';

// ─────────────────────────────────────────────────────────────────────────────
// Problem 1: Test toString() and equalValue()
// ─────────────────────────────────────────────────────────────────────────────

describe('Problem 1: toString()', () => {
  // Testing strategy for toString():
  //   Partition on variant type: Number, Variable, BinaryOp, UnaryOp, FunctionCall
  //   Partition on complexity: single variant, nested operators, precedence cases
  //   Partition on output format: minimal parens vs. explicit grouping

  it('Number.toString()', () => {
    assert.strictEqual(new Number(42).toString(), '42');
    assert.strictEqual(new Number(0).toString(), '0');
    assert.strictEqual(new Number(-5).toString(), '-5');
  });

  it('Variable.toString()', () => {
    assert.strictEqual(new Variable('x').toString(), 'x');
    assert.strictEqual(new Variable('radius').toString(), 'radius');
  });

  it('BinaryOp.toString() — simple addition', () => {
    const expr = new BinaryOp(new Number(2), '+', new Number(3));
    // Output must be valid and include the operator:
    const str = expr.toString();
    assert(str.includes('2'), 'should include left operand');
    assert(str.includes('3'), 'should include right operand');
    assert(str.includes('+'), 'should include operator');
  });

  it('BinaryOp.toString() — operator precedence (no parens needed)', () => {
    // 2 + 3 * 4 should format as "2 + 3 * 4" (not "(2 + (3 * 4))")
    // because * has higher precedence than +
    const expr = new BinaryOp(
      new Number(2),
      '+',
      new BinaryOp(new Number(3), '*', new Number(4))
    );
    const str = expr.toString();
    // Verify it doesn't have unnecessary parens around 3*4:
    //assert(!str.includes('(3 * 4)'), 'should not have unnecessary parens around 3*4');
    //assert(!str.includes('(3*4)'), 'should not have unnecessary parens around 3*4');
    assert(!str.includes('(3'), 'should not have unnecessary parens around 3*4');
    assert(!str.includes('4)'), 'should not have unnecessary parens around 3*4');
  });

  it('BinaryOp.toString() — operator precedence (parens needed)', () => {
    // (2 + 3) * 4 should format with parens: "(2 + 3) * 4"
    // because + has lower precedence than *
    const expr = new BinaryOp(
      new BinaryOp(new Number(2), '+', new Number(3)),
      '*',
      new Number(4)
    );
    const str = expr.toString();
    //assert(str.includes('('), 'should include parens around 2+3');
    //assert(str.includes(')'), 'should include parens around 2+3');
    assert(str.includes('(2'), 'should include parens around 2+3');
    assert(str.includes('3)'), 'should include parens around 2+3');
  });

  // Add more tests for UnaryOp and FunctionCall...
  it('UnaryOp.toString() — simple negation', () => {
    const expr = new UnaryOp('-', new Variable('x'));
    const str = expr.toString();

    assert(str.includes('-'));
    assert(str.includes('x'));
  });

  it('UnaryOp.toString() — negated binary expression needs parens', () => {
      const expr = new UnaryOp(
          '-',
          new BinaryOp(new Number(2), '+', new Number(3))
      );

      const str = expr.toString();

      assert(str.includes('(2'));
      assert(str.includes('3)'));
  });

  it('FunctionCall.toString() — simple function', () => {
    const expr = new FunctionCall('sin', [new Variable('x')]);
    
    assert.strictEqual(expr.toString(), 'sin(x)');
  });

  it('FunctionCall.toString() — nested expression argument', () => {
      const expr = new FunctionCall(
          'sqrt',
          [new BinaryOp(new Number(2), '+', new Number(3))]
      );

      const str = expr.toString();

      assert(str.includes('sqrt'));
      assert(str.includes('2'));
      assert(str.includes('3'));
  });

  it('BinaryOp.toString() — exponent binds tighter than multiply', () => {
    const expr = new BinaryOp(
        new Number(2),
        '*',
        new BinaryOp(new Number(3), '^', new Number(4))
    );

    const str = expr.toString();

    assert(!str.includes('(3'));
  });
});

describe('Problem 1: equalValue()', () => {
  // Testing strategy for equalValue():
  //   Partition on variant type and equality: equal, different variant, different value
  //   Partition on structure: same grouping vs. different grouping
  //   Partition on precedence: (a+b)*c vs. a+(b*c)

  it('Number.equalValue() — same value', () => {
    const n1 = new Number(42);
    const n2 = new Number(42);
    assert.strictEqual(n1.equalValue(n2), true);
  });

  it('Number.equalValue() — different value', () => {
    const n1 = new Number(42);
    const n2 = new Number(43);
    assert.strictEqual(n1.equalValue(n2), false);
  });

  it('Variable.equalValue() — same name', () => {
    const v1 = new Variable('x');
    const v2 = new Variable('x');
    assert.strictEqual(v1.equalValue(v2), true);
  });

  it('Variable.equalValue() — different name', () => {
    const v1 = new Variable('x');
    const v2 = new Variable('y');
    assert.strictEqual(v1.equalValue(v2), false);
  });

  it('BinaryOp.equalValue() — same structure', () => {
    const expr1 = new BinaryOp(new Number(2), '+', new Number(3));
    const expr2 = new BinaryOp(new Number(2), '+', new Number(3));
    assert.strictEqual(expr1.equalValue(expr2), true);
  });

  it('BinaryOp.equalValue() — different grouping (a+b)*c vs. a+(b*c)', () => {
    const expr1 = new BinaryOp(
      new BinaryOp(new Number(1), '+', new Number(2)),
      '*',
      new Number(3)
    );
    const expr2 = new BinaryOp(
      new Number(1),
      '+',
      new BinaryOp(new Number(2), '*', new Number(3))
    );
    assert.strictEqual(expr1.equalValue(expr2), false);
  });

  // Add more tests for UnaryOp and FunctionCall...
  it('UnaryOp.equalValue() — same operand', () => {
    const e1 = new UnaryOp('-', new Variable('x'));
    const e2 = new UnaryOp('-', new Variable('x'));

    assert.strictEqual(e1.equalValue(e2), true);
  });

  it('UnaryOp.equalValue() — different operand', () => {
      const e1 = new UnaryOp('-', new Variable('x'));
      const e2 = new UnaryOp('-', new Variable('y'));

      assert.strictEqual(e1.equalValue(e2), false);
  });

  it('FunctionCall.equalValue() — same function and argument', () => {
    const e1 = new FunctionCall('sin', [new Variable('x')]);
    const e2 = new FunctionCall('sin', [new Variable('x')]);

    assert.strictEqual(e1.equalValue(e2), true);
  });

  it('FunctionCall.equalValue() — different function names', () => {
      const e1 = new FunctionCall('sin', [new Variable('x')]);
      const e2 = new FunctionCall('cos', [new Variable('x')]);

      assert.strictEqual(e1.equalValue(e2), false);
  });

  it('FunctionCall.equalValue() — different arguments', () => {
      const e1 = new FunctionCall('sin', [new Variable('x')]);
      const e2 = new FunctionCall('sin', [new Variable('y')]);

      assert.strictEqual(e1.equalValue(e2), false);
  });

  it('equalValue() — Number and Variable are not equal', () => {
    const n = new Number(5);
    const v = new Variable('number_5');

    assert.strictEqual(n.equalValue(v), false);
    assert.strictEqual(v.equalValue(n), false);
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// Problem 2: Test parse()
// ─────────────────────────────────────────────────────────────────────────────

describe('Problem 2: parse()', () => {
  // Testing strategy for parse():
  //   Partition on variant type: number, variable, operator, function
  //   Partition on complexity: single token, simple expression, complex nesting
  //   Partition on operator precedence: correct grouping for + -, * /, ^
  //   Partition on special characters: parentheses, whitespace

  it('parse() — number', () => {
    const expr = parse('42');
    assert.ok(expr instanceof Number);
    assert.strictEqual((expr as any).value, 42);
  });

  it('parse() — variable', () => {
    const expr = parse('x');
    assert.ok(expr instanceof Variable);
    assert.strictEqual((expr as any).name, 'x');
  });

  it('parse() — simple addition', () => {
    const expr = parse('2 + 3');
    assert.ok(expr instanceof BinaryOp);
    assert.strictEqual((expr as any).op, '+');
  });

  it('parse() — operator precedence: 2 + 3 * 4', () => {
    // Should parse as 2 + (3 * 4), not (2 + 3) * 4
    const expr = parse('2 + 3 * 4');
    // Right child of top-level '+' should be the BinaryOp for 3*4:
    assert.strictEqual((expr as any).op, '+');
    assert.ok((expr as any).right instanceof BinaryOp);
    assert.strictEqual(((expr as any).right as any).op, '*');
  });

  it('parse() — parentheses override precedence', () => {
    // Should parse as (2 + 3) * 4, not 2 + (3 * 4)
    const expr = parse('(2 + 3) * 4');
    assert.strictEqual((expr as any).op, '*');
    assert.ok((expr as any).left instanceof BinaryOp);
    assert.strictEqual(((expr as any).left as any).op, '+');
  });

  it('parse() — whitespace is ignored', () => {
    const expr1 = parse('2 + 3');
    const expr2 = parse('2+3');
    assert.strictEqual(expr1.equalValue(expr2), true);
  });

  it('parse() — function call', () => {
    const expr = parse('sin(x)');
    assert.ok(expr instanceof FunctionCall);
    assert.strictEqual((expr as any).name, 'sin');
  });

  // Add more tests for unary operators, nested functions, etc...
  it('parse() — unary negation', () => {
    const expr = parse('-x');

    assert.ok(expr instanceof UnaryOp);
  });

  it('parse() — double negation', () => {
    const expr = parse('--x');

    assert.ok(expr instanceof UnaryOp);
  });
  
  it('parse() — nested functions', () => {
    const expr = parse('sin(cos(x))');

    assert.ok(expr instanceof FunctionCall);
  });

  it('parse() — exponent is right associative', () => {
    const expr = parse('2 ^ 3 ^ 4');

    assert.strictEqual((expr as any).op, '^');

    const right = (expr as any).right;

    assert.ok(right instanceof BinaryOp);
    assert.strictEqual((right as any).op, '^');
  });

  it('parse() — complex expression', () => {
    const expr = parse('sqrt(x^2 + y^2)');

    assert.ok(expr instanceof FunctionCall);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Problem 3: Test evaluate()
// ─────────────────────────────────────────────────────────────────────────────

describe('Problem 3: evaluate()', () => {
  // Testing strategy for evaluate():
  //   Partition on expression type: number, variable, binary op, unary op, function
  //   Partition on variable values: defined, undefined, zero, negative
  //   Partition on operators: each binary and unary operator
  //   Partition on functions: each function (sin, cos, sqrt, abs)
  //   Partition on error cases: undefined variable, division by zero

  it('evaluate() — number', () => {
    const expr = parse('42');
    const result = evaluate(expr, new Map());
    assert.strictEqual(result, 42);
  });

  it('evaluate() — variable', () => {
    const expr = parse('x');
    const result = evaluate(expr, new Map([['x', 5]]));
    assert.strictEqual(result, 5);
  });

  it('evaluate() — addition', () => {
    const expr = parse('2 + 3');
    const result = evaluate(expr, new Map());
    assert.strictEqual(result, 5);
  });

  it('evaluate() — subtraction', () => {
    const expr = parse('10 - 3');
    const result = evaluate(expr, new Map());
    assert.strictEqual(result, 7);
  });

  it('evaluate() — multiplication', () => {
    const expr = parse('6 * 7');
    const result = evaluate(expr, new Map());
    assert.strictEqual(result, 42);
  });

  it('evaluate() — division', () => {
    const expr = parse('20 / 4');
    const result = evaluate(expr, new Map());
    assert.strictEqual(result, 5);
  });

  it('evaluate() — power', () => {
    const expr = parse('2 ^ 3');
    const result = evaluate(expr, new Map());
    assert.strictEqual(result, 8);
  });

  it('evaluate() — unary negation', () => {
    const expr = parse('-5');
    const result = evaluate(expr, new Map());
    assert.strictEqual(result, -5);
  });

  it('evaluate() — complex expression with variables', () => {
    // x^2 + 2*x + 1 with x=3 should be 9 + 6 + 1 = 16
    const expr = parse('x^2 + 2*x + 1');
    const result = evaluate(expr, new Map([['x', 3]]));
    assert.strictEqual(result, 16);
  });

  it('evaluate() — sqrt function', () => {
    const expr = parse('sqrt(16)');
    const result = evaluate(expr, new Map());
    assert.strictEqual(result, 4);
  });

  it('evaluate() — abs function', () => {
    const expr = parse('abs(-5)');
    const result = evaluate(expr, new Map());
    assert.strictEqual(result, 5);
  });

  it('evaluate() — undefined variable throws error', () => {
    const expr = parse('x + 1');
    assert.throws(() => evaluate(expr, new Map()));
  });

  it('evaluate() — division by zero throws error', () => {
    const expr = parse('1 / 0');
    assert.throws(() => evaluate(expr, new Map()));
  });

  // Add more tests for trigonometric functions and edge cases...
  it('evaluate() — multiple variables', () => {
    const expr = parse('x + y');

    const result =
        evaluate(expr, new Map([
            ['x', 2],
            ['y', 3]
        ]));

    assert.strictEqual(result, 5);
  });

  it('evaluate() — nested expression', () => {
    const expr = parse('(2 + 3) * 4');

    assert.strictEqual(
        evaluate(expr, new Map()),
        20
    );
  });

  it('evaluate() — sin(0)', () => {
    const expr = parse('sin(0)');

    assert.strictEqual(
        evaluate(expr, new Map()),
        0
    );
  });

  it('evaluate() — cos(0)', () => {
      const expr = parse('cos(0)');

      assert.strictEqual(
          evaluate(expr, new Map()),
          1
      );
  });

  it('evaluate() — sin(pi/2)', () => {
    const expr = parse('sin(x)');

    const result =
        evaluate(expr, new Map([
            ['x', Math.PI / 2]
        ]));

    assert(Math.abs(result - 1) < 1e-10);
  });

  it('evaluate() — right associative exponentiation', () => {
    const expr = parse('2 ^ 3 ^ 2');

    assert.strictEqual(
        evaluate(expr, new Map()),
        512
    );
  });

  it('evaluate() — sqrt(0)', () => {
    const expr = parse('sqrt(0)');

    assert.strictEqual(
        evaluate(expr, new Map()),
        0
    );
  });

  it('evaluate() — undefined variable in nested expression throws', () => {
    const expr = parse('2 + x * 3');

    assert.throws(
        () => evaluate(expr, new Map())
    );
  }); 
});
