+++
title = "Partial Order Precedence Climbing Parsers"
date = 2022-03-30
+++

This article discusses a technique for creating precedence climbing parsers
(a.k.a. Pratt parsers) which I don't see discussed very often. This article also
assumes you have a basic familiarity with parsing techniques. For example, I
won't explain BNF syntax or how to write a recursive descent parser.

# Background

Suppose you want to create a programming language with arithmetic expressions.
So for example you have numbers, operators for addition `+`, multiplication `*`,
and exponentiation `**`, and you allow parenthesized expressions. We'll leave
off subtraction `-`, division `/`, and other operators in this post for
simplicity.

The BNF grammar you'd *like* to write looks like this.

```bnf
Expr ::= Expr '+' Expr
       | Expr '*' Expr
       | Expr '**' Expr
       | '(' Expr ')'
       | Number
```

But alas, this grammar is woefully incapable of handling the expressions your
users throw at it and people start complaining that even expressions as simple
as `1 + 2 * 3` result in an ambiguous parse tree. Or alternatively, your parser
generator complains that this grammar is ambiguous and then doesn't really
explain why.

The reason? **Operator precedence.** Or also binding power as it's sometimes
called.

With the previous grammar, `1 + 2 * 3` could be parsed as either `(1 + 2) * 3`
or `1 + (2 * 3)`.

<!-- TODO: Maybe include a graph of the AST here -->

Intuitively, people expect that multiplication `*` *binds tighter* (i.e. has a
higher precedence) than addition `+`. So, they expect `1 * 2 + 3` to be parsed
as `1 + 2 + 3` instead of `1 + 2 * 3`. Further, they expect addition `+` and
multiplication `*` to be left associative and `**` to be right associative. Or
in other words, people from their experience with math expect `2**3**4` to be
equal to `2**(3**4)` and not `(2**3)**4`.

You could fix this by twisting your grammar to encode operator precedence and
associativity like so.

```bnf
Expr ::= ExprP1 | Expr '+' ExprP1
ExprP1 ::= ExprP2 | ExprP1 '*' ExprP2
ExprP2 ::= Atom | Atom '**' ExprP2
Atom ::= '(' Expr ')' | Number
```

Now the grammar itself explicitly encodes that addition `+` binds less tightly
(and thus is higher in the AST) than multiplication `*`. You can see this
because the top-level `Expr` includes `+` and then it's child expressions
include `*`.

You can additionally see addition `+` and multiplication `*` are
left-associative since their rules `Expr` and `ExprP1` include themselves on the
left side of the operator. Whereas exponentiation `**` is right-associative
since its rule `ExprP2` includes itself on the right side of the operator.

Translating this grammar into a recursive descent parser (and handling
left-recursion by "unrolling") gives us the following parser in pseudo-Rust.

```rs
fn parse_expr(parser) -> Expr {
    let lhs = parse_expr_p1(parser);
    while parser.eat_token("+") {
        let rhs = parse_expr_p1(parser);
        lhs = Binary("+", lhs, rhs);
    }
    lhs
}

fn parse_expr_p1(parser) -> Expr { ... }

fn parse_expr_p2(parser) -> Expr { ... }

fn atom(parser) -> Expr {
    match parser.next() {
        "(" => {
            let expr = parse_expr(parser);
            parser.eat_token(")");
            expr
        }
        num => Number(num),
    }
}
```

This works but in my experience this gets increasingly *difficult to maintain*
as you add more and more operators and makes *refactoring more difficult*. And
at least for me personally, it's *no longer obvious* to me that the grammar is
correct.

# Enter: Precedence Climbing (a.k.a. Pratt Parsing)

One of the most popular ways to fix the issue of operator precedence while still
leaving you a clean and intuitive grammar is by using a technique called
precedence-climbing.

Here, we keep our clean grammar from earlier but include an additional table
defining each operator's precedence and associativity.

```bnf
Expr ::= Expr '+' Expr
       | Expr '*' Expr
       | Expr '**' Expr
       | '(' Expr ')'
       | Number
```

{% raw_figure() %}
| Operator | Binding Power | Associativity |
|----------|---------------|---------------|
| `+`      | 1             | Left          |
| `*`      | 2             | Left          |
| `**`     | 5             | Right         |
{% end %}

The way to think of this algorithm is that your parser now has two different
parts. A recursive part and a loop part.

TODO: Include flamegraph / stack diagram of what I mean.

Then, our algorithm goes from the typical recursive descent to the following
form.

# Old Stuff

Precedence climbing parsers typically use numbers to define operator precedence
(see [C operator precedence
table](https://en.cppreference.com/w/c/language/operator_precedence)). This is
nice because it makes operator precedence easy to document, just have a table of
operators and their precedence.

However, this can have some unintuitive consequences for operators which don't
have an obvious precedence you'd expect. For example, no language which uses
standard operator precedence can have both `a + b | c` and `a * b | c` be
ambiguous, since `|` can't have the same precedence of both `+` and `*` at the
same time.

However, if we look at the algorithm for a standard precedence climbing parser
(aka. Pratt parser), we see that it doesn't ***actually*** use any properties of
numbers other than they have a [partial
order](https://mathworld.wolfram.com/PartialOrder.html) defined

```rs
fn parse_expr(lexer: &mut Lexer, min_precedence: u8) -> Expr {
    let mut lhs = parse_unary(lexer, min_precedence);

    loop {
        let op = if let Token::Op(op) = lexer.peek() {
            op
        } else {
            _ => break,
        };
        let precedence = get_precedence(op);
        let assoc = get_associativity(op);
        if precedence < min_precedence || (precedence == min_precedence && assoc == Assoc::Left) {
            break;
        }
        lexer.next();
        let rhs = parse_expr(lexer, precedence);
        lhs = Expr::Cons(op, vec![lhs, rhs]);
    }

    lhs
}
```

So to make this more clear, let's extend the example to use a generic
`Precedence` that implements `PartialOrd`.

The [zig blog post][zig-link] which inspired this blog post recommends
> For languages with many operators it might be easier to start with an N*N
> matrix filled in with Ambiguous, set the few comparisons we care about and
> then take the symmetric and transitive closure.

However, I find this harder to reason about both in terms of understanding and
explaining operator precedence. Instead, I am going to recommend we take a page
from Math and use [Hasse diagrams][hasse].

## Further Reading

["Better operator precedence" by jamii][zig-link] describes the same algorithm with to
handle ambiguous operator precedence, except it directly uses tokens rather than
custom precedence values. This is actually where I learned about this method, so
full credit to them. My blog post here is only meant to provide a clearer
connection between this method and normal precedence climbing with integer
precedence values as well as provide an easier way to document and generate the
`compare_precedence` function.

["Simple but Powerful Pratt Parsing" by matklad][rust-link] is an excellent
first introduction to precedence-climbing parsing (a.k.a. Pratt parsing) in
Rust. I highly recommend reading this if you would like to learn more about
precedence-climbing parsers or if this blog post was confusing.

[hasse]: https://en.wikipedia.org/wiki/Hasse_diagram
[zig-link]: https://www.scattered-thoughts.net/writing/better-operator-precedence/
[rust-link]: https://matklad.github.io/2020/04/13/simple-but-powerful-pratt-parsing.html
