+++
title = "MA 405: Introduction to Linear Algebra"
[extra]
teacher = "Dr. Alina Duca"
+++

# Scanned Notes

[Scanned PDF.](ma405.pdf)

# Cheatsheet

Thruout this cheatsheet, I use Householder notation. That is, matrixes are
denoted with capital English letters $A, B, ...$, vectors are denoted with
lowercase English letters $a, b, ...$, and scalars are denoted with Greek
letters $\alpha, \beta, ...$.

## Vector Space Properties

We say a set $V$ over field $F$ with operations addition $+$ and scalar
multiplication $*$ is a **vector space** if and only if the following properties
hold for all vectors $u, v, w \in V$ and all scalars $\alpha, \beta \in F$.

*Note:* A field is the scalars that make up vectors in $V$. Often $F$ is the
real numbers $\mathbb{R}$.

* Addition:
  * Closure: $u + v \in V$.
  * Commutativity: $u + v = v + u$.
  * Associativity: $(u + v) + w = u + (v + w)$.
  * Identity: $\exists 0 \in V$ such that $u + 0 = u$.
  * Additive Inverse: $\exists -u \in V$ such that $u + (-u) = 0$.
* Multiplication:
  * Closure: $\alpha * u \in V$.
  * Identity: $\exists 1 \in F$ such that $1 * u = u$.
* Distributivity:
  * Vector Additive Distributivity: $\alpha * (u + v) = (\alpha * u) + (\alpha *
    v)$.
  * Scalar Additive Distributivity: $(\alpha + \beta) * u = (\alpha * u) +
    (\beta * u)$.
  * Scalar Multiplicative Distributivity: $(\alpha\beta) * u = \alpha * (\beta *
    u)$.
