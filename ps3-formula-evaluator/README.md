# Formula Evaluator

An equivalent of MIT 6.102 PS3, teaching **recursive data types, parsing, and recursive operations** on immutable ASTs — without image generation complexity.

---

## Setup

```bash
npm install
npm test        # Run tests (most will fail with "implement me!")
```

---

## Overview

You will build a mathematical expression evaluator from scratch:

**Input:** `"2 + 3 * 4"` or `"sin(x) + cos(y)"` (strings)  
**Process:** Parse → AST → Evaluate  
**Output:** `14` or a numeric result

### The Language

Valid expressions include:

```
42                          // numeric literal
x, radius, theta            // variables
2 + 3                       // binary operators: +, -, *, /, ^
-x                          // unary negation
sin(x), cos(y), sqrt(a)     // functions: sin, cos, sqrt, abs
(2 + 3) * 4                 // parentheses for grouping
x^2 + 2*x + 1               // complex expressions
```

**Operator precedence** (highest to lowest): `^` > `*,/` > `+,-`

---

## Three Main Problems

### **Problem 1: Recursive Data Type (AST)**

**File:** `src/expression-impls.ts`

Define an **immutable, recursive** abstract syntax tree with five variant classes:

1. **`Number`** — numeric literal (e.g., 42, -1.5)
2. **`Variable`** — variable name (e.g., x, radius)
3. **`BinaryOp`** — binary operation (e.g., a+b, x*y)
4. **`UnaryOp`** — unary operation (e.g., -x)
5. **`FunctionCall`** — function call (e.g., sin(x), sqrt(y))

#### 1.1 Implement `toString()`

**Spec:** Convert AST back to a valid expression string.

- Output must be valid and unambiguous.
- Use **minimal parentheses** — only where necessary for correctness.
- Handle operator precedence: e.g., `2 + 3 * 4` (no parens) vs. `(2 + 3) * 4` (parens needed).

**Implementation notes:**
- Must be **recursive** — call toString() on sub-expressions.
- Must **NOT** use `instanceof`.
- Example: `BinaryOp(Number(2), '+', BinaryOp(Number(3), '*', Number(4))).toString()` → `"2 + 3 * 4"`

#### 1.2 Implement `equalValue()`

**Spec:** Structural equality — two ASTs are equal iff they have the same structure and values.

Examples:
- `parse("2 + 3").equalValue(parse("2 + 3"))` → true
- `parse("2 + 3").equalValue(parse("2+3"))` → true (same structure)
- `parse("(2 + 3) * 4").equalValue(parse("2 + 3 * 4"))` → false (different grouping)

**Implementation notes:**
- Must be **recursive** — check equality of sub-expressions.
- **SHOULD** use `instanceof` to test the variant type.
- Then compare fields for equality.

#### 1.3 Testing (Problem 1)

**File:** `test/expression.test.ts`

Write tests for `toString()` and `equalValue()` by **directly constructing** variant objects:

```typescript
const expr = new BinaryOp(new Number(2), '+', new Number(3));
assert.strictEqual(expr.toString(), '2 + 3');
```

**Partitioning strategy:**
- By variant type: Number, Variable, BinaryOp, UnaryOp, FunctionCall
- By complexity: single operator, nested, precedence cases
- By equality: same structure, different structure, different values

**Commit** once Problem 1 is working.

---

### **Problem 2: Parser**

**File:** `src/parser.ts`

Build a **parser** that converts a string into an AST.

#### 2.1 Write the Grammar

The language grammar with operator precedence:

```
expression   := term (('+' | '-') term)*
term         := factor (('*' | '/') factor)*
factor       := base ('^' base)*
base         := number | variable | function | '(' expression ')'
number       := [0-9]+ ('.' [0-9]+)?
variable     := [a-zA-Z_][a-zA-Z0-9_]*
function     := ('sin' | 'cos' | 'sqrt' | 'abs') '(' expression ')'
```

This grammar naturally handles:
- **Left-associativity** for +, - and *, /: `a + b + c` → `(a + b) + c`
- **Right-associativity** for ^: `a ^ b ^ c` → `a ^ (b ^ c)`
- **Operator precedence**: ^ > {*, /} > {+, -}

#### 2.2 Implement `parse()`

Use **ParserLib** to:
1. Define token rules (whitespace, numbers, identifiers)
2. Build grammar rules bottom-up
3. Parse the input string into a **parse tree**
4. Walk the parse tree and **construct the AST** (MemeExpression objects)

**Hints:**
- Keep `parse()` in `expression.ts` simple — just call a function in `parser.ts`.
- Put the real implementation in `parseExpression()` in `parser.ts`.
- Convert parse tree nodes to variant objects: `new Number(value)`, `new BinaryOp(...)`, etc.

