---
title:  "The Rationale of Paper Range"
---

Since this is my first post to the Paper Range, I figured I'd describe some of
the design choices I made while creating it. So, first off this blog uses
[Jekyll](https://jekyllrb.com/) as its framework. The reason for this is (a) I
didn't want to have to deal with hosting and managing a dynamic website; (b) it
is incredibly easy to set up with GitHub Pages, which this is currently hosted
under; and (c) it means I can write in Markdown, so this is what my posts look
like.

![Me Writing This]({{ "/assets/img/2019-03-31-rationale/writing.png" |
relative_url }})

This blog being static was one of my biggest requirements, since I want to deal
with as few security issues as possible, and I plan on eventually self-hosting
this on an old computer or a Raspberry Pi. I could have gone with a hosting and
design service, but I wanted to have more control because I thought it would be
fun to learn and play around with setting up my own website.

Also, I know that the design of this website is very plain; my friends have
made fun of me extensively for it. However, I had a short but restrictive list
of requirements for the design of this website: I wanted something that both
worked well on everything and didn't look awful. Because of that, I chose
[Marx](https://github.com/mblode/marx) as my CSS framework, which I've done
almost no configuration of so far. I don't think it looks bad, it loads quickly
even with awful Internet connection and works well both on mobile and desktop.
Hell, it even works in the terminal. I actually wish more websites looked like
this one; there's something so nice about a website that just loads (fairly)
quickly and works on everything.


![The Paper Range on ELinks]({{
"/assets/img/2019-03-31-rationale/elinks.png" | relative_url }})

**Note (09 Jun 2019):** Since I wrote this article, I have changed the name
from "Paper Range" to just be my name and done various design changes. I've
kept the article unchanged for the sake of posterity and most of the
information still stands.
