+++
title = "Interviewee's T-tests"
date = 2024-10-17
+++

I've been running a lot of coding interviews lately, especially for people coming directly from university. And it strikes me that many candidates will keep only a single informal test that they write and rewrite as they want to check things about their code.

This always sort of bothers me because when you delete a test the first time it passes, you lose the ability to catch regressions. But also because what a "test" is is so informal when you're rewriting the same piece of code over and over, many candidates don't really think about what exactly the goal is of any given test and won't comprehensively test their code.

The easy and practical way to avoid these pitfalls is to keep your old tests and copy-and-paste a new one instead of rewriting the same one over and over. But I'm going to propose a swaggier solution that I call **Interviewee's T-tests**.

The idea with T-tests is that they are an _extremely_ small and easy to understand test framework that you could write from memory and explain in less than a minute.

Below I've written some T-tests in all the programming languages I feel comfortable doing interviews in, with their output below the code. But it should be easy to write versions in your programming language of choice.

## Rust
```rust
fn test(name: &str, t: impl FnOnce() + std::panic::UnwindSafe) {
    println!("=== {name}");
    if std::panic::catch_unwind(t).is_ok() {
        println!("=== PASS\n");
    } else {
        println!("=== FAIL\n");
    }
}

fn main() {
    test("failing", || {
        assert!(false);
    });
    test("passing", || {
        assert!(true);
    });
}
```

```
=== failing
thread 'main' panicked at src/main.rs:12:9:
assertion failed: false
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
=== FAIL

=== passing
=== PASS
```

## Python

```python
import traceback

def test(t):
    print(f"=== {t.__name__}")
    try:
        t()
        print("=== PASS\n")
    except Exception as e:
        traceback.print_exception(e)
        print("=== FAIL\n")

@test
def failing():
    assert False

@test
def passing():
    assert True
```

```
=== failing
Traceback (most recent call last):
  File "/Users/eli.hunter/t.py", line 6, in test
    t()
  File "/Users/eli.hunter/t.py", line 14, in failing
    assert False
AssertionError
=== FAIL

=== passing
=== PASS
```

## C
```c
#include <stdio.h>

int failing() {
    return 1;
}

int passing() {
    return 0;
}

void test(char* name, int (*t) (void)) {
    printf("=== %s\n", name);
    int rtn = t();
    if (rtn == 0) {
        puts("=== PASS\n");
    } else {
        printf("returned %d\n", rtn);
        puts("=== FAIL\n");
    }
}

int main() {
    test("failing", failing);
    test("passing", passing);
}
```

```
=== failing
returned 1
=== FAIL

=== passing
=== PASS
```