**Resources:**
- [Reading 12: Grammars & Parsing](https://web.mit.edu/6.102/www/sp26/classes/12-grammars-parsing/)
- [Example code](https://web.mit.edu/6.102/www/sp26/classes/12-grammars-parsing/code.html)
- [ParserLib documentation](https://web.mit.edu/6.102/www/parserlib/4.0.2/typedoc/)

#### 2.3 Testing (Problem 2)

Once `parse()` works, **refactor your Problem 1 tests** to use it:

```typescript
// Before (Problem 1):
const expr = new BinaryOp(new Number(2), '+', new Number(3));

// After (Problem 2):
const expr = parse('2 + 3');
```

Remove the imports of variant classes from `expression.test.ts` (except in your initial tests).

Add new tests for `parse()`:
- **Partitions:** variant type, complexity, operator precedence, parentheses, whitespace
- **Examples:** `parse("42")`, `parse("x + 1")`, `parse("(2+3)*4")`, `parse("sin(x)")`, etc.

**Commit** once Problem 2 is working.

---

### **Problem 3: Evaluation & Operations**

**File:** `src/expression.ts` (and expression-impls.ts)

Implement an `evaluate()` function that computes the numeric result of an expression given variable values.

#### 3.1 Add `evaluate()` Operation to AST

Define `evaluate()` as a **recursive method** on your MemeExpression variants:

```typescript
evaluate(expr: MemeExpression, values: Map<string, number>): number
```

**Spec:**
- Takes an expression and a map of variable values.
- Returns the numeric result.
- Throws Error if a variable is undefined or division by zero occurs.

**Implementation notes:**
- Must be **recursive** — evaluate sub-expressions.
- Must **NOT** use `instanceof` or type-checking.
- Instead, define a method `eval(values: Map<string, number>): number` on each variant class.

**Variants:**
- **Number:** return the value
- **Variable:** look up in the values map; throw if undefined
- **BinaryOp:** evaluate left and right, apply operator
- **UnaryOp:** evaluate operand, apply operator (negation)
- **FunctionCall:** evaluate arguments, apply function (Math.sin, Math.cos, Math.sqrt, Math.abs)

#### 3.2 Testing (Problem 3)

Add comprehensive tests for `evaluate()`:

```typescript
assert.strictEqual(evaluate(parse('2 + 3'), new Map()), 5);
assert.strictEqual(evaluate(parse('x^2 + 1'), new Map([['x', 3]])), 10);
```

**Partitions:**
- By variant: Number, Variable, BinaryOp, UnaryOp, FunctionCall
- By operator: each binary op (+, -, *, /, ^) and unary op (-)
- By function: sin, cos, sqrt, abs
- By error: undefined variable, division by zero

**Commit** once Problem 3 is working.

---

## Iterative Development

Start small and iterate:

1. **First pass (basic):** Implement Numbers, Variables, and `+` operator only.
   - Tests: basic addition
   - Parser: just numbers, variables, + operator
   - Evaluate: just add

2. **Second pass:** Add other binary operators (-, *, /, ^).
   - Tests: test each operator
   - Parser: extend grammar for operator precedence
   - Evaluate: implement each operator

3. **Third pass:** Add unary negation (-x).
   - Tests: test negation
   - Parser: handle unary minus at start of expression
   - Evaluate: implement negation

4. **Fourth pass:** Add functions (sin, cos, sqrt, abs).
   - Tests: test each function
   - Parser: add function rule to grammar
   - Evaluate: implement function evaluation

---

## Before You're Done

**For each class and method you write:**

- ✓ TypeDoc specs (comment above class and each method)
- ✓ Abstraction function (AF) documented near fields
- ✓ Representation invariant (RI) documented near fields
- ✓ Safety from Rep Exposure (SRE) explained
- ✓ `checkRep()` implemented and called (not needed for parser)
- ✓ `toString()` implemented with useful representation

**Test coverage:**

- ✓ Comprehensive tests for each operation
- ✓ Partitioning strategy documented
- ✓ Tests for error cases (undefined variables, division by zero)
- ✓ Good coverage for operator precedence and complex expressions

---

## Skills Practised (Maps to PS3)

| PS3 Concept | This Exercise |
|---|---|
| Recursive Data Types | AST variants (Number, Variable, BinaryOp, etc.) |
| Immutability | All variant fields are `readonly` |
| Pattern Matching | `toString()` and `evaluate()` dispatch on AST structure |
| Functional Programming | Recursive functions, no side effects, immutable data |
| Parsing & Grammars | ParserLib grammar with operator precedence |
| Recursive Operations | `toString()`, `equalValue()`, `evaluate()` defined recursively |
| Structural Equality | `equalValue()` compares AST structure |
| Operator Precedence | Grammar and formatting handle precedence correctly |
| Testing Recursive Types | Partition tests by AST structure and complexity |
| Incremental Development | Start with subset, expand to full language |
