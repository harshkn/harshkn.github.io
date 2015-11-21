---
layout: post
title: 'Stats Review: Infinite sets'
date: 2015-01-05 11:53:16.000000000 -05:00
type: post
published: true
status: publish
categories:
- stats
tags:
- casella&amp;berger
meta:
  _edit_last: '20775'
author:
  login: etosch
  email: etosch@cns.umass.edu
  display_name: Emma Tosch
  first_name: Emma
  last_name: Tosch
---
I'm looking over Casella and Berger's [Statistical Inference](http://www.amazon.com/dp/0534243126/?tag=mh0b-20&amp;hvadid=3486843850&amp;ref=pd_sl_88k3cgtfa6_b) and reviewing some of the concepts. For the record, this book is exactly what you want if you need to take a statistics qualifying exam as a graduate student and not at all what a generalist will want. I actually enjoyed the material for the relatively clean overview it gave. There's depth, but not so much as to deter someone without a degree in mathematics. That said, I would not recommend this book for beginners. If you do want to slog through, get a supplementary book.

I'm currently looking at a section on page 4 of the second edition. There is a section that begins:

<blockquote>
The operations of union and intersection can be extended to infinite collections of sets as well If $$A_1, A_2, A_3, ...$$ is a collection of sets, all defined on a sample space \(S\), then
$$\quad\bigcup_{i=1}^\infty A_i = \lbrace x \in S : x \in A_i \text{ for some } i\rbrace$$<br />
$$\quad\bigcap_{i=1}^\infty A_i = \lbrace x \in S : x \in A_i \text{ for all } i \rbrace$$
For example, let \(S = (0, 1]\) and define \(A_i = [(1/i), 1]\). Then 
$$\bigcup_{i=1}^\infty A_i = \bigcap_{i=1}^\infty [(1/i), 1] =  \lbrace x \in (0,1] : x \in[(1/i), 1] \text{ for some } i \rbrace$$<br />
$$\quad\quad\quad = \lbrace x \in (0, 1]\rbrace = (0,1];$$
$$\bigcap_{i=1}^\infty A_i = \bigcap_{i=1}^\infty[(1/i), 1] = \lbrace x \in (0, 1] : x \in [(1/i), 1] \text{ for all } i \rbrace$$<br />
$$\quad\quad\quad = \lbrace x \in (0, 1] : x \in [1, 1]\rbrace = \lbrace 1 \rbrace$$    (the point 1)
</blockquote>

The above occurred after a discussion about countable and uncountable sets and proving theorems about sets from first principles (rather than Venn diagrams). If your eyes kind of glazed over while reading the above, no worries -- mine did, too. Actually, my reaction was worse than glazing over: I skimmed and thought I understood. However, as I started to tease apart what was written, I realized that there was much more going on here than I realized.

First of all, the preceding section describes reasoning about events that can be represented as finite sets, over finite sample spaces. This section builds on what we know to discuss the infinite case.

In our example, the sample space is the interval \((0, 1]\), which is defined over the reals. We are defining a _countably infinite_ set of intervals, each denoted by some \(A_i\). How do we know it's countably infinite? This is implied by the notation: we start at 1 and go to infinity. Therefore, there is a 1-1 correspondence with the natural numbers and thus the set of intervals is infinite. Let's take a look at some of the intervals (note that I can't draw lines, so imagine that the dashed line is actually connecting the endpoints and they're actually aligned):

$$A_1 : \underset{0}{\circ} \quad \quad \quad \quad \quad \quad \underset{1}{\bullet}$$<br />
$$A_2 : \underset{0}{\circ} \quad \quad \quad \underset{\frac{1}{2}}{\bullet} \mbox{-------}\underset{1}{\bullet}$$<br />
$$A_3 : \underset{0}{\circ} \quad \quad \underset{\frac{1}{3}}{\bullet} \mbox{-----------}\underset{1}{\bullet}$$<br />
$$\vdots$$<br />
$$A_\infty : \underset{0}{\bullet}\mbox{--------------------}\underset{1}{\bullet}$$

Now, the first statement says that the union of infinite subsets of a sample space should be equal to the sample space:

$$\lbrace x \in (0,1] : x \in[(1/i), 1] \text{ for some } i \rbrace$$.

The statement on the far left of the set notation, $$x\in (0,1]$$, gives us $$x$$'s domain: it is defined over $$S$$, which we have defined to be $$(0,1]$$. The right side of the "such that" states that every x in the domain $$S$$ that is in some partition $$A_i$$ is in this set. Recall that $$A_i$$ was defined as $$[(1/i), 1]$$. 

The above statement seems self-evident for rational numbers: for any rational number

$$ m/n, m > 0 \wedge n > 0 $$,

we know that there is a coarse-grained bound such that $$1/n$$ is less than or equal to $$m/n$$ and therefore $$m/n$$ is in $$A_n$$. But what about irrational numbers? For this to work, we would need a theorem that gives rational bounds on irrational numbers. This seems like something that ought to be out there, but I'm not sure where to look. I suspect hard-core PL theory, such as work on PCF, would have something to say about this. Number theory and/or real analysis would also be good candidates. 

In any case, we are trying to make the argument that for every number on the real interval $$(0,1]$$, there exists at least one sub-interval with rational endpoints, and that the union of these sub-intervals gives us back the interval $$(0, 1]$$ exactly. We don't miss any numbers on the interval $$(0, 1]$$. We might make some argument about the compactness of the interval.

The second statement defines intersection in this context. Here we would make an argument about the uniqueness of the intervals. That is, if $$i\not = j$$, then $$A_i \not = A_j$$. Every sub-interval is unique by virtue of its lower bound. However, the upper bound (1) is included in every interval. Therefore, the only interval all sub-intervals could share is the point 1.

It seems the point of the example was to show that countably infinite sets do occur and that the principles of set theory still hold. Defining the sample space as the reals appeals to practical considerations not fully explored in the text: we often model phenomena we measure as having infinite precision, but we know that our instruments can only be finitely precise. A countably infinite partition seems like it would introduce less error into a calculation than a finite one, i.e., a histogram. 
