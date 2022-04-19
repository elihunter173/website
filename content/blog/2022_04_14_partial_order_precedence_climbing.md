+++
title = "Partial Order Precedence Climbing Parsers"
date = 2022-04-14
+++

This article discusses a technique for creating precedence climbing parsers
(a.k.a. Pratt parsers) which I don't see discussed very often. This article also
assumes you have a basic familiarity with parsing techniques. For example, I
won't explain BNF syntax or how to write a recursive descent parser.

TODO: Include link to all code examples.

# Background

Suppose you want to create a programming language with arithmetic expressions.
So for example you have numbers, operators for addition `+`, multiplication `*`,
and exponentiation `**`, and you allow parenthesized expressions. We'll leave
off subtraction `-`, division `/`, and other operators for now for simplicity.

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
as `1 + 2 * 3` result in an ambiguous parse tree. Or maybe, your parser
generator complains that this grammar is ambiguous and then doesn't really
explain why.

The reason? **Operator precedence.** Or also binding power as it's sometimes
called.

With the previous grammar, `1 + 2 * 3` could be parsed as either `(1 + 2) * 3`
or `1 + (2 * 3)`.

<!-- TODO: Maybe include a graph of the AST here -->

Intuitively, people expect that multiplication `*` *binds tighter* (i.e. has a
higher precedence) than addition `+`. So, they expect `1 * 2 + 3` to be parsed
as `(1 * 2) + 3` instead of `1 * (2 + 3)`. Further, they expect addition `+` and
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
left-recursion with loops) gives us the following code in pseudo-Rust.

```rs
fn parse_expr(lexer) -> Expr {
    let lhs = parse_expr_p1(lexer);
    while lexer.eat_token("+") {
        let rhs = parse_expr_p1(lexer);
        lhs = Binary("+", lhs, rhs);
    }
    lhs
}

fn parse_expr_p1(lexer) -> Expr { ... }

fn parse_expr_p2(lexer) -> Expr {
    let lhs = parse_atom(lexer);
    if lexer.eat_token("**") {
        let rhs = parse_expr_p2(lexer);
        lhs = Binary("**", lhs, rhs);
    }
    lhs
}

fn parse_atom(lexer) -> Expr {
    match lexer.next() {
        "(" => {
            let expr = parse_expr(lexer);
            lexer.eat_token(")");
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

One way to avoid twisting our grammar into a mess of `Expr`, `ExprP1`, ...,
`ExprPN` like we did previously is to include an additional table defining each
operator's numerical precedence and associativity, alongside our original clean
and intuitive grammar from earlier.

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
| `**`     | 3             | Right         |
{% end %}

Now with this additional table, we need to switch away from our recursive
descent parsing strategy and into something which knows how to use this
precedence table. The most popular parsing strategy which does this is called
**precedence climbing**, or alternatively **Pratt parsing**.

With our recursive descent parser, we had a different function for every
precedence level and every function would only recurse into either a higher
precedence function or itself. We use a similar idea for precedence climbing
parsers except instead of having multiple functions each handling a single
precedence level, we have one function which takes the precedence level as an
argument.

Here's what a precedence climbing parser looks like again in pseudo-Rust.

```rs
fn parse_expr(lexer, min_precedence) -> Expr {
    let lhs = parse_atom(lexer);
    loop {
        let op = lexer.peek_op();
        ... // Should we quit or start a sub-parser at op's precedence?
        lexer.next();
        let rhs = parse_expr(lexer, precedence_of(op));
        lhs = Binary(op, lhs, rhs);
    }
    lhs
}
```

With this strategy, each `parse_expr()` call expects to start directly on a
number, or more generally an "atom" in the grammar. It then peeks at the next
operator and decides, based off of what operator it is, whether it should create
a binary expression and start a sub-parser to build the right hand side `rhs`.

So for example, if `parse_expr()` is called with the precedence of addition `+`
and it sees a multiplication operator `*`, then it should start a sub-parser.
This sub-parser would then go on to parse every operator up to *but not
including* multiplication `*`.

$$1 + \\; \underbrace{2}\_{lhs} \enspace \underbrace{*}\_{op} \enspace \underbrace{3**4}\_{rhs} \\; * 5 + 6$$

$$1 + \\; \underbrace{2 * 3**4}\_{lhs} \enspace \underbrace{*}\_{op} \enspace \underbrace{5}\_{rhs} \\; + 6$$

Re-using this example, let's back out to the original `parse_expr()`. To parse a
top-level expression, we always call `parse_expr()` with the base precedence of
0. This initial `parse_expr()` call is positioned on `1` and finds `op` to be
addition `+`. It then starts our sub-parser from earlier

$$\underbrace{1}\_{lhs} \enspace \underbrace{+}\_{op} \enspace \underbrace{2 * 3**4 * 5}\_{rhs} \\; + 6$$

$$\underbrace{1 + 2 * 3**4 * 5}\_{lhs} \enspace \underbrace{+}\_{op} \enspace \underbrace{6}\_{rhs}$$

CUT

Now you'll notice that I left the "Should we start a sub-parser at op's
precedence?" code out. That's because that question is hard to answer without
first understanding the overall structure of how precedence climbing works.

In general, we want to start a sub-parser if `op`'s precedence is higher than
`min_precedence`. This sub-parser will parse everything it can into `rhs`

TODO: Include flamegraph / stack diagram of what I mean.

left-associative expression we're building up `lhs`.

# Problem: Unclear Precedence Relationships

# Solution: Partial Orders

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
