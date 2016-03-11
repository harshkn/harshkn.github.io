---
layout: post
title: Thinking about Learning and Inference
author:
  display_name: Emma Tosch
---

When chatting with [Dan](http://cs.umass.edu/~dbarowy) the other day about [design matrices](https://en.wikipedia.org/wiki/Design_matrix), learning and inference, I thought I saw a potentially interesting analogy to PL.

<!--summary-->

Let $$n$$ be the number of samples we collect and $$m$$ be the number of features in our system. Let's take a simple problem that can be solved using linear regression. Then the model we use is

$$ y = \beta X + \epsilon$$

and we try to find some vector $$\beta$$ that minimizes the cost of the difference between the true $$y$$ and an estimate $$\hat{y}$$. Applied statisticians and machine learning practitioners may spend considerable time selecting appropriate features. Ideally, given a large pool of possible features, we can learn which are important and select those to make predictions for test inputs.

What struck me was that when we start out trying to address a problem, our $$m$$ features are unknown and our $$n$$ features to classify are potentially infinte. During learning, we fix $$m$$. During prediction (for a single instance of prediction), we fix $$n$$. This is like saying that learning is parameterized by its features, while inference is parameterized by its samples. We could then treat learning and inference as parameterized modules. I'm not sure I've really seen the probabilistic programming languages community treat problem this way.
