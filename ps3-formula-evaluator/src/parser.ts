/**
 * parser.ts
 *
 * ParserLib grammar for mathematical expressions.
 * Also contains the parser implementation that builds the AST.
 *
 * Problem 2: Implement the parser.
 *
 * GRAMMAR (operator precedence, highest to lowest):
 *   expression   := term (('+' | '-') term)*
 *   term         := factor (('*' | '/') factor)*
 *   factor       := base ('^' base)*
 *   base         := number | variable | function | '(' expression ')'
 *   number       := [0-9]+ ('.' [0-9]+)?
 *   variable     := [a-zA-Z_][a-zA-Z0-9_]*
 *   function     := ('sin' | 'cos' | 'sqrt' | 'abs') '(' expression ')'
 *
 * Note: '-' at the start of a base is unary negation, e.g., -x or -(a+b)
 *
 * The grammar is left-recursive in a way that naturally handles left-associativity
 * for + and -, but right-associativity for ^ (which is what we want).
 *
 * RESOURCES:
 *   - Reading 12: Grammars & Parsing
 *   - Example code: https://web.mit.edu/6.102/www/sp26/classes/12-grammars-parsing/code.html
 *   - ParserLib docs: https://web.mit.edu/6.102/www/parserlib/4.0.2/typedoc/
 */

import { MemeExpression } from './expression';
import { Number, Variable, BinaryOp, UnaryOp, FunctionCall } from './expression-impls';

import assert from 'assert';
import { Parser, ParseTree, compile } from "parserlib";

/**
 * Parse a string into a MemeExpression.
 *
 * This is the entry point called by expression.parse().
 * Keep it simple — just call parseExpression and return the result.
 *
 * @param input a string containing a mathematical expression
 * @returns the abstract syntax tree for the expression
 * @throws Error if the input is not a valid expression
 */

const grammar: string = `
  @skip whitespace {
      expression := term (addop term)*
      addop := '+' | '-'

      term := factor (mulop factor)*
      mulop := '*' | '/'

      factor := unary ('^' factor)?

      unary := '-' unary
            | base

      base := number
            | variable
            | function
            | '(' expression ')'

      function := ('sin' | 'cos' | 'sqrt' | 'abs') '(' expression ')'
  }  
  number       := [0-9]+ ('.' [0-9]+)?
  variable     := [a-zA-Z_][a-zA-Z0-9_]*  
  whitespace ::= [ \\t\\r\\n]+;  
  `;

enum FormulaGrammar {
    Expression, Addop, Term, Factor, Mulop, Unary, Base, Function, Number, Variable, Whitespace
  }

export function parseExpression(input: string): MemeExpression {
  // Problem 2.1: Write a ParserLib grammar for the language above.
  // Problem 2.2: Use the grammar to parse the input.
  // Problem 2.3: Convert the parse tree to an AST (MemeExpression).
  
  const parser: Parser<FormulaGrammar> = 
    compile(grammar, FormulaGrammar, FormulaGrammar.Expression);

  const parseTree: ParseTree<FormulaGrammar> = parser.parse(input);

  const expr = makeAbstractSyntaxTree(parseTree);

  return expr;
}

