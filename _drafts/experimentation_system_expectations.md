---
layout: default
title: Experimentation System Expectations
categories:
- Research
tags: [planout, experiman]
author:
  display_name: Emma Tosch
---

The PlanOut DSL only addresses the assignment part of running an experiment. It relies on an underlying system that manages experimentation: one that

gatekeeper component (am I eligible) -- A system for rapidly determining whether a user fits some set of criteria. This piece of the system is independent of the

Don't the same people being experimented on every time.

Prnciples:

* Every qualified participant is equally likely to be selected: every subject on an experimentation system has some set of attributes associated with them. We can represent a qualified participant as a database selection $$\sigma_P(\mathcal{U})$$, where $$P$$ is the predicate that, when satisfies, indicates a user is eligible and $$\mathcal{U}$$ is the population of users. Then we want a system such that $$\forall u \in \mathcal{U}, \mathbb{P}_{sample}(u) = \frac{1}{\mathcal{U}}$$.
- All non-experimental variable are either fully controlled or uniformly distributed.

How do we deal with attributes that may vary with time? 


Amongst participating 
