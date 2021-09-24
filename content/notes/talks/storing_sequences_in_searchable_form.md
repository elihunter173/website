+++
title = "How to store massive sequence collections in a searchable form"
date = 2020-03-11
[extra]
speaker = "Dominik Kempa"
+++

Our goal is to compress sequential data in an (efficiently) searchable form.

The motivation is the Human Genome Project. It has produced 75 TiB of raw
information but ~99% of all of that information is identical. Therefore
traditional compression algorithms work extremely well, for example we can
compress the raw data to about ~0.7 GiB with just `zip`. This form is not
searchable.

There are other compression algorithms which are searchable however. You create
an index and then compress that. This gives you a small searchable index.

*Note:* The compression indexes we'll be talking about only support full
matches. Work is done on supporting any regular expression.

Index have the following properties:
* **Size:** is how large the compressed algorithm is. Normally compressed
  indexes have size of $O(c)$ or $O(c \log n)$ where $c$ is the compressed size.
* **Functionality:** is what kind of searches the index can support. Normally
  either plain access (weak) or full search (powerful).
* **Query Time:** is how long the search takes. Normally the runtime for these
  "fast" indexes are $O(\log n)$ or $O(\log^2 n)$.

There are two main approaches for building these kind of indexes. There is
**offline**, which constructs some query-able data structure to disk. This
takes a lot of CPU and time but supports faster querying in general. There is
**online** which queries more directly.

There are three main lossless compression types:
* Statistical coding
* Lempel-Ziv
* Burrows-Wheeler transform

We are the least interested in statistical coding because it lacks an
interesting property (that I didn't write down).

Interesting, Lempel-Ziv and Burrows-Wheeler compression types are equivalent up
to $O(\log n)$ runtime scaling.
