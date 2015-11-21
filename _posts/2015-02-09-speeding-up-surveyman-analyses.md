---
layout: post
title: Speeding up SurveyMan analyses
date: 2015-02-09 13:58:29.000000000 -05:00
type: post
published: true
status: publish
categories:
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

A major bottleneck in some of our analyses is that we need to resample survey responses. Let $$n$$ denote the number of responses we've seen. Let $$m$$ denote the number of questions in the survey. $$b_i$$ is the number of bootstrap iterations. $$b_s$$ is a list of bootstrap samples. $$scores$$ is a list of scores. Our resampling approach is as follows:


1. For each response $$ r $$ in the list of all responses ($$O(n)$$):
    1. $$srs \gets$$ All other survey responses that have answered at least all the questions in $$ r $$ ($$ O(n) $$).
    2. For $$sr $$ in $$srs$$ ($$O(n)$$): 

        Truncate $$sr$$ so we are only looking at the set that overlaps with $$r$$ ($$O(m)$$).
    3. For $$i \gets 1$$ to $$b_i$$ ($$O(b_i)$$):

        Randomly select $$\vert srs\vert$$ samples from $$srs$$ and add to the list $$b_s$$ ($$O(n)$$).
    4. For $$b$$ in $$b_s$$ ($$O(b_i)$$):

        Compute the scores for $$b$$ and add to the list $$scores$$ ($$O(n)$$).

    5. Sort $$scores$$ in ascending order ($$O(b_i\log b_i)$$).
    6. Return true or false if $$r$$'s score falls outside the appropriate density ($$O(1)$$).

#### Reminder: randomization and equivalence are non-trivial

The randomization of SurveyMan introduces some non-trivial complications to the above process. I've [written](http://blogs.umass.edu/etosch/2014/07/31/defining-equality) [before](http://blogs.umass.edu/etosch/2014/07/31/metrics-to-answer-our-research-questions) [about](http://blogs.umass.edu/etosch/2014/06/19/what-does-it-mean-for-a-survey-to-be-correct-a-first-stab-at-formalizing-surveyman) how (1) relies on defining the notion of question equivalence carefully. When we have variants, if we attempt to match on the literal question, we may not have a statistically significant number of samples to compare. Consider the prototypicality survey. In that case, we had 16 blocks, each having 4 variants. This means we have up to $$4^{16}$$ distinct surveys! Resampling won't help us at all in that case.

#### Can we resample fewer times?

Although resampling becomes possible when we collapse variants into a single question, it's still time-consuming. Calculating scores for the phonology survey -- which had almost 100 questions, and for which we gathered about 300 responses -- takes upwards of 25 minutes. It would be nice if we could do this faster.

The current resampling code is very naive. As written above, we truncate the response lists first and then resample. In order to truncate, we first compare our response $$r$$ with our $$n$$ survey responses. Resampling involves drawing from the pool of $$n$$ survey responses $$b_i$$ times. When I am impatient, I set $$b_i$$ to 500. When I want to do things the right way, I set $$b_i$$ to 2000. Clearly the number of $$b_i$$ dominates the computation. We end up with $$O(n(n + nm + 2b_i n + b_i \log b_i))$$ = $$O(b_i n^2 + b_i\log b_i)$$ running time.

#### Caching
Would things be any better if we only computed the bootstrap samples once, and performed the truncation later? Let's consider the following alternative algorithm:
	       
1. For $$i \gets 1$$ to $$b_i$$ ($$O(b_i)$$):
     Randomly select $$n$$ samples from the responses and add to the list $$b_s$$ ($$O(n)$$).
2. For each response $$r$$ in the list of all responses ($$O(n)$$):
    1. For $$b$$ in $$b_s$$ ($$O(b_i)$$):
        1. $$srs \gets$$ All other survey responses that have answered at least all the questions in $$r$$ ($$O(n)$$).
        2. For $$sr$$ in $$srs$$ ($$O(n)$$):
            1. Truncate $$sr$$ so we are only looking at the set that overlaps with $$r$$ ($$O(m)$$).
            2. Compute the scores for $$b$$ and add to the list $$scores$$ ($$O(n)$$).
    2. Sort $$scores$$ in ascending order ($$O(b_i\log b_i)$$).
    3. Return true or false if $$r$$'s score falls outside the appropriate density ($$O(1)$$).

The above gives us a running time of

$$O(b_in + n(b_i(n + n(n + m)) + b_i\log b_i))=$$
$$O(b_in + b_in^2 + b_in^3 + b_inm + b_i\log b_i)=$$
$$O(b_in^3)$$

Yikes! Even though we are only computing the bootstrap sample once, we need to iterate over it. This iteration occurs in an outer loop, causing a blowup in the time to compute.

There are clearly more subtle analyses we can do. The first approach only computes the bootstrap sample over the truncated responses, which are often fewer than the total number of responses. We might be concerned about the garbage collector when we recompute new samples. 

Another concern I have with caching is that it introduces a bias. We are essentially reusing the same data (the bootstrap samples) and may run into multiple comparison issues. Of course, the point of the bootstrap simulation is that it approximates the true distribution and therefore this should be less of an issue the more bootstrap iterations we have.

#### Parallelizing

Another approach to speed things up would be to try to parallelize the score computation. When all of the analysis was written in Clojure, this would have been fine, since nothing was mutable. However, the Java implementation mutates scores in the original SurveyResponse object. We could get around this by completely decoupling the truncated view from the original SurveyResponse. I might do this to see if it makes a difference.
