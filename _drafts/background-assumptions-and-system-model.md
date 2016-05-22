---
layout: post
title: Background Assumptions and System Model
type: post
comments: true
author:
  display_name: Emma Tosch
---
What are the priniciples that make an experimentation system sound? There are a set of basic assumptions that allow us to reason about the interactions between concurrently running experiments, variables or parameters not represented in a particular experimental procedure, and those parameters of interest. The underlying experimentation system must reflect these assumptions; if it does not, then all of our analyses may be invalid. 

<!--summary-->

Many companies have invested in experimentation systems over the years:

| System | Year | Venue | Company |
| --- | :---: | :---: | :---: |
|  [Layers](http://dl.acm.org/citation.cfm?id=1835810) | 2010 | KDD | Google |
| [Experimentation Platform](https://expplatform.sharepoint.com/Pages/default.aspx) | 2006 | KDD | Microsoft |
|

Here we describe the issues they've uncovered and attempt to describe the necessary and sufficient assumptions an experimentation system must have, in order for the kinds of analyses we are proposing to be valid: any analysis we do statically is based upon a model of the dynamic part of a system. Randomization may be very sensitive to incorrect modelling in the dynamic part of system, especially when it involves human behavior. We discussed some of these issues previously [in a prior post about the basic requirements for crowdsourcing systems](https://expplatform.sharepoint.com/Pages/default.aspx).

# Sampling-Related Assumptions

At the very start of the experimentation-analysis pipeline, we must have a reliable way to sample the population.

# Analysis-Related Assumptions

# Deployment-Related Assumptions

On its surface, controlled experimentation is easy: once we have selected our participants, we just randomly allocate them to treaments (also known as variants). However, this simple act of allocation becomes much more thorny when we consider the complexity of users interacting with an online system. Before we can even reason about what might happen when "things go wrong," we must first consider what it means for "things to go right."

The [Google Layers paper](http://dl.acm.org/citation.cfm?id=1835810) gives an informal specification for a massive experimentation system requiring both a large number of participants and a large number of concurrent experiments. In a perfect world, all parameters could be varied independently; this would allow many experimenters to run their experiments concurrently, so long as the parameters of interest do not overlap. Formally, suppose experimenter $$A$$ is doing an experiment using some set of parameters whose names are represented by$$\lbrace A_1, \ldots, A_n\rbrace$$ and experimenter $$B$$ is doing an experiment at the same time using some set of parameters whose names are represented by $$\lbrace B_1, \ldots, B_m\rbrace$$. So long as $$A \cap B = \emptyset$$, the two experimenters may run both of their experiments at the same time, *on the same population*.

However, since we don't live in an ideal world, we need to deal with the fact that many times, parameters of interest may not be varied independently. For example, if $$a_i$$ is `text-color` for buttons and $$b_j$$ is `background-color` for buttons, we will have a disasterous situation if we allow *text-color* and *background-color* to be set to the same value. The quick-and-dirty way of handling this is to just ensure that this never happens. The smarter way is what this paper suggestions:

> The solution we propose in this paper is to parittion the parameters into subsets, and each subset contains parameters that cannot be varied independently of each other. A subset is associated with a layer that contains experiments, and draffic diversion into experiments in different layers is orthogonal.

So, modifying our condition above,

# Future Work

**Linking analyses properly** One of the things we'd like to be able to do in the experimentation-analysis pipeline is to formally hook up the generated contrasts with the variable of interest $$Y$$ during the analysis phase. The Google layers authors bring up an important point about analysis and metrics:

> Standardized metrics should be easily available for all experiments so that experiment comparisons are fair: two experimenters should use the same filters to remove robot traffic when calculating a metric such as [click-through rate].

We are agnostic about what $$Y$$ is when we analyze Planout scripts. However, we may want a library of $$Y$$s for users to choose from. That is, instead of allowing users to build their query for $$Y$$ using raw user data, such as a database query of reuslts, they would need to either use a predefined metric or implement a new one with a standard name.

# Questions/Concerns

The author's mantra for experimentation is *more, faster, better*. When describing what they mean by *better*, they write:

> Invalid experiments should not be allowed to run on live traffic. Valid but bad experiments (e.g., buggy or unintentionally producing really poor results) should be caught quickly and disabled.

Kohavi
"Trustworthy controlled experiments"
