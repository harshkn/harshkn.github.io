---
layout: post
title: Kozen's Semantics
author:
  login: etosch
  email: etosch@cics.umass.edu
  display_name: Emma Tosch
  first_name: Emma
  last_name: Tosch
---
One of the hottest areas in computer science right now is "probabilistic programming languages." Depending on the subfield of the person you talk to, you'll get a different answer for what this means:

1. Researchers in data science who have a strong statistics background might think of [R](https://www.r-project.org/), [SPSS](http://www.ibm.com/analytics/us/en/technology/spss/), or [scipy](https://www.scipy.org/). Data scientists will use programming languages that have high-level libraries for specifying models and running statistical tests. They will likely want to be able to reason about missing data, or unobserved data. They will also prioritize tools for exploratory data analysis, from function calls of descriptive statistics to sophisticated data visualizations.

2. Experts in machine learning might use [Stan](http://mc-stan.org/), [Figaro](), or another specialized langauge for classes of problems, like [Factorie]()


Here's a [fun introduction to PPLs](https://media.nips.cc/Conferences/2015/tutorialslides/wood-nips-probabilistic-programming-tutorial-2015.pdf), as seen by the Machine Learning community. There's some background missing, especially from the PL perspective, but this presentation gives an important perspective -- that of people who are actually trying to use these things.

# Scott-Scrachey Foo

In his [seminal paper from 1970](https://ropas.snu.ac.kr/~kwang/520/readings/sco70.pdf), Dana Scott lays out the foundation for a denotational semantics of a computer program. Remember, the semantics of a program is a function that maps from the program to some other space -- in the denotational context, that space is the mathematical interpretation of computer programs.

This article came out before the introduction of category theory into computer science. It also predates a lot of the formalization of programming languages -- cite Cousot & Cousot 76 and 79.

Scott is working from an imperative framework that must reason about state and side effects. This paper introduces the idea of a data store, $$\sigma$$ as a function that maps locations to values: $$\Sigma : L \rightarrow V$$, where $$l\in L$$ represents any arbitrary data location and $$v\in V$$ represents any arbitrary value. Implicit in his description is that $$\sigma$$ is stateful. Scott then defines $$\Sigma$$ to be the set of all possible states. From this, he defines commands $$Y : \Sigma \rightarrow \Sigma$$, which map states to state.

__Aside:__ We aren't really in the world of functional programming yet, so we don't yet have a notion of __referential transparency__. Anyway, the core of Scott's formalization of state storage and lookup is a pun on the __data structure__ of a map and on the mathematical object known as a map (also called a homomorphism): the data structure of a map "maps" keys to values. Our notation of `{"key1" : "val1", "key2" : "val2"}` could just as easily be expressed by the function $$f(k) = \left{ \begin{matrix} "val1", \text{ if k == "key1"\\ "val2", \text{ if k == "key2"} \end{matrix}$$. This pun is a key insight into the operational view of computation: functions as we learn them in school, those that are the most "interesting" are those that can be represented consciencely. When we say "conscicely", we mean something along the lines of: we can compute the output of some function/map conscicely iff there it takes less storage space to compute the output for every possible input than it would be to simply store every possible input and output in a map data structure.

Scott then discusses the case where the store may hold commands. For cases where location $$l$$ contains a command, we have the signature $$\sigma(l) : \Sigma \rightarrow \Sigma$$ -- $$\sigma(l)$$ is the result of looking up the command, and all commands take us from states to other states (i.e., $$\Sigma \rightarrow \Sigma$$). He belabors this point because we know that computer programs can be thought of as sequences of commands, and these commands are stored somewhere, and when those commands are fetched, that process will look something like this:

1. Suppose the next command is at location $$l$$.
2. Get this command ($$\sigma(l)$$).
3. Execute this command by applying it to the current state ($$\sigma(l)(\sigma)$$).

At this point, Scott points out that $$\sigma(l)(\sigma)$$ looks a lot like the self-application problem. He introduced this paper by pointing out that one of the most challenging problems in formalizing programming languages (at the time) was dealing with functions as first-class values.  Note that the $$\sigma$$ used to look up $$l$$ is the same as the $$\sigma$$ providing the environment to execute that command. 



Scott then points out that $$\sigma(l)$$ is a command


# So why does no one cite Kozen?

Okay, so it isn't really that no one cites Kozen, but citations of his work seem scant in the applied domains. There's a practical reason for this -- this 