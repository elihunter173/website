+++
title = "CSC 412: Compiler Construction"
[extra]
teacher = "Dr. Xu Liu"
+++

# Administrivia

| Weight | Component   | Additional Info                |
|--------|-------------|--------------------------------|
| 30%    | Midterm     |                                |
| 50%    | Project     | 4 Projects (3 C/C++, 1 Python) |
| 20%    | Assignments | All homework written.          |

* TA: Abhijeet Krishnan
* No final
* Testing done in Virtual Computing Lab (VCL).
* Projects may be different between 412 and 512.
* Attendance: Required via Zoom. Need to email ahead of time if will be absent.
* We do not discuss linking or assembling specifically here.

# Overview of Compilers

* Compiler: Tool for analyzing and transforming high level programs into some
  executable form. Compilers often include optimizations to **improve
  performance** of the code.
* Types of Compiler: Compilers are often categorized by similar properties.
  * Traditional: High-level to low-level (machine code, bytecode, hardware
    FPGA/ASIC).
    * C, C++, Rust
  * Source-to-source/Transpiler: Produce source code for a different similarly
    high-level language from another language.
    * Typescript, Moonscript.
  * Just-in-Time (JIT): Compiles at runtime often doing tracing or other
    performance-guided-optimizations.
    * Java (always uses bytecode but will JIT hot code)
  * Decompiler: Low-level to high-level.
  * Cross Compiler: Generate code for a machine different than the host running
    the compiler.
  * Binary Recompiler: Binary/machine-code to another binary/machine-code.
    Often useful for introducing tracing or other instructions.
