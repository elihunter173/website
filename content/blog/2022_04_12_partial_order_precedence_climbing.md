+++
title = "Partial Order Precedence Climbing Parsers"
date = 2022-04-12
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
left-recursion with loops) gives us the following parser in pseudo-Rust.

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
    let lhs = atom(lexer);
    if lexer.eat_token("**") {
        let rhs = parse_expr_p2(lexer);
        lhs = Binary("**", lhs, rhs);
    }
    Ok(lhs)
}

fn atom(lexer) -> Expr {
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

With a recursive descent parser, we had a different function for every
precedence level and every function/level would only recurse into either a
higher precedence function or itself. We use a similar idea for a precedence
climbing parser except instead of having multiple functions each handling a
single precedence level, we have one function which takes the precedence level
as an argument.

```rs
fn parse_expr(lexer, min_precedence) -> Expr {
    let lhs = parse_unary(lexer);
    loop {
        let op = lexer.peek();
        ... // Should we handle this op?
        lexer.next();
        let rhs = parse_expr(lexer, precedence_of(op));
        lhs = Binary(op, lhs, rhs);
    }
    lhs
}
```

The general shape of a precedence climbing parser

TODO: Include flamegraph / stack diagram of what I mean.

Then, our algorithm goes from the typical recursive descent to the following
form.

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