function makeAbstractSyntaxTree(parseTree: ParseTree<FormulaGrammar>): MemeExpression {
  switch (parseTree.name) {

    case FormulaGrammar.Expression: {
        // expression := term (addop term)*

        const children = parseTree.children;

        let result =
            makeAbstractSyntaxTree(children[0] ?? assert.fail("missing term"));

        for (let i = 1; i < children.length; i += 2) {
            const opNode =
                children[i] ?? assert.fail("missing operator");

            const rhsNode =
                children[i + 1] ?? assert.fail("missing rhs");

            const op = opNode.text;

            result = new BinaryOp(
                result,
                op as '+' | '-',
                makeAbstractSyntaxTree(rhsNode)
            );
        }

        return result;
    }

    case FormulaGrammar.Term: {
        // term := factor (mulop factor)*

        const children = parseTree.children;

        let result =
            makeAbstractSyntaxTree(children[0] ?? assert.fail("missing factor"));

        for (let i = 1; i < children.length; i += 2) {
            const opNode =
                children[i] ?? assert.fail("missing operator");

            const rhsNode =
                children[i + 1] ?? assert.fail("missing rhs");

            const op = opNode.text;

            result = new BinaryOp(
                result,
                op as '*' | '/',
                makeAbstractSyntaxTree(rhsNode)
            );
        }

        return result;
    }

    case FormulaGrammar.Factor: {
        // factor := unary ('^' factor)?

        const children = parseTree.children;

        const left =
            makeAbstractSyntaxTree(children[0] ?? assert.fail("missing unary"));

        if (children.length === 1) {
            return left;
        }

        const right =
            makeAbstractSyntaxTree(children[1] ?? assert.fail("missing factor"));

        return new BinaryOp(left, '^', right);
    }

    case FormulaGrammar.Unary: {
        // unary := '-' unary | base

        const children = parseTree.children;

        if (children.length === 1) {
            return makeAbstractSyntaxTree(children[0]!);
        }

        return new UnaryOp(
            '-',
            makeAbstractSyntaxTree(children[0]!)
        );
    }

    case FormulaGrammar.Base: {
        // base := number | variable | function | '(' expression ')'

        const child =
            parseTree.children[0] ?? assert.fail("missing child");

        return makeAbstractSyntaxTree(child);
    }

    case FormulaGrammar.Function: {
        // function := ('sin'|'cos'|'sqrt'|'abs') '(' expression ')'

        const exprChild =
            parseTree.children[0] ?? assert.fail("missing argument");

        const arg =
            makeAbstractSyntaxTree(exprChild);

        const text = parseTree.text!;

        let fn: string;

        if (text.startsWith("sin")) {
            fn = "sin";
        } else if (text.startsWith("cos")) {
            fn = "cos";
        } else if (text.startsWith("sqrt")) {
            fn = "sqrt";
        } else if (text.startsWith("abs")) {
            fn = "abs";
        } else {
            assert.fail("unknown function");
        }

        return new FunctionCall(fn, [arg]);
    }

    case FormulaGrammar.Number:
        return new Number(parseFloat(parseTree.text as string));

    case FormulaGrammar.Variable:
        return new Variable(parseTree.text as string);

    case FormulaGrammar.Addop:
    case FormulaGrammar.Mulop:
    case FormulaGrammar.Whitespace:
        assert.fail("operator node should be handled by parent");

    default:
        assert.fail(
            `cannot make AST for ${FormulaGrammar[parseTree.name]}`
        );
    }

}

`
/**
 * HINTS FOR USING PARSERLIB:
 *
 * (1) Import ParserLib rules:
 *     import { Rule, KleeneStar, literal, regexp, ... } from 'parserlib';
 *
 * (2) Define rules for tokens (whitespace, numbers, identifiers, etc.):
 *     const ws = regexp(/\s*/);
 *     const num = regexp(/[0-9]+(\.[0-9]+)?/);
 *     const id = regexp(/[a-zA-Z_][a-zA-Z0-9_]*/);
 *
 * (3) Build the grammar bottom-up, from base expressions upward:
 *     const atom = /* number | variable | function | (expr) */;
 *     const power = /* atom ('^' atom)* */;
 *     const mult = /* power (('*'|'/') power)* */;
 *     const expr = /* mult (('+' | '-') mult)* */;
 *
 * (4) Call the parser:
 *     const tree = expr.parse(input);
 *     // tree is a nested structure of arrays and strings, NOT an AST yet
 *
 * (5) Walk the parse tree and build the AST:
 *     - Convert parse tree nodes to MemeExpression objects
 *     - For binary ops like a+b, construct BinaryOp(a, "+", b)
 *     - For numbers, construct Number(value)
 *     - etc.
 *
 * (6) Example of converting a binary operator tree:
 *     The grammar (a '+' b) might produce [a, ['+', b], ['+', c], ...]
 *     Walk through this tree and build:
 *       BinaryOp(BinaryOp(a, "+", b), "+", c)
 */
`
