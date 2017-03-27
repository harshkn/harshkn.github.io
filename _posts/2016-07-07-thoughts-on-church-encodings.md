---
layout: post
title: Thoughts on Church Encodings
type: post
comments: true
author:
  display_name: Emma Tosch
--- 

I was recently reviewing Church encodings, for no particular reason other than to refresh my memory. It's been a while since I first learned about them and I was pleased that they seemed so much easier to understand this time around! The exercise I was reviewing got me thinking about an idiom I'd learned and used often in Lisp dialects. 

<!--summary-->

Church encodings express various computation concepts using only the lambda calculus. The lambda calculus is a programming languge model that is very, very basic:

$$e = x \; | \; \lambda x.\; e \; | \; e\; e \; | \; (\; e\;)$$

where $$x$$ is an identifier. All concepts are defined with under two guiding principles:

1. If two items are distinct from each other, they have forms that allow you to make that distinction.
2. These forms, along with associated operations, obey the rules we define on them.

Okay, so that sounds very abstract. We can concretize these concepts by looking at, for example, booleans. On the one hand, we might think about true and false as just two tokens that must be different from each other. On the other hand, we can also think about true and false as being a *computation* that (1) enforces the cardinality of the booleans and (2) from a set of the appropriate size, reliably selects the true element and the false element.

So, the Church encoding for true is the function that, when given two elements, selects the first: $$\lambda b_1.\lambda b_2.\; b_1$$ and the Church encoding for false is the function that, when given two elements, selects the second: $$\lambda b_1.\lambda b_2. \; b_2$$. When I first learned about this, I was like, "ummm...okay." There's certainly something weird and unsettling about it, which I think at the time was related to the idea that we interpret this expression as a final value when we're thinking about it like a boolean, but then we can use it like a function inside boolean operations.

In some sense, I shouldn't have been uncomfortable with the concept in the first place, since at the time, I was doing more coding in Lisp dialects. Lisp has this mantra that "code is data and data is code."

Anyway, I was looking at exercises to define $$\texttt{and}$$, $$\texttt{or}$$, and $$\texttt{not}$$ in the lambda-calculus. If we allow a global store to hold labels in our language (purely for convenience of notation), we can define these as:

{% raw %}
$$\texttt{T} = \lambda b_1.\lambda b_2.\; b_1$$

$$\texttt{F} = \lambda b_1.\lambda b_2.\; b_2$$

$$\texttt{and} = \lambda b_1.\lambda b_2.\; b_1\;b_2\;\texttt{F}$$

$$\texttt{or} = \lambda b_1.\lambda b_2.\;b_1\;\texttt{T}\;b_2$$

$$\texttt{not} = \lambda b. \; b\;\texttt{F}\;\texttt{T}$$
{% endraw %}

What I remembered from doing this before was how it always felt like Church encodings of things are "backwards" in some way. This is the general feeling I've had with the constructivist approach to logic, when playing around in Coq. The path of reasoning just feels like it's slightly out of order.

What also struck me this time was how Lisp-like this is. Boolean operators in Lisp are often used to return default values. One common idiom (or at least, an idiom I *thought* was common) was to replace `(if t1 t2 t3)` with `(or (and t1 t2) t3)`. I thought maybe there was some correspondence with the Church encoding, but then I realized that the two encodings were not actually equivalent, because a negated guard (i.e. $$[[ t_1 ]] = false$$) and a falsey consequent (i.e. $$[[ t_2 ]] = false$$) will return $$t_3$$, when it should just return $$t_2$$. I thought that perhaps I had remembered the form incorrectly -- thinking about it carefully, I thought that maybe it should have been `(or (and t1 t2) (and (not t1) t3))`. This was definitely not something I'd used as a substitute for `(if t1 t2 t3)`, so I drew a truth table to figure out what was going on. The three alternate expressions are:

$$e_1 = (t_1 \wedge t_2) \vee (\neg t_1 \wedge t_3)$$

