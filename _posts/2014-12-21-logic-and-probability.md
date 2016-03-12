---
layout: post
title: Logic and Probability
date: 2014-12-21 15:52:09.000000000 -05:00
type: post
published: true
comments: true
status: publish
categories:
- Formal Methods
- Research
tags: []
meta:
  _edit_last: '20775'
author:
  login: etosch
  email: etosch@cns.umass.edu
  display_name: Emma Tosch
  first_name: Emma
  last_name: Tosch
---
When I first started at UMass, I had effectively no background in statistics or probability. So, when I was taking the first course in the graduate stats sequence, I tried to frame what I was learning in terms of things I already understood. When I saw the conditional probability $$\mathbb{P}(Y\;\vert\; X)$$, I couldn't help but think:
<!--comment-->

$$\begin{array}{|l} X \\ \hline \vdots \\ Y \\ \hline \end{array}\\ X \rightarrow Y$$

Assumption seems to be a close analogy of observation, and if we analyze each construct operationally, they both have a strict order (i.e., observe/assume $$X$$, then derive/calcuate the probability of $$Y$$). Both hold $$X$$ fixed in some way for part of the calculation. Suppose we then say that $$X$$ implies $$Y$$ with some probability $$p$$. If we denote this as $$X \overset{p}{\rightarrow} Y$$, then we have some equivalence relation where $$X \overset{p}{\rightarrow} Y \equiv \mathbb{P}(X\rightarrow Y) = p \equiv \mathbb{P}(Y\;\vert\;X) = p$$.

Since $$X \overset{p}{\rightarrow} Y$$ is just normal logical implication, with a probability attached, we should be able to use the usual rewrite rules and identities (after all, what's the point of modeling this as a logic if we don't get our usual identities, axioms, and theorems for free?). In classical logic, implication is short for a particular instance of disjunction: $$X \rightarrow Y \hookrightarrow \neg X \vee Y$$. We can then rewrite our probabilistic implication as $$\neg X \overset{p}{\vee} Y$$ and say $$\mathbb{P}(\neg X \vee Y) = p \equiv \mathbb{P}(\neg X \cup Y) = p$$.

Similarly, we want to have the usual rules of probability at our disposal, so by the definition of conditional probabilities, $$\mathbb{P}(Y\;\vert\; X) = \frac{\mathbb{P}(Y\;\cap\;X)}{\mathbb{P}(X)}$$. We can apply the above rewrite rule for implication to say $$\mathbb{P}(\neg X \cup Y) = p \equiv \frac{\mathbb{P}(Y\;\cap\;X)}{\mathbb{P}(X)} = p$$. This statement must be true for all events/propositions $$X$$ and $$Y$$.

Let's take a closer look at a subset of events: those where $$X$$ is independent of $$Y$$, denoted $$X \bot Y$$. Independence is defined by the property $$\mathbb{P}(Y\;\vert\; X)=\mathbb{P}(Y)$$. From this definition, we can also derive the identities $$\mathbb{P}(X\cap Y) = \mathbb{P}(X)\mathbb{P}(Y)$$ and $$\mathbb{P}(X\cup Y) = \mathbb{P}(X) + \mathbb{P}(Y)$$. Now we can rewrite $$\mathbb{P}(\neg X \cup Y) = p \equiv \frac{\mathbb{P}(Y\;\cap\;X)}{\mathbb{P}(X)} = p$$ as $$\mathbb{P}(\neg X) + \mathbb{P}(Y) = p \equiv \mathbb{P}(Y) = p$$. Since the relations on either side are equivalent, we can then substitute the right into the left and obtain $$\mathbb{P}(\neg X) = 0 \equiv \mathbb{P}(Y) = p$$. Although this looks a little weird, it's still consistent with our rules: we're just saying that when the events are independent (a notion that has no correspondence in our logical framework), the probability of the implication (i.e., the conditional probability) is wholly determined by $$Y$$ -- if $$X$$ happens (which it will, almost surely) then $$Y$$'s marginal is $$p$$. If $$X$$ never happens (which it won't), then $$Y$$ is 0, and the probability of the whole implication is 0.

Now let's consider how this works over events that are not independent. For this example, let's gin up some numbers:

$$\mathbb{P}(X) = 0.1 \quad\quad \mathbb{P}(Y) = 0.4 \quad\quad \mathbb{P}(X \cap Y) = 0.09$$.

Note that $$X\not\bot\; Y$$ because $$\mathbb{P}(X\cap Y) \not = 0.04$$. Recall that because either $$X$$ or $$Y$$ are supersets of $$X\cap Y$$, their marginals cannot have a lower probability than their intersections. 

Now let's compute values for either side of the equivalence $$\mathbb{P}(\neg X \cup Y) = p \equiv \mathbb{P}(Y\;\vert\; X) = p$$. First, the conditional probability:

$$\mathbb{P}(Y\;|\; X) = \frac{\mathbb{P}(Y\cap X)}{\mathbb{P}(X)} = \frac{0.09}{0.1} = 0.9 = p$$

Now for the left side of the equivalence, recall the definition of union:<br />
$$\mathbb{P}(\neg X \cup Y) = \mathbb{P}(\neg X) + \mathbb{P}(Y) - \mathbb{P}(\neg X \cap Y)$$. 

Since we don't have $$\mathbb{P}(\neg X \cap Y)$$ on hand, we will need to invoke the law of total probability to compute it: $$\mathbb{P}(\neg X \cap Y) = \mathbb{P}(Y) - \mathbb{P}(X\cap Y) = 0.4 - 0.09 = 0.31$$.

We can now substitute values in:<br />

$$\mathbb{P}(\neg X \cup Y) = 0.9 + 0.4 - 0.31 = 0.99 = p$$. 

Now our equivalence looks like this:<br />

$$\mathbb{P}(\neg X \cup Y) = 0.99 \equiv \mathbb{P}(Y\;\vert\; X) = 0.9$$,<br />
which isn't really much of an equivalence at all.
So what went wrong? Clearly things are different when our random variables are independent. Throughout the above reasoning, we assumed there was a correspondence between propositions and sets. This correspondence is flawed. Logical propositions are atomic, but sets are not. The intersection of non-independent sets illustrates this. We could have identified the source of this problem earlier, had we properly defined the support of the random variables. Instead, we proceeded with an ill-defined notion that propositions and sets are equivalent in some way.
