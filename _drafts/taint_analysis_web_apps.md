---
layout: post
title: Taint Analysis of Web Applications
author:
- display_name: Emma Tosch
excerpt: <!-- summary -->
---

This post provides an overview of [TAJ: Effective Taint Analysis of Web Applications]( http://www.cs.tau.ac.il/~omertrip/pldi09/paper.pdf). We are looking at information flow analysis in the context of PlanOut programs and randomization.

<!-- summary -->

# What is information-flow analysis?
Information == the data coming in (perhaps because it can be modeled using information theory? Because it's a stream of bits?) Flow == the path of that data through a program. So, information-flow analysis applies invariants, and tries to make guarantees about where certain kinds of data go. In particular, that data may look the same so far as type systems are concerned, but in fact be different in emergent ways.

The classic paper cited (Denning 76) looks at information flow from a general systems perspective. It cites access control in operating systems. This classic paper attempts to define a set of constraints for which information leakage is decidable (since prior work showed that a data structure called an "access matrix" make testing for information leakage undecidable).

# What is taint analysis?
From the abstract of this paper:
...a form of information-flow analysis [that] establishes whether values from untrusted methods and parameters may flow into security-sensitive operations.

So, taint analysis is information-flow analysis as applied to security.




