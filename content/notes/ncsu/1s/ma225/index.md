+++
title = "MA 225: Foundations of Advanced Mathematics"
[extra]
teacher = "Dr. Fulp"
+++

Sadly I did not scan in my paper notes for this class, so all I have is this
small cheatsheet.

# Vocabulary

* Axiom: A statement simply accepted to be true.
* Theorem: A statement proved to be true using the axioms.
* Lemma: A small theorem used in a specific proof to make the proof
  cleaner/easier.
* Proposition: A sentence with one of two truth values.
  * "The sky is blue."
  * "4 divides 5."
* Universe ($\mathcal{U}$): All possible elements within the realm of
  discussion.
* Open Sentence: A propsoition dependent on a variable within the universe.
* Universal Quantifier ($\forall$): $(\forall x) P(x)$ is true iff the truth
  set of $P(x)$ is $\mathcal{U}$.
* Existential Quantifier ($\exists$): $(\exists x) P(x)$ is true iff the truth
  set of $P(x)$ is non-empty.
* Unique Quantifier ($\exists!$): $(\exists! x) P(x)$ is true iff the truth set
  of $P(x)$ contains only one value.
* Set: A collection of unique elements that cannot contain itself. (Sets can be
  elements!)
* Argot: The standard human language used to describe logical statements.

# Logical Equivalences

Let $P$, $Q$, and $R$ be propositions about elements $x$ in universe
$\mathcal{U}$. We write $P(x)$ iff proposition $P$ holds for some specific
element $x \in \mathcal{U}$. If we instead write simply $P$, we consider some
specific element $x \in \mathcal{U}$ where $P(x)$ holds.

* **Double Negation:**
  * $P \iff \neg(\neg P)$
* **Commutative Law:**
  * $P \lor Q \iff Q \lor P$
  * $P \land Q \iff Q \land P$
* **Associative Law:**
  * $P \lor (Q \lor R) \iff (P \lor Q) \lor R$
  * $P \land (Q \land R) \iff (P \land Q) \land R$
* **Distributive Law:**
  * $P \land (Q \lor R) \iff (P \land Q) \lor (P \land R)$
  * $P \lor (Q \land R) \iff (P \lor Q) \land (P \lor R)$
* **DeMorgan's Law:**
  * $\neg (P \land Q) \iff \neg P \lor \neg Q$
  * $\neg (P \lor Q) \iff \neg P \land \neg Q$
* **Implication Properties:**
  * $P \implies Q \iff \neg P \lor Q$
  * $\neg (P \implies Q) \iff P \land \neg Q$
  * $\neg (P \land Q) \iff P \implies \neg Q$
  * $\neg (P \land Q) \iff Q \implies \neg P$
  * $(P \iff Q) \iff (P \implies Q) \land (Q \implies P)$
  * $P \implies (P \implies R) \iff (P \land Q) \implies R$
  * $P \implies (P \land R) \iff (P \implies Q) \land (P \implies R)$
  * $(P \land Q) \implies R \iff (P \implies R) \land (Q \implies R)$
  * **Contraposition:**
    * $P \implies Q \iff \neg Q \implies \neg P$
* **Quantifiers and Negation:** Normally, this would be written out in English
  instead of being symbolic. However, to avoid ambiguity, we write this
  symbolically.
  * $\neg [ (\exists x) P(x)] \iff (\forall x)[\neg P(x)]$
  * $\neg [ (\forall x) P(x)] \iff (\exists x)[\neg P(x)]$

# Set Equivalences

Let $A$ and $B$ be sets in some universe $\mathcal{U}$.

* $A^c = \\{ x \in \mathcal{U} : x \notin A \\}$
* $A - B = A \backslash B = A \cup B^c$
* $A \subset B = B^c \subset A^c$
* DeMorgan's Law:
  * $\left(\underset{ A \subseteq \mathcal{U} }{\bigcap} \mathcal{U}\right)^c =
    \underset{ A \subseteq \mathcal{U} }{\bigcup} (A^c)$
  * $\left(\underset{ A \subseteq \mathcal{U} }{\bigcup} \mathcal{U}\right)^c =
    \underset{ A \subseteq \mathcal{U} }{\bigcap} (A^c)$

# Argot of Logical Statements

Let $P$ and $Q$ be propositions.

* $P \implies Q$
  * $P$ implies $Q$.
  * If $P$, then $Q$.
  * $Q$, if $P$.
  * $P$ only if $Q$.
  * $Q$, when $P$.
  * $Q$ whenever $P$.
  * $P$ is sufficient for $Q$
  * $Q$ is necessary for $P$.
  * $Q$ is a necessary consequent of $P$.
* $P \iff Q$
  * $P$ implies $Q$, and conversely.
  * $P$ if and only if $Q$.
  * $P$ iff $Q$.
  * $P$ is equivalent to $Q$.
  * $P$ is necessary and sufficient for $Q$.
