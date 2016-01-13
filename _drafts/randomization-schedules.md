---
layout: post
title: Randomization Schedules
type: post
published: true
status: published
categories:
- Research
tags:
- surveyman
author:
  login: etosch
  email: etosch@cs.umass.edu
  display_name: Emma Tosch
---
SurveyMan uses a full randomization schedule when determining question order bias. That is, for a flat survey with $$n$$ questions, each respondent will see one of the $$n!$$ possible randomizations. For any two questions $$q_i$$ and $$q_j$$, $$i\neq j$$, 50% of the orderings will have $$q_i < q_j$$ and the other 50% will have $$q_j < q_i$$.

Suppose we only had two questions in the survey in total. How many respondents would we need to query in order to get at least one of each ordering?

Let's start by querying one respondent. This will necessarily fix one of the orderings. For now, let's suppose that the ordering that we drew was $$q_i < q_j$$. Now we modify the question to ask how many additional respondents we need until we have at least one of the converse ordering. This process is easily modeled as a [geometric distribution](https://en.wikipedia.org/wiki/Geometric_distribution): each draw (each survey ordering) is independently and identically drawn, and we want to know _a priori_ how many draws we should plan to make to ensure that we get the converse ordering with high probability (say, 0.99).

Let $$N$$ be the total number of respondents we plan to query after that first draw and $$X$$ be the number of those respondents with the converse ordering. The expected value for this process is $$\mathbb{E}(X) = \sum_i 

Since we have already drawn the sequence $$q_iq_j$$, we condition on this and express the probability that we have been able to produce the converse ordering ($$q_jq_i$$) in $$N$$ draws as:

$$\mathbb{P}(X = N | q_iq_j) = (1 - \mathbb{P}(q_iq_j))^{N-1}\mathbb{P}(q_jq_i)$$

The goal in this simplified case is to select a value $$N$$ such that the quantity on the right is quite high (for example, 0.99):

$$0.99 = (1 - \mathbb{P}(q_iq_j))^{N-1}\mathbb{P}(q_jq_i)$$

$$0.99 = \left(1 - \frac{1}{2}\right)^{N-1}\cdot\frac{1}{2}$$

$$1.98 = \left(0.5\right)^{N-1}$$

$$\log(1.98) = (N-1)\log\left(0.5\right)$$

$$N = \left\lceil \frac{\log(1.98)}{\log(0.5)} + 1 \right\rceil$$
