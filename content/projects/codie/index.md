+++
title = "Codie the Code Runner"
description = "A Discord bot which runs code snippets in 20+ different languages."
weight = 1
+++

[Codie] is a Discord bot I created for personal use within my friend groups to
make sharing code-snippets with their output much easier to facilitate better
conversations around code.

## Why did I create Codie?

Before I made Codie, I often saw my friends and I sending snippets of code along
with a screenshot or a copy of that code's output. This was frustrating both as
someone sending code snippets because it involved opening separate apps and
copy-pasting stuff and as someone reading code snippets because the snippets
would be inconsistently formatted, sometimes as an image, sometimes as a code
block, and sometimes as raw text.

So my idea was that if someone sends a message containing a normal fenced code
block with a language annotation (Discord uses [CommonMark-style language
annotations](https://spec.commonmark.org/0.30/#info-string)) prefixed with some
command (I used `#!run`), Codie would automatically run the code and reply with
output of the program including stdout, stderr, and the exit status.

## How does Codie work?

When you send a message for Codie to run, it looks something like this.

````
I can't believe this sorting algorithm works! #!run version=3.7 ```py
def weirdsort(a):
  for i in range(len(a)):
    for j in range(len(a)):
      if a[i] < a[j]:
        a[i], a[j] = a[j], a[i]
  return a

print(weirdsort([5, 2, 3, 1, 4]))
```
````

*Aside:* Check out [*Is this the simplest (and most surprising) sorting
algorithm ever?*](https://ar5iv.labs.arxiv.org/html/2110.01111) for this sorting
algorithm!

The first thing Codie does upon receiving a message like this (or really any
message) is check if there is a `#!run` request, potentially with some options,
followed by a fenced code block. And if there is, she extracts the language and
the content from the code block and parses the options provided.

Without getting too deep into it, this is done using a regex to capture all the
input from `#!run` to the code block, followed by a custom options subparser
written with [nom](https://github.com/Geal/nom). We can get away with a regex to
extract the code blocks because Discord only supports code blocks with exactly 3
backticks [unlike CommonMark](https://spec.commonmark.org/0.30/#code-fence).

Once Codie has ensured the user has actually provided a valid run request with a
language she recognizes and options she recognizes for that language, she
matches this language and option pair with a [Docker] image, which she lazily
builds if necessary.

The reason Codie uses [Docker], beyond it being easy an easy way to set-up a
wide variety of different language toolchains with different configurations, is
for security.

*Aside:* Yes, I'm well aware that Docker isn't the most secure. See [future
work](#future-work).

Codie tries her best to run all code she's given securely. This means code
snippets should never be able to gain control, shutdown, or otherwise control
the server that Codie is running on. But it also means that code snippets
shouldn't be able to abuse the server's resources by running forever, slamming
the server's network or CPU, or using resources in any other way that interferes
with keeping the server online and healthy.

As such, the Docker containers Codie runs are locked down with no network
access, a small amount of CPU time, a small amount of memory, and all code is
run as the permission-less "nobody" user. Containers are also run with a 30
second timeout after which point they will be forcibly terminated and their
resources cleaned up.

After the container finishes running or is terminated, Codie collects the
stdout, stderr, and exit status of the code snippet using Docker logs and
reports that to the user via a reply.

All put together, this is what sending the example message I used at the top
actually looks like.

{{ figure(src="example_discord.png", title="Actually Using Codie") }}

*Aside:* You might have noticed both my message and Codie's message have been
edited. Yes! Codie does support editing and re-running messages so you can fix
typos or make other corrections.

## Future Work

Currently, Codie is a private Discord bot that I only run on servers with my
friends who I trust. In the future, I plan to make her publicly available.
However, I am not confident in the security provided by Docker alone to run this
publicly and will migrate to something like [Firecracker] before I make Codie
publicly available.

[Codie]: https://github.com/elihunter173/codie-discord
[Docker]: https://www.docker.com/
[Firecracker]: https://firecracker-microvm.github.io/