$$e_2 = ((t_1 \wedge t_2) \vee t_3)$$

$$ite = \texttt{if}\; t_1\; \texttt{then}\; t_2\; \texttt{else}\; t_3$$

We treat $$\wedge$$ and $$\vee$$ like their Church-encoded counterparts: wlog, $$a \wedge b$$ returns false if $$a$$ is falsy, and $$b$$ if $$a$$ is truthy. $$ite$$ is evaluted in the usual way.


| | $$t_1$$ | $$t_2$$ | $$t_3$$ | $$t_1 \wedge t_2$$ | $$\neg t_1 \wedge t_3$$ | $$e_1$$ | $$e_2$$ | $$ite$$ |
|-:| :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: |
| 1. | $$\texttt{T}$$ | $$t_2'$$ | $$t_3'$$ | $$t_2'$$ | $$\texttt{F}$$ |  $$t_2'$$ | $$t_2'$$ | $$t_2'$$ |
| 2. | $$\texttt{T}$$ | $$t_2'$$ | $$\texttt{F}$$ | $$t_2'$$ | $$\texttt{F}$$ |  $$t_2'$$ | $$t_2'$$| $$t_2'$$ |
| 3. | $$\texttt{T}$$ | $$\texttt{F}_1$$ | $$t_3'$$ | $$\texttt{F}_1$$ | **$$\texttt{F}_2$$** | **$$\texttt{F}_2$$** | $$t_3'$$ | **$$\texttt{F}_1$$**
| 4. | $$\texttt{T}$$ | $$\texttt{F}_1$$ | $$\texttt{F}_2$$ | $$\texttt{F}_1$$ | $$\texttt{F}_2$$ | **$$\texttt{F}_2$$** | $$\texttt{F}_2$$ | **$$\texttt{F}_1$$**
| 5. | $$\texttt{F}$$ | $$t_2'$$ | $$t_3'$$ | $$\texttt{F}$$ | $$t_3'$$ | $$t_3'$$ | $$t_3'$$ | $$t_3'$$
| 6. | $$\texttt{F}_1$$ | $$t_2'$$ | $$\texttt{F}_2$$ | $$\texttt{F}_1$$ | $$\texttt{F}_2$$ | $$\texttt{F}_2$$ | $$\texttt{F}_2$$ | $$\texttt{F}_2$$ 
| 7. | $$\texttt{F}_1$$ | $$\texttt{F}_2$$ | $$t_3'$$ | $$\texttt{F}_1$$ | $$t_3'$$ | $$t_3'$$ | $$t_3'$$ | $$t_3'$$ 
| 8. | $$\texttt{F}_1$$ | $$\texttt{F}_2$$ | $$\texttt{F}_3$$ | $$\texttt{F}_1$$ | $$\texttt{F}_3$$ | $$\texttt{F}_3$$ | $$\texttt{F}_3$$ | $$\texttt{F}_3$$

Rows 3 and 4 have non-equal outcomes for $$e_1$$, $$e_2$$, and $$ite$$. Row 3 is particularly egregious -- it's the case when our guard is true, but the consequent is falsy. This got me thinking about how, in practice, $$e_2$$ is a replacement for

    if guard
	then return A
	else return B

We generally use it in cases where we don't expect `A` to be falsy -- it's probably conceptually closer to the ternary operator (`guard ? A : B`).

The less egregious inconsistency is between $$e_1$$ and $$ite$$ in rows 3 and 4. The outcomes of both are falsy, but the provenance of the falsiness is different. This is fine when we live in a world where the population of false objects is 1 -- for example, in strongly statically typed langauges with a boolean type, or in Lisp, where the only falsy object is nil. If we are instead in a world like Javascript, where nil is truthy, but boolean false, 0, and undefined variables are falsy, we could run into problems. If we allow more than one instance to inhabit our falsy type, we could have the situation where $$F_1$$ could be a number, but $$F_2$$ could be an undefined variable.