* Intermediate Representation: A low-level machine-code-like language that is
  architecture agnostic. Allows for easier optimizations and allows easier
  support for more languages and hosts.
  * Examples: GIMPLE (gcc's IR), LLVM IR.
* Interpreter: Program that runs the source code directly. Or at least appears
  to do so; many interpreters do internal compilation. This is good because
  they are *easy* to write.
* Activation Record: Stack frame.

Compilers normally go through the following steps: (front-end) preprocessing,
lexical analysis, parsing, (middle-end) semantic analysis, IR conversion, code
optimization, and (back-end) code generation.

One of the hardest parts of compilers is (user-friendly) error propagation. All
parts can produce errors and the error chain can be very deep and complex.

## Three-Pass Compiler

Many compilers follow a three-pass system, with a front-end taking in source
code and producing IR, middle-end taking in and producing IR, and back-end
taking in IR and producing the final output.

The front-end lexes and parses the source code, producing an AST. It then does
a bunch of analysis on the AST, such as type-checking. Then it produces IR.
*This class mostly covers front-end.* It is normally $O(n)$ or $O(n \log(n))$

The middle-end optimizes the IR a bunch. This is normally NPC (NP-Complete).
*This class does not touch the middle-end.*

The back-end produces machine-code (or other output formats) from the IR. This
is normally NPC (NP-Complete) because of register allocation. *This class does
some back-end.*

# Front-end

The frontend first scans the code to produce tokens. Then parses the token
stream to an AST. Then it does a bunch of analysis on the AST.

## Scanner

A scanner reads the raw text of the file and extracts the interesting tokens
from it. This allows the parser to deal with higher-level tokens which makes it
easier. It also allows handling error handling/reporting information to be more
contained.

A scanner is the easiest part to implement normally and can even be done by a
**scanner generator**. It can be done *lazily* (doesn't scan tokens until
requested) or *greedily* (produces all tokens as soon as possible). A scanner
generator takes descriptions of the tokens normally using *regular expressions*
to generate a scanner.

I won't talk much about the theory here because CSC 333 was pretty extensive.
But basically regular expressions are formally equivalent to finite automata
(FA). Languages (i.e. sets of strings of symbols) recognized by finite automata
are called FA and are closed under union $\cup$, intersection $\cap$, and
Kleene star/closure $*$ which is 0 or more concatenations of strings from the
language. We use $\varepsilon$ to denote the empty string.

*Note:* We often insert a special `EOF` token at the end of the stream to make
sure parsing end successfully.

Normally, reserved words or keywords (e.g. `for`) match all the rules for
identifiers. To handle this, whenever we finish an identifier we see if the
identifier is a reserved word / keyword and instead return a token for that
keyword rather than a generic identifier token.

### Tokenizing

*How do you split a series of characters into tokens?* You could use the simple
"I need a delimiter" rule (e.g. every token is separated by space), but often
people want to write stuff like `foo();`. Also, sometimes you get code like
this which can be surprisingly hard.

```
intv1=35+v33;
```

In general this is done by greedily finding the current word as long as it's
legal. If you end in a legal state, then you just made a token and can return
to the start state. If you end in an illegal state, then you have reached an
error and report it.

### Types of Scanners

Fundamentally scanners run on DFAs. There are many way to build a DFA/scanner
in code.

A **table-driven scanner** essentially just has a giant lookup table where your
row is the current state and your column is the input. At every iteration, you
look up in the table using your current state and your input to get the cell in
the table which is your next state. This is somewhat memory inefficient (tables
can be very big) but easy to code and maintain.

A **direct-coded scanner** is generally more efficient in terms of memory than
the table-driven scanner and somewhat more efficient in terms of runtime. It
can be less readable and somewhat harder to maintain though. In practice it's
not that hard though. This is the kind of scanner you would make if you made
one by hand. You read in a character, switch on the state, and then manually do
the comparisons as you want.

### Scanner/DFA Optimization

To improve performance of DFAs (especially important for scanner generators),
we normally use the following

* RE to NFA: Build an NFA for each term, combine them all with
  $\varepsilon$-moves / $\varepsilon$-edges.
* NFA to DFA: Build the simulation using subset construction.
* DFA to Minimal DFA: Use Hopcroft's algorithm to minimize the number of
  states. *Can reduce the number of states a LOT.*
* DFA to RE:
  * *Why do this?* It can give you a simpler RE.

Thompson's construction works by converting the 4 basic possible regular
expression operators into an NFA, as shown below. This works on the AST of the
parsed regular expressions.

{{ figure(src="thompsons_construction.png", title="Thompson's Construction") }}

This however produces an extremely large and inefficient FA. However, it is
always correct and we have algorithms to optimize them later.

## Parser

The cheif job of the parser is to product an **abstract syntax tree** (AST). To
do this, the parser uses a formal grammer. Sometimes, finalizing the abstract
syntax tree (e.g. in cases of overloading), we need to do context sensitive
analysis (e.g. type analysis) that cannot be done by the parser.

### Grammars

Before we understand grammars, we need to understand their representation. We
use **Backus-Naur form**. The Backus-Naur form describes a grammar as a set of
**productions**, where a production is a mapping from a lefthand side to a
righthand side with an arrow from left to right. There are **non-terminal**
symbols, represented by a capital letters, called such because a valid string
in a language cannot have a non-terminal symbol. There are **terminal**
symbols, represented by lowercase letters, called such because there are a
valid symbol in the alphabet.

We use a slightly modified version where we can use non-terminals with multiple
letters in their names. To remain unambiguous, our multi-character
non-terminals start with uppercase letters and have whitespace around them.
Similarly, complex non-terminals (recognized by regular expressions) are
wrapped in angle brackets `<` and `>`.

Every string $s$ in the language recognized by a grammar has a **derivation**,
that is a series of productions that can be applied, starting at the start
symbol, to produce / arrive at $s$. The discovering of a derivation is called
**parsing**.

For review, A **regular grammar** is a grammar where every production has at
most one righthand non-terminal symbol and arbitrarily many lefthand terminal
symbols. There can be no lefthand non-terminals and no righthand terminals.

```
# Not regular grammar
S -> AB
A -> aA | \e
B -> bB | \e

# Previous grammar rewritten to be regular
A -> aA | B
B -> bB | \e

# Different no-variable grammar
S -> ab | aabb | aaabbb
```

In **context-free grammar** you have a set of productions from a *single*
non-terminal to a series of non-terminals or terminals. If you had multiple
non-terminals and terminals on the left hand side, then it would be a
*context-sensitive grammar*

```
# Recognizes a^nb^n. This is context-free.
A -> aAb | \e
# Recognizes a^nb^n n > 1. Also context-free
A -> aAb | aabb

# This is context-sensitive.
AB -> ...
```

Parsers are normally driven by context-free grammars rather than
context-sensitive grammars because they are easy to implement, easy for humans
to understand, and fairly expressive. Basically they're a happy medium.

Grammars can be ambiguous, how can we formally classify that? We can't just say
a grammar that has multiple possible derivations for a string because then if
we have multiple non-terminals at a time then it has derivations depending on
whether you derive the left or right first. To get around this, we say a
grammar is an **ambiguous grammar** if it has multiple **leftmost derivations**
(or equivalently multiple **rightmost derivations**), where a
leftmost/rightmost derivation is where you always choose the leftmost or
rightmost non-terminal symbol to expand respectively.

We do *not* want the grammars we design to be ambiguous because otherwise
people will be surprised by our parser's behavior and there's a good chance
that we will introduce bugs by accidentally switching from preferring one
ambiguity to the other. Also, we often like to use our parser's grammar to
produce an AST that we can then use to help analyze and execute the code. For
example, we normally do a post-order walk of binary expressions (e.g.
arithmetic) to determine which ones we should do first. Using a post-order walk
ensures that expressions lower in the AST get executed first.

**TODO:** Get image from slide

This ambiguity typically occurs when defining arithmetic operations. A naive
grammar for arithmetic would be

```
Expr -> Expr Op Expr
Expr -> [id] | [num]
Op -> + | - | * | /
```

However, this is ambiguous, which is a real problem if we want to embed order
of operations in an AST. We can handle this in two main ways. Use some sort of
precedence parsing, like *Pratt parsing*, where we give some numbers to our
operators which then changes the parser to be unambiguous and take care of
precedence. This can be easier to extend but harder to write initially.
Alternatively, we can modify the grammar to take care of precedence. Ultimately
it's up to a matter of preference. In this class we will modify the grammar.
Here is arithmetic operations rewritten to take care of order of operations.
You can give these names without numbers but that makes it harder to understand
I think.

```
# Expr is human-friendly alias for the top level
Expr -> L2
L2 -> L2 + L1 | L1 - L1 | L1
L1 -> L1 * L0 | L1 / L0 | L0
L0 -> Atom
# Atom is a human-friendly alias for the bottom level
Atom -> [id] | [num] | ( Expr )
```

*But wait, isn't `+` and `-` still ambiguous?* Nope! Notice that the left
non-terminal side is the same level but the right non-terminal is at a lower
level. This can have issues with left recursion, but this can again be
trivially rewritten using something like

```
# Left recursive
L1 -> L1 * L0
# Not left recursive, uses {...} repetition. Quoted symbols are not magical.
# Unquoted are magic.
L1 -> L0 { "*" L0 *
```

There are two ways of parsing we will discuss. There is **top-down parsing**,
normally done with hand-coded recursive descent parsers. There is also
**bottom-up parsing**, which normally uses a parser generator. There are many
types such as LR(1) parsers, PEG parsers, etc.

### Top-Down Parsers

Top down parsers are called such because they first start at the start state
and gradually get more and more specific. They start at the root of the parse
tree and grow towards the leaves. They do this by picking a production and
trying to match the input. However, if they pick the incorrect production, they
may need to backtrack. Certain languages/grammars are designed such that it is
always possible to pick the correct production. This is called **predictive
parsing**.

We in general discuss **recursive descent parsers** as the classical top down
parser. To create a recursive descent parser, you convert every production into
a function that returns the AST node produced by the production. If the part of
our production is a non-terminal, we call the production for it. If it is a
terminal, check that the next token matches. If we have a repetition, like `{
expr }`, we keep matching `expr` as much as we can. If we have an alternation,
like `a | b | c`, we try each production in series until we get one that works.
(As an optimization, we can match on the first token and switch directly to
that production if we have enough data to *prodict* the correct production.) If
we have an optinonal, like `[ a ]`, we try to match `a` but if we fail we don't
do anything.

Here is Rust-like pseudo-code for a recursive descent parser.

```rust
// A -> aA | bB
// B -> bBc | c
impl Parse for TokenStream {
  fn A(&self) -> AstNode {
    let node = AstNode::new();
    match self.peek() {
      'a' => {
        node.push(self.next());
        node.push(self.A());
      }
      'b' => {
        node.push(self.next());
        node.push(self.B());
      }
      _ => panic!("Please do real error handling"),
    }
    node
  }
}
```

Top down parsers have one big weakness. **Left recursion**. Left recursion is
when you have a production like `A -> A B`. In this case, the leftmost symbol
*always* generates itself and we cannot do any matching, instead just looping
forever. To get around this, we "unroll" the left recursion into right
recursion using repetition. So `A -> A B` would become `A -> { B }`. Basically,
you make the non-left-recursive branch be its own thing at the start and make
all the left-recursive branches be repetitions (with the left-recursion
removed). Here's another annotated example.

```
# Left recursive!
Fee -> Fee a | b

# b was the only terminating branch so it becomes the start
# Fee a was the non-terminating branch, so we repeat it
Fee -> b { a }

# We could do this more formally with this. It's identical to the above.
Fee -> b Fee'
Fee' -> a Fee' | \e
```

More formally, what we do is introduce a new non-terminal $A'$ for every
left-recursive non-terminal $A$. The new $A$ goes to the terminating branch of
the old $A$ and the new $A'$ goes to the $A$ non-terminating old branch or the
empty string $\varepsilon$. If that sounds confusing, read the following
transformations. Basically, $A'$ is the formal way to do `{ ... }`.

```
# Class left-recursive expression grammar
Expr -> Expr + Term | Expr - Term | Term
Term -> Term * Atom | Term / Atom | Atom

# Rewritten not left-recursive expression grammar
Expr -> Term Expr'
Expr' -> + Term Expr' | - Term | \e
Term -> Atom Term'
Term' -> * Atom | / Atom | \e
```

Not all left-recursion is obvious. We can have **indirect left-recursion**
where you have to go through multiple steps initially. See the below example.
The same algorithm works.

```
A -> B a
B -> C b
C -> A c | \e
```

Another less important weakness is it is impossible to "look-ahead" at tokens
and make decisions based on that. Meaning that grammars like `A -> aB | aC` are
impossible to parse with (formally) recursive descent parsers.

We would like to design grammars that can be parsed with recursive descent
parsers. That is, we would like a predictive parser. For this to be possible,
our grammar needs to $LL(1)$ property. $LL(1)$ means left-to-right scanning,
leftmost derivation, one lookahead.

We define $first(\alpha)$ where $\alpha \in T \cup NT$ as the set of symbols
that are the first symbols in a string that derives from $\alpha$. That is, $x
\in first(\alpha)$ iff $\alpha \implies^* x \gamma$ for some $\gamma$. We allow
$\alpha \in T$ because $\alpha \implies^* \alpha$.

We define $follow(\alpha)$ where $\alpha \in NT$ as the set of symbols that can
occur immediately after $\alpha$ in a valid sequence.

We define $first^+(\alpha)$ as $$first^+(\alpha) = first(\alpha) \cup
follow(\alpha)$$

A grammar $LL(1)$ property of a grammar means that if we have rules $A \to
\alpha$ and $A \to \beta$ both in the grammar, we would like $first(\alpha)
\cap first(\beta) = \emptyset$. This would mean that the grammar can look
ahead a single token $x.$ If $x \in first(\alpha)$ then pick $\alpha$, if $x
\in first(\beta)$, then pick $\beta$, otherwise error.

Let's look at a non $LL(1)$ grammar.

```
1. A -> aAb
2. A -> bB
3. A -> \e
4. B -> b
```

Consider the string `abbb`. When doing recursive descent paring, we could get the following two tables

| Rule | Sentential Form | Input   |
|------|-----------------|---------|
|      | `A`             | `!abbb` |
| 1    | `aAb`           | `a!bbb` |
| 2    | `abBb`          | `a!bbb` |

| Rule | Sentential Form | Input   |
|------|-----------------|---------|
|      | `A`             | `!abbb` |
| 1    | `aAb`           | `a!bbb` |
| 3?   | `ab`            | `a!bbb` |

We can transform some (not all!) process is called **left-factoring**. Whenever
you have an ambiguous choice, you factor out the first symbol which you have an
ambiguous choice to a new common non-terminal. However, given a CFG doesn't
meet the $LL(1)$ condition, it is undecidable whether or not an equivalent an
$LL(1)$ grammar exists.

Here is an example of a language which has no $LL(1)$ grammar.

$$L = \{a^n 0 b^n\} \cup \{a^n 1 b^{2n}\}$$

Here is a CFG to recognize $L$

```
S -> A | B
A -> aAb | a0b
B -> aBbb | a1bb
```

You need an unbounded number of $a$ characters before you can figure out
whether to pick `A` or `B`. That is, if you say you only need $n$, I can give
you a string that requires $n + 1$.

**Example:** Is the following grammar an $LL(1)$ grammar?

```
G -> M [num] "." [num]
G -> N
M -> "-"
M -> \e
N -> [num]
```

This is not an $LL(1)$ grammar. $$first^+(M) = \{\text{"-"}, \text{[num]}\}$$
$$first^+(N) = \{\text{[num]}\}.$$ Means that $$first^+(M) \cap first^+(N)
\ne \emptyset.$$

We can rewrite this grammar to be $LL(1)$ as such

```
G -> "-" [num] "." [num]
G -> [num] "." [num]
D -> "." [num]
D -> \e
```

**Example:** Convert the following grammar into an $LL(1)$ grammar with no
left-recursion.

```
G -> M N
M -> a b
M -> \e
N -> N a
N -> \e

# Eliminate left recursion
G -> M N
M -> a b
M -> \e
N -> \e N'
N' -> a N'
N' -> \e
# Simplify
G -> M N
G -> N
M -> a b
N -> a N
N -> \e

# Make LL(1)
# Realize that M and N can both start with a. Factor that out.
G -> \e
G -> a G'
G' -> b N
G' -> N
N -> a N
N -> \e

# We're done!
```

**Example:** Let's apply our algorithm to show that not all grammars are
$LL(1)$. (Well, really to just give you the idea that not all are. We haven't
shown our algorithm always works.)

```
G -> aAb | aBbb
A -> aAb | 0
B -> aBbb | 1

# Factor out common a in G
G -> a G1
G1 -> Ab
    | Bbb
A -> aAb | 0
B -> aBbb | 1
# Simpler
G -> a G1
G1 -> aAbb
    | 0b
    | aBbbbb
    | 1bb
A -> aAb | 0
B -> aBbb | 1

# Factor out common a in G1
G -> a G1
G1 -> G2
    | 0b
    | 1bb
G2 -> Abb
    | Bbbbb
A -> aAb | 0
B -> aBbb | 1
# Simpler
G -> a G1
G1 -> G2
    | 0b
    | 1bb
G2 -> aAbbb
    | 0bb
    | aBbbbbbb
    | 1bbbb
A -> aAb | 0
B -> aBbb | 1

# Oh no, we have to factor out a common a again. We're stuck in an infinite
# loop...
```

As we've gone over, here's the *rough* procedure for converting an $LL(1)$
grammar into a recursive descent parser.

1. Remove left recursion via intermediate rules / repetitions.
1. Massage the grammar (removing empty / redundant rules).
1. Do left-factoring until you get rid of all ambiguous rules. (You may have to
   massage the grammar to make it more obvious.)

#### Table-Based Recursive Descent Parser

If we're auto-generating a recursive descent parser, one of the easiest ways to
do it is to encode your grammar as a giant token-production table because then
all you have to do is write a table-driven parser which itself is pretty easy.

The table format is every row is a production to follow and the column is the
token received. Then your parser keeps track of its current
state/row/production, starting at the start state. It checks what the next
token is and determines the next production to check.

```python
class TableParser:
  """Pseudo-python describing a table driven parser."""

  def parse(self, tokens):
    """
    This is like a recursive descent parser except we use a loop with a stack
    because, well, that's exactly what recursion does but we have to have
    generic code so it's easier to loop like this. (Well, at least that's what
    we say.)
    """
    # processing is the current non-terminal or terminal we're processing
    processing = Stack()
    processing.push(EOF)
    while True:
      want = processing.peek()
      got = tokens.peek()
      if want == EOF and want == EOF:
        return AST
      elif instanceof(Terminal, want):
        if want == got:
          processing.next()
          tokens.next()
        else:
          raise Error(f"Looking for {want}, got {got}")
      else:
        # A -> B1 B2 ... Bn
        new_wants = self.table[want][got]
        if new_wants is None:
          raise Error(f"Got unexpected token expanding {want}")
        else:
          processing.next()
          # Push Bn ... B1
          # This is so B1 is on top
          for w in reversed(new_wants):
            processing.push(w)
```

Many high-quality programming languages opt for hand-written parsers because,
as you can see above, the error messages are lack-luster and it is hard to give
higher quality error messages. Also, the code takes more memory and normally
isn't faster.

### Bottom-Up Parsers

Bottom up parsers are called such because they start at the leaves gradually
build up the abstract syntax tree. Bottom up parsers big weakness is that they
do not have very good error reporting. However, they can parse *more languages*
by their nature and they also require *no* changes to grammars to handle, for
example, left-recursion and right-recursion elegantly.

We will be discussing $LR(1)$ parsers as the class bottom-up parser. They are
named similarly to $LL(1)$. $LR(1)$ means left-to-right scanning, rightmost
derivation, one lookahead.

**TODO:** Watch lecture video

## Context Sensitive Analysis

This is where we do type checking and other **semantic analysis**, like undeclared
variable usage.

For example, this is a type argument mismatch. A parser cannot identify this
error so we don't call it a **syntax error**. Instead this is a **semantic
error**.

```c
void foo(int a);
void main() {
  foo("Hi");
}
```

Similarly, this is use of an undeclared variable.

```c
void main() {
  printf("a %s", a);
}
```

*Why can't the parser detect semantic errors?* Semantic errors often require
depending on values, non-local information, and computed information.

There are two main approaches to doing semantic analysis: **ad-hoc
syntax-directed translation** and **attribute grammars**.

### Ad-Hoc Syntax-Directed Translation

To do syntax-directed translation as we discuss here, you associate code with
every single production. This code is run while you're parsing, running after
every production is taken.

Often, computations require some initialization of data (e.g. allocating data).
To do this formally we create a `Init` variable that derives to `\e` that does
all initialization. For example, with determining the cost of executing a basic
block. In practice though, we just add some initialization code at the start
element. Something like this

```
Start -> Init BB
Init -> \e  # cost = 0
BB...  # cost += cost(...)
```

This could be done by a parser generator. Here's a concrete example using YACC.

```yacc
# $$ refers to the attribute on the lhs
# $n refers to the attribute on the nth element of the rhs
Assign -> Ident = Expr;  $$ <- COST(store) + $3
Expr -> Expr + Term;  $$ <- $1 + COST(add) + $3
```

Because you are just associating code with productions, this is incredibly
flexible. This does restrict the evaluation order to be whatever order you
parse things in.

Often though if you're doing ad-hoc syntax-directed translation, you won't be
using a parser generator because that makes it (generally) easier to write.
*Why would you ever not use a parser generator?* Error messages. Error
handling. Maintainability.

### Attribute Grammar

Another similar example is attribute grammars.

An attribute with additional semantic analysis code an **attribute grammar**.
An attribute grammar is a normal CFG augmented with a set of rules. Every
symbol in a derivation has a set of **attributes** (e.g. they're structs) and
every production has a **code snippet** that describes how to compute a value
for each attribute.

Here is an example using pseudo-code. It comes the decimal value of a signed
binary number.

```
Number -> Sign List {
  List.pos = 0
  Number.val = if Sign.neg {
    -List.val
  } else {
    List.val
  }
}

Sign -> + { Sign.neg = false }
Sign -> - { Sign.neg = true }

List0 -> List1 Bit {
  List1.pos = List0.pos + 1
  Bit.pos = List0.pos
  List0.val = List1.val + Bit.val
}
List0 -> Bit {
  Bit.pos = List.pos
  Bit.val = List.val
}

Bit -> 0 { Bit.val = 0 }
Bit -> 1 { Bit.val = 2**Bit.pos }
```

We can make a graph of how the attributes are computed by an AST with a list of
each nodes attributes. For every attribute, we draw an arrow from what the
value depends on. For example, `List1.pos = List0.pos + 1` means that
`List1.pos` depends on `List0.pos`. This graph must be acyclic for all graphs,
otherwise the computation would (possibly) never terminate.

One of the weaknesses(?) of attribute grammars is the lack of global variables.

## Type Checking

Type checking is a form of correctness verification. It helps statically
prevent certain errors. **Type checking** is the process of determining whether
type expressions conform to the **type system**, that is a collection on rules
for types, of the language.

Some languages support **type inference**, which allows the developer to not
define the type of a given variable and instead the compiler will infer it from
context.

We call a language's type system **sound** if no runtime checking is necessary
to ensure that the program experiences no type errors at runtime.

When we are type checking, we need to determine when two types are equivalent.
There are two main ways to define this *type equivalence*: **structural
equivalence** and **name/nominal equivalence**. Two types are structurally
equivalent if their types have the same "shape". Two types are nominally
equivalent if their types are lexically defined the same. In the below example
`v1` and `v3` are structurally equivalent and `v1` and `v2` are nominally
equivalent.

```c
typedef struct { int a; int b; } X;
typedef struct { int a; int b; } Y;
X v1, v2;
Y v3;
```

Some people think such strict type-checking / type-equivalence is annoying or
needlessly restrictive. To make this easier certain languages support
**casts**, which explicitly convert two types using essentially built-in
conversion mechanisms, or **coercions**, which are like casts but implicit. If
two types are structurally equivalent, the cast has no cost at runtime. If two
types are not structurally equivalent, the compiler has to insert simple
instructions to for example increase the width of the number. Depending on the
languages semantics for casts and coercions, these can cause unexpected bugs or
vulnerabilities. For example C will implicitly coerce numbers which may result
in integer wraparound which introduces bugs or can even be insecurely optimized
by the compiler (since integer wraparound is undefined).

How do we determine the type of expressions? We do this using **type
synthesis**. Basically the compiler has a list of rules which it either has for
built-ins (e.g. `int + float -> float` or `int * int -> int`) or determines
from analyzing the source code. For example given a declaration like this

```c
int write(char *s) {
  // ...
}
```

If the compiler would saw an expression like `write(a)`, it would determine
that `a` has type `char *` and would determine that the entire expression has
type `int`.

### Polymorphism

Polymorphism is a really vague term that basically just means that a function
or method or class can work with multiple different type.

One of the classic methods for doing polymorphism is dynamic dispatch with
vtables. Java and Go use this with their interfaces and C++ does it with
virtual methods. However, these polymorphic method still need to check their
type. But this time we aren't just doing simple type equality because we can
accept many different types. How do we handle this?

Normally, we use interfaces or abstract classes, or the generic name of
**subtyping**. With interfaces or abstract classes we declare the behaviors
that the given type must have to be used in place of those interfaces.
Languages like Java and C++ use **nominal subtyping**, where the type must
explicitly says it implements that abstract class, while languages like Go use
**structural subtyping**, where the types must implement all the necessary
methods. Then when we try to provide a concrete class to an abstract class our
concrete class must be a subtype of the abstract class (in a way stated
before). What if we want to assign an abstract class to another abstract class?
Then the provided abstract class must be a subtype of the necessary abstract
class. This is done using the same mechanisms where the given abstract class
must explicitly implement/inherent from the necessary abstract class or must
provide the necessary methods.

*Note:* All types are considered trivial subtypes of themselves.

There is also **parametric polymorphism**, which is the classic *generics*.
Here you statically provide types to a function. This follows all the same
subtyping requirements of inheritance. However, here all the subtyping is done
at compile time so the language can guarantee more optimizations by not
requiring vtables and dynamic dispatch.

With dynamic dispatch and especially deeply nested inheritance trees, the
overhead necessary to call a virtual method can be very expensive as you have
to follow many different points.

# Middle-end

Concerned with optimizations of the code. Often do multiple passes using
different optimization methods because certain optimizations are more effective
after another or benefit from running multiple times. **Must not change the
meaning of the code**.

Core to the middle-end is the **intermediate representation (IR)** used. There
are many IRs that exist that focus on certain things like ease of optimizing,
ease of use, level of abstraction, speed of generation, etc. When designing or
choosing an IR, you have to carefully design it to optimize it for your use
case.

There are three main types of IRs:

* Structural: Graph/Tree based code.
  * Rust's HIR.
* Linear: Pseudo-assembly for an abstract machine.
  * LLVM IR.
* Hybrid: Combination of structural and linear used.
  * Control-flow graph.

## Structural IR

The canonical structural IR is the **abstract syntax tree (AST)**. This is
where every node in your program gets a single node. It is the starting point
of most other forms and even several optimizations, since it is directly what
you get from the source code. It is like the parse tree except simplified to
make it easier to use.

Similar to the AST, you can construct a **directed acyclic graph (DAG)**, which
is like a tree except branches can go down more than one level and multiple
edges (arrows) can point to the same node. This is useful for identifying
shared code/expressions, allowing for reducing code motion.

{{ figure(src="ast_v_dag.png", title="Tree vs DAG for Abstract Syntax") }}

## Linear IR

Linear code tends to be much closer to machine code, often being designed
(generally) as more heavily annotated, higher level assembly. They can make low
level optimizations (e.g. register allocation) much easier but make analyzing
higher level control flow more difficult.

There is **stack machine code**, which is mostly used for virtual machines
because they are easy to implement. Every operation acts on a global stack
except for `push` and `pop`. `push` pushes a new value from memory or immediate
onto the stack. `pop` pops the top value from the stack and stores it into
memory.

There is **three address code** which is like assembly except every operation
can only have exactly 3 operands. For example `r0 = r1 + r2` is a three address
code but `r0 = r1 + 2 * r2` is not (2 is an immediate and considered an
address). This is essentially a generic assembly, because most real hardware
have 1-3 operands per instruction, so this maps nicely.

There is **static single assignment (SSA)** form, which is actually the most
popular linear form used in major compilers today. SSA means that every
variable/register is written/set exactly once but can be read/used infinitely
many times. This makes analyzing code flow and statement dependency very easy.

To make SSA work, we need to do **renaming** and $\phi$ functions. Renaming is
the process of changing to the name of a variable whenever it is
written/mutated. The $\phi$ function is conceptually like a union. It takes
multiple different variables and returns one of them at runtime, meaning you
can't determine which at compile time. If you have $x_2 \leftarrow \phi(x_0,
x_1)$, then $x_2$ depends on both $x_0$ and $x_1$.

## Hybrid IR

The **control flow graph** is a graph of how the code flows. You've probably
studied it significantly in earlier classes, it's that graph that shows loops
and logical branches like a graph. This is useful for higher level
optimizations like combining loops, switching loops, and dead code elimination.

## LLVM Project

The LLVM project is a large project to produce high quality machine code for a
wide range of architectures and wide range of languages. The LLVM project is a
collection of optimizers on the LLVM IR (bundled into the `opt` binary),
converting low quality IR to high quality IR, and then backends that produce
machine code for various architectures (bundled into `llc`).

Then, new language designers simply need to emit LLVM IR (doesn't even need to
be high quality) and suddenly their language will produce high quality machine
for a wide variety of architectures. *The core part of LLVM is the IR
definition and the optimizers.*

Since the LLVM project is a common project for academics who experiment with
optimizations work on optimizations and has great industry support, it produces
incredibly high quality machine code.

### LLVM IR

Here is the LLVM IR assembly language reference:
https://llvm.org/docs/LangRef.html

The LLVM project uses static single assignment (SSA) IR called LLVM bitcode.
It's call bitcode because normally tools use a binary format for efficiency and
simplicity. There is also a human readable version that is kinda like RISC
assembly code except with infinite registers, types, structs, an understanding
of functions, and *tons* of instructions and annotations, like
[`phi`](https://llvm.org/docs/LangRef.html),
[`align`](https://llvm.org/docs/LangRef.html#attr-align), `global`, etc. All of
this makes LLVM IR easy to analyze and high level enough to be efficiently
implemented on many machines.

Here are a bunch of examples of how some C code could compile to LLVM IR. These
examples were cleaned up from examples with Clang 10 `-emit-llvm -O1`. You can
play around with this on [Godbolt Compiler Explorer](https://godbolt.org/).

#### Example 1

##### C
```c
int square(int num) {
  return num * num;
}
```

##### LLVM
```llvm
; %[name] is a register. You can give them any name but compilers tend to
; produce just incrementing numbers for simplicity.
; This is C so it's name is mangled like it would be in C++ or Rust.
define i32 @square(i32 %num) {
  %1 = alloca i32
  store i32 %num, i32* %1
  %2 = load i32* %1
  %3 = load i32* %1
  %4 = mul i32 %2, %3
  ret i32 %4
}
```

#### Example 2

##### C
```c
int array[100];
int x

struct list {
  int x;
  struct list *next;
};
```

##### LLVM
```llvm
%struct.list = type { i32, %struct.list* }

@array = global [100 x i32] zeroinitializer, align 16
@x = global i32 0, align 4
```

#### Example 3

##### C
```c
int *ptr;
ptr = ptr + 1;
```

##### LLVM
```llvm
%ptr = alloca i32*
%1 = load i32** %ptr
%2 = getelementptr i32* %1, i64 1 ; add 1 to ptr
; now %2 is the new pointer
```

#### Example 4

##### C
```c
int max(int *x, int y) {
  if (x && *x > y) {
    return *x;
  } else {
    return y;
  }
}
```

##### LLVM
```llvm
define i32 @max(i32* readonly %0, i32 %1) {
; if (x && %4) {
;   ...
; } else {
;   %7
; }
  %3 = icmp eq i32* %0, null
  br i1 %3, label %7, label %4

; if (... *x > y) {
;   return *x;
; } else {
;   %7
; }
4:
  ; t = *x
  %5 = load i32, i32* %0, align 4
  ; t > y
  %6 = icmp sgt i32 %5, %1
  ; return t or y
  br il %6, label %8, label %7

; return y
7:
  br label %8

8:
  ; if from 7, return y
  ; if from 4, return t = *x
  %9 = phi i32 [ %1, %7 ], [ %5, %4 ]
  ret i32 %9
}
```

Some things you can notice is that LLVM IR avoids explicitly representing the
stack. This is to more easily support a wider range of machines. It uses
`alloca` instead to represent the stack.

It also organizes code into functions with explicit arguments and return
instructions. And then functions are organized into modules (by file). Every
module is held in memory in a single large data structure. This allows for
optimization on a large amount of the program. However, it is not possible to
optimize across module (by the compiler). Instead it is done by the linker at
link time, called **link time optimization (LTO)**.

## Optimizations

There are several clever optimizations that people have thought up for
compilers. There are ***way*** too many for us to go over extensively.

We structure code in basic blocks. If we recognize the connections between
these basic blocks in the control flow diagram, we can eliminate dead code,
remove unnecessary jump instructions, unlock future optimizations.

TODO: Get from 10/21

**Constant propagation** is the process of evaluating as much code at compile
time as you can. Typically this is done by doing arithmetic on constants to
result in a smaller simple constant, potentially removing expensive
instructions. In the above example, we could simplify `someNum()` to just
`147.3` which could then be inlined as a constant.

```c
double someNum() {
  int a = 3;
  double b = 49.3;
  return a * b;
}
```

**Strength reduction** is the process of replacing expensive instructions with
cheaper instructions. For example integer division by 32 can be simplified to a
left shift by 5. In fact a lot of multiplications and divisions have extremely
clever optimizations like that. If you're iterating over an array using an
incrementing index, that can be optimized by a pointer which is just being
incremented, replacing an increment, multiplication, and addition with a single
addition every loop. Here's an example of a few.

```c
// division replaced with left shift
void division(int a) {
  return a / 32;
}
void division(int a) {
  return a >> 5;
}

// incrementing index replaced with pointer
void arrayIndex(int arr[], size_t n) {
  for (size_t i = 0; i < n; i++) {
    arr[i] = 0;
  }
}
void arrayIndex(int arr[], size_t n) {
  int *end = arr + n;
  int *p = arr;
  // in asm p++ would be ptr += sizeof(*p)
  for (; p != end; p++) {
    *p = 0;
  }
}
```

**Reducing code motion** is where you take some identify some expression that
is being repeatedly evaluated (e.g. in a loop). If that expression has no side
effects and doesn't depend on any values changing in the loop, then you can
evaluate that expression once and then store it in a temporary that you
repeated reference. Here is an example.

```c
// Calculate the nth prime, very expensive.
size_t nthPrime(size_t n);

// This technically evaluates nthPrime every time, which is very expensive.
void codeMotion(size_t n) {
  for (size_t i = 0; i < nthPrime(n); i++) {
    printf("%d\n", i);
  }
}
// This code is equivalent and evaluate nthPrime only once.
void codeMotion(size_t n) {
  size_t end = nthPrime(n)
  for (size_t i = 0; i < end; i++) {
    printf("%d\n", i);
  }
}
```

**Loop unrolling** is where you eliminate some jump instructions at the
exchange of code bloat by duplicating the code within the loop multiple times.
Below is C code with its unrolled version below. This isn't a great example
because you don't really reduce the amount of instructions necessary or unlock
auto-vectorization optimizations.

```c
// rolled up loop
void printNums(size_t n) {
  for (size_t i = 0; i < n; i++) {
    printf("%d\n", i);
  }
}

// unrolled loop by 4
void printNums(size_t n) {
  size_t i = 0;
  // Handle when n % 4 != 0
  switch (n % 4) {
  case 3:
    printf("%d\n", i++)
  case 2:
    printf("%d\n", i++)
  case 1:
    printf("%d\n", i++)
  case 0:
  }
  for (; i < n; i += 4) {
    printf("%d\n", i);
    printf("%d\n", i + 1);
    printf("%d\n", i + 2);
    printf("%d\n", i + 3);
  }
}
```

**Loop unswitching** is the process of extracting branches within a loop to
outside of the loop. This changes the number of comparisons necessary to finish
the loop from `n` to `1`, which can make the loop way more efficient to run by
itself by reducing the number of jumps and (in some cases) improving
instruction cache locality. It can also unlock auto-vectorization. Here is an
example of a loop and its unswitched version.

```c
// original loop
void printStuff(size_t n, bool a) {
  for (size_t i = 0; i < n; i++) {
    if (a) {
      printf("a\n");
    } else {
      printf("b\n");
    }
  }
}

// unswitched loop
void printNums(size_t n, bool a) {
  if (a) {
    for (size_t i = 0; i < n; i++) {
      printf("a\n");
    }
  } else {
    for (size_t i = 0; i < n; i++) {
      printf("b\n");
    }
  }
}
```

### Caches and Optimizations

TODO: Get from 10/21 lecture

**False sharing** is when two concurrently running processes continuously read
and write memory from the same cache line, even when the memory that they're
actually using is different. This is especially impactful when the two
processes are running on different CPUs. This means that every time one process
writes to the memory in the same cache line, it has to load it from the cache
and invalidate the other processes memory. This means that when the other
process next tries to write to that memory in the same cache line, it has to
load it from memory and invalidate the other processes memory. This results in
your processes continuously copying the cache line back and forth, thrashing
memory and wasting a ton of time.

This example below results in false sharing (taken from Wikipedia), where
`sum_x` needs to continually re-read `x` from main memory (instead of cache)
even though `inc_y`'s concurrent modification of `y` is irrelevant.

```c
struct foo {
  int x;
  int y;
};

static struct foo f;

// The two following functions are running concurrently
int sum_x(void) {
  int s = 0;
  for (int i = 0; i < 1000000; ++i) {
    s += f.x;
  }
  return s;
}

void inc_y(void) {
  for (int i = 0; i < 1000000; ++i) {
    ++f.y;
  }
}
```

# Back-end

The back-end primarily has three responsibilities: instruction selection,
instruction scheduling, and register allocation. Optimal register allocation is
an NPC problem, so often we just use heuristics to ensure near-optimal
solutions. This is similar to what we do for other optimizations.

As time goes on, hardware becomes more and more complex because they are no
longer designed to be understood primarily by humans and instead to be
primarily understood by compilers/computers. This can allow us to have higher
performance computers for cheaper. Because of this, ISAs are getting
increasingly complex. The compiler must understand this and produce high
quality code, hiding these complexities from the programmer.

## Memory and Compilers

Compilers need to understand the memory layout of the machine they're running
on. That way they can efficiently map the abstract memory model of the high
level language to the hardware's memory.

A traditional C-like memory model (which is what most languages use) has a
read-only code segment, a read-write static segment, a heap, and a stack. The
code segment and static segment have a known size at compile time, but the heap
and stack are growable and only known at runtime.

Normally, we put the read-only code segment at the lowest addresses.
Immediately after that we have mutable memory in a static segment. These have a
known size at compile time so we can put them directly next to each other.
Then, to prevent the heap and stack from running into each other, we put the
heap immediately after the static segment, having it grow to higher addresses,
and we have the stack be at the highest addresses, having it grown down to
lower addresses.

Having the stack and the heap really far apart used to be relevant when we
didn't have paged memory and virtual addresses, so we really needed to ensure
that the heap and the stack don't run into each other. Even as we have paged
memory this is still useful so we can pretend that memory is a single flat
address space without worrying about addresses collide.

## Procedure Abstraction

Functions are an incredibly common abstraction across languages and even in
assembly. How do we efficiently implement this on a machine which doesn't have
native support for procedures? First, to be able to call functions at all you
need a calling convention. You could use the standard C calling convention, you
could specify your own, or you could make your calling convention unspecified.

In general, to implement a procedure you have to perform the following steps:

1. The callers stores program state before it calls the procedure. For example
   it pushes the instruction pointer to a known place and also stores the
   registers it cares about onto the stack.
1. The caller jumps jumps to the address of the procedure it's calling.
1. The called procedure stores all registers it uses that the calling
   convention tells it to store.
1. The procedure does its work.
1. The procedure reverts the registers it stored.
1. The procedure jumps to the known instruction pointer location.
1. The caller restores all the registers it stored onto the stack.

As you can see, this is fairly expensive but also incredibly common. As such
many machines provide hardware interfaces to more efficiently call procedures.

In order to more easily organize the information and data local to each
procedure, we create something call **activation records** (AR) or **stack
frames**. These are **application binary interface** (ABI) dependent (i.e.
machine dependent) information about each procedure call. It's exact structure
depends on language and machine but often they contain the parameters for the
function, the return address, and all the local data.

{{ figure(src="stack_frame.png", title="Stack Frame / Activation Record") }}

Most languages put activation records on the stack (hence the name stack frame)
because they are only used during the execution of the function. For some
languages (like ML) put activation records on the heap because activation
records may be used after the heap.

### Calling Conventions

To maintain activation records, the caller must go through a pre-call sequence
and a post-return sequence. Likewise the callee needs to go through a standard
prolog and a standard epilog

This standard sequence is calling the calling convention. It determines what
registers need to be saved by the caller, what registers need to be saved by
the callee, where arguments are stored, where return values are stored, where
return addresses are stored, and all that fun stuff.

Here is some more information about the System V ABI for the Intel386
architecture. That is the C ABI for the Intel architectures.
http://sco.com/developers/devspecs/abi386-4.pdf

## Instruction Selection

**Instruction selection** along with **instruction scheduling** and **register
allocation** is one of the most important backend choices. For most machines,
there are many different ways to perform a computation where the cost depends
on the context. A classic example is that `mov rax, 0` is the same as `xor rax,
rax`.

Generally, the backend does this using a code generator with a set of rewrite
rules. These rewrite rules describe all the ways the IR can be converted to a
specific (series of) instructions. You normally do this by doing a post-order
traversal / bottom-up walk of the tree to convert expressions into
instructions. However, there are many matches for these rewrite rules for every
expression, each with different costs. How do we do we find the lowest-cost
match for each subtree?

One easy way is to compute all possible matches and choose the cheapest one.
This can be absurdly expensive as your list of operations increases. There is
also methods using dynamic programming.

## Instruction Scheduling

**Instruction scheduling** is the process of reordering instructions for
optimal execution. This is necessary when / because instructions can take
different number of cycles to complete and thus have different latencies. By
reordering instructions you "hide" the latencies. Essentially you want to do as
much as you can before you hit an instruction which depends on a previous
instruction. You can also potentially reduce the number of necessary registers.

This may be unintuitive but consider the following example.

```asm
// W <- w * 2 * x * y * z

// Schedule 1
loadAl  r0, @w => r1        // 1
add     r1, r1 => r1        // 4
loadAl  r0, @x => r2        // 5
mult    r1, r2 => r1        // 8
loadAl  r0, @y => r2        // 9
mult    r1, r2 => r1        // 12
loadAl  r0, @z => r2        // 13
add     r1, r2 => r1        // 16
storeAl r1     => r0, @w    // 18
// 21

// Schedule 2
loadAl  r0, @w => r1        // 1
loadAl  r0, @x => r2        // 2
loadAl  r0, @y => r3        // 3
add     r1, r1 => r1        // 4
add     r1, r2 => r1        // 5
loadAl  r0, @z => r2        // 6
mult    r1, r3 => r1        // 7
mult    r1, r2 => r1        // 9
storeAl r1     => r0, @w    // 11
// 14
```

As you can see the schedule 2 took fewer cycles because it moved instructions
that depends on previous instructions farther apart. This allows the machine to
make more progress while the other instruction(s) it depends on are in flight.

Note that schedule 2 also uses more registers. In some cases thus it would be
worse if it requires more cycles to spill the registers than it saves.

To help determine what instructions depend on each other, we build a
**dependence graph**, which is a directed graph. Each node in the graph is an
operation and every instruction's node has an arrow pointing directly to the
instruction which depend on it / must occur after it. Often each node is
annotated with the latency of the nodes plus all of its dependents.

There is a strategy to scheduling instructions called **local list instruction
scheduling**. It is done as follows.

1. Build a dependence graph $G$.
1. Compute a priority function over the nodes in $G$. (The priority function
   determines the latency of the instruction.)
1. 

*What are the weaknesses of this technique?* We can't determine what branch
will be taken, even which branch will be taken most of the time. We can't
determine where a load or store will occur in memory, for example will most of
the loads and stores of this variable be cache misses or cache hits? Those can
hugely effect the latency of the instruction.

## Register Allocation

**Register allocation** is the process of deciding what data goes where in the
machine.

A critical part of doing register allocation is determining the **liveness** of
a variable. A variable is live between its definition and its last use, the
range of these instructions / blocks is called its **live range**. Analysis of
live ranges is way easier if you use static single assignment (SSA) form.

If you have more variables alive at some time than your machine has registers,
then you won't be able to hold all of the values in registers and will have to
**spill** some. A register spill is just when you store the contents of the
variable into memory (e.g. on the stack).

We can transform register allocation into a graph coloring problem by using an
**interference graph**. To create an interference graph, create a node for
every variable (in SSA form). Whenever two variables are alive at the same
time, connect them with an edge. Now we can transform register allocation into
graph coloring by assigning each register a color and trying to minimize the
number of colors $k$ necessary to color the graph. If $k$ is less than or equal
to the number registers in your machine, then you're good. If $k$ is greater
than the number of registers in your machine, you need to find the optimal way
to make the graph color-able using the number of registers in your machine. You
modify the graph by introducing loads and stores, called register spills. You
need to minimize the number of necessary spills as well.

Both of these problems ($k$-color-ability and minimizing the number of spills)
is NP-Complete, essentially meaning they are extremely difficult. (Formally,
there is no known way to solve the problems in polynomial time, and they are
"as hard" as all other NP problems.)

One heuristic algorithm to perform register allocation is [**Chaitin's
algorithm**](https://en.wikipedia.org/wiki/Chaitin's_algorithm). It was
actually the first register allocation algorithm that used graph coloring!

# Theoretical Stuff

## Chomsky's Hierarchy

**Chomsky's hierarchy** of languages/grammars is a way of categorizing
**grammars**. A grammar $G = (N, \Sigma, P, S)$ is a set of non-terminal
symbols $N$, terminal symbols $\Sigma$, and productions $P$. One non-terminal
$S \in N$ is considered the start symbol. Productions $\alpha \to \beta \in P$
are rules that allow you to go from a sequence of lefthand side symbols $\alpha
\in (N \cup \Sigmap)^*$ to to a sequence of righthand symbols $\beta \in (N
\cup \Sigmap)^*$. We can categorize grammars by the amount of restrictions
placed on them. This allows us to categorize their computability.

* Regular Grammar: A grammar where every production has at most one righthand
  non-terminal symbol and arbitrarily many lefthand terminal symbols. There can
  be no lefthand non-terminals and no righthand terminals. This is called a
  righthand grammar, but if we switch the left and right rules we get a
  lefthand grammar.
* Context Free Grammar: A grammar where the lefthand side of productions is a
  single non-terminal and the righthand side is an arbitrary combination of
  terminals and non-terminals.
* Context Sensitive Grammar: A grammar where the lefthand side of productions
  is an arbitrary combination of non-terminals but no terminals and the
  righthand side is an arbitrary combination of terminals and non-terminals.
* Unrestricted Grammar: A grammar where the lefthand side of productions can
  have any arbitrary combination of terminal and non-terminals and the
  righthand side of productions can have again any arbitrary combinations.

*Note:* Technically these grammars are supersets of each other, but normally
when we say a grammar is "context free" we mean that it is the minimal
encompassing classification, that is it is not regular. Even though all regular
grammars and context free grammars.

A *regular grammar* is guaranteed to be able to be parsed/validated in $O(n)$
linear time by a *finite automata* (e.g. NFA). A *context free grammar* (CFG)
can be computed in linear time by a *pushdown automated* (PDA).

**Example:** The following is a regular language recognized by the regular
grammar below.
$$L = \{a^n : n \in \mathbb{N}\}$$
```
A -> aA | a
```

**Example:** The following is a context free language recognized by the context
free grammar below.
$$L = \{a^nb^n : n \in \mathbb{N}\}$$
```
A -> aAb | ab
```

**Example:** The following is a context sensitive language.
$$L = \{a^nb^nc^n : n \in \mathbb{N}\}$$

# Performance Analysis

This stuff is research which the professor is working on. It's not *incredibly*
relevant to constructing compilers but understanding performance and how to
debug it is good for optimizations.

## DrCCTProf

*CCT stands for calling context tree. DrCCTProf is developed by the professor's
research group and examples and docs can be found in the slides.*

In this class we will use [DrCCTProf](https://github.com/Xuhpclab/DrCCTProf)
which is a binary analyzer that tracks instructions (operator and operands),
registers (SIMD and general purpose), memory location, and storage locations of
variable (register or memory). It is designed to efficiently allow for call
path analysis, with ~2x overhead compared to the 100-1000x overhead of
Valgrind.

It is built on [DynamoRIO](https://dynamorio.org/). DynamoRIO does dynamic
binary instrumentation and is maintained by Google and is programmable using
DynamoRIO clients, which are programmed by registering event handlers. It
allows you to do things such as count the number of basic blocks executed
during execution.

Compared to DynamoRIO, DrCCTProf provides a (slightly) nicer (undocumented) API
for analyzing call path. It automatically builds a calling context tree and
interns symbols (optionally). It builds the calling context tree to enable
constant time querying of the call path because you just look up something from
a tree instead of unwinding the stack.

### DrCCTProf Usage

The general usage is initialization, instrumentation, analysis, storage, and
output.

* Initialization: Open files and call into DynamoRIO to initialize.
* Instrumentation: Instruct DrCCTProf about what things it should look at and
  what it should do when sees a certain thing (e.g. basic-block, instruction,
  etc.).
* Analysis: Run the program with the instrumentation.
* Storage: The instrumentation needs to efficiently store the memory either in
  DrCCTProf's `Map<uint64_t, uint64_t>`  or [shadow
  memory](https://en.wikipedia.org/wiki/Shadow_memory).
* Output: Collect/aggregate all of the stored information and create output.

DrCCTProf outputs data in a format which is compatible to HPCToolkin, a Java
GUI used to visualize the information more easily than the raw text output.

### Call Path Importance

To detect issues with generated code performance, we often need to know how the
code was reached. That way we can detect redundant/inefficient code. For
example, this basic block appeared twice in my execution trace, is that
redundant code in code generation or am I duplicating work? Without the call
path this is hard to determine.

It also allows detection of:

* Memory Safety Issues: data races, out of bounds array access.
* Performance Issues: False sharing detection (cache issues), etc.

### Data-centric DrCCTProf

By enabling data-centric detection in DrCCTProf, you keep track of every memory
access and where it is allocated. That is, what call to malloc, is it on the
stack, etc.

## DeadSpy

[DeadSpy](http://www.pace.rice.edu/uploadedFiles/Publications/deadspy.pdf) is a
tool which can help analyze **dead stores**. Dead stores are memory writes with
no intervening reads, so there are no effects of the write. The earlier write
that does nothing is called the **dead write** and write that replaces that
write is called the **killing write**.

DeadSpy, like DrCCTProf, analyzes machine code rather than the source code.
This means it is a general purpose tool that works on many different languages
(that compile to machine code).

Dead stores are most often caused by poor data structure choice, lack of design
for performance (no `restrict`, dead writes in source code, etc.), overly
aggressive compile optimizations, and **TODO**.

What we care the most about here is understanding why poor machine code
generation occurs. We can detect when we're being too aggressive with compiler
optimizations (sometimes compiler optimizations introduce issues if they are
applied in unexpected ways) or if we're being too conservative.
