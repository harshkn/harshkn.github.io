---
layout: post
title: PlanOut Evaluation
comments: true
type: post
author:
  display_name: Emma Tosch
---

On the one hand, PlanOut is straightforward and should be easy to reason about: the language does not permit user-defined functions and none of the operators use loops or recursion. Experiments are designed to provide apples-to-apples comparisons between
two or more equivalent treatment groups, yet PlanOut programs are able to assign individuals to treatment groups using any number of users characteristics or
complex logic.  To analyze such experiments, one therefore needs to be able to
determine what kinds of contrasts between the variables which define a treatment
(the experimental contrasts), and the propensity to receive a treatment (the propensity scores).

What makes reasoning about PlanOut scripts tricky is that free variables may sit around unevaluated: we may have some expression such that there is no way to simplify it down to a base value without further information from the system. This post describes how the analyzer interprets expressions in the presence of unknown values.

<!--summary-->

# Boolean Expressions

Boolean expressions are fairly easy to reason about because of the relationship between truth values and boolean operators. When boolean literals take on truth values, we are guaranteed to be able to simplify their expressions because each truth value either absorbs or dominates the connective. For example, we know that in the expression $$a \vee b$$, if $$a$$ evaluates down to `false`, then the truth value of the expression $$a \vee b$$ is completely determined by the truth value of $$b$$; in this case, `false` is the absorbing value for disjunction. Conversely, if $$a$$ evaluates down to `true`, then the whole expression $$a \vee b$$ evaluates down to `true`, since `true` is the dominating value for disjunction.

Evaluation for truth values is trivial:

{% raw %}
$$\frac{}{\langle \mathbf{true}, \Delta \rangle \Downarrow_b \mathbf{true}}$$

$$\frac{}{\langle \mathbf{false}, \Delta \rangle \Downarrow_b \mathbf{false}}$$
{% endraw %}

If a variable has a value in the context, then we just look up the value. However, if it does not have a value, then the variable is external. We annotate the variable with `+` to denote that its value is unknown statically.

{% raw %}
$$\frac{x \in \Delta}{\langle x, \Delta \rangle \Downarrow_b \Delta(x)}$$

$$\frac{x \not\in \Delta}{\langle x, \Delta \rangle \Downarrow_b +x}$$
{% endraw %}

The unary not operator behaves as expected:

{% raw %}
$$\frac{\langle e, \Delta  \rangle \Downarrow_b \mathbf{true}}{\langle \neg e, \Delta \rangle \Downarrow_b \mathbf{false}}$$

$$\frac{\langle e, \Delta \rangle \Downarrow_b +x}{\langle \neg e, \Delta \rangle \Downarrow_b \neg (+x)}$$

{% endraw %}

Wolog, if the first variable in a disjunction evaluates down to true, then the whole expression is true. If the first variable evaluates down to false, then the second variable fully determines the value of the expression.

{% raw %}
$$\frac{\langle e_1, \Delta \rangle \Downarrow_b \mathbf{true}}{\langle e_1 \vee e_2, \Delta \rangle \Downarrow_b \mathbf{true}}$$

$$\frac{\langle e_1, \Delta \rangle \Downarrow_b \mathbf{false} \quad \langle e_2, \Delta \rangle \Downarrow_b \mathbf{true}}{\langle e_1 \vee e_2, \Delta \rangle \Downarrow_b \mathbf{true}}$$

$$\frac{\langle e_1, \Delta \rangle \Downarrow_b \mathbf{false} \quad \langle e_2, \Delta \rangle \Downarrow_b +x}{\langle e_1 \vee e_2, \Delta \rangle \Downarrow_b +x}$$

$$\frac{\langle e_1, \Delta \rangle \Downarrow_b +x_1\quad \langle e_2, \Delta \rangle \Downarrow_b +x_2}{\langle e_1 \vee e_2, \Delta \rangle \Downarrow_b (+x_1) \vee (+x_2)}$$

{% endraw %}

The rules for conjunction are similar. We can apply deMorgan's laws to evaluate as much of the expression as possible:

{% raw %}
$$\frac{\langle e_1, \Delta \rangle \Downarrow_b x_1 \quad \langle e_2, \Delta \rangle \Downarrow_b x_2}{\langle \neg (e_1 \vee e2), \Delta \rangle \Downarrow_b \neg (+x_1) \wedge \neg (+x_2) }$$
{% endraw %}

# Arithmetic Expressions

Arithmetic expressions operate similarly, but the analogue of disjunction is summation (subtraction) and the analogue of conjunction is multiplication (division).

{% raw %}
$$\frac{}{\langle n, \Delta \rangle \Downarrow_a n}$$

$$\frac{x\in\Delta}{\langle x, \Delta \rangle \Downarrow_a \Delta(x)}$$

$$\frac{x\not\in\Delta}{\langle x, \Delta \rangle \Downarrow_a +x}$$
{% endraw %}

We flatten the parse tree by distributing the operations so that $$(a + b)(x + y)$$ becomes $$ax + ay + bx + by$$.

{% raw %}
$$\frac{\langle x_1, \Delta \rangle \Downarrow_a n_1 \quad \langle y_1, \Delta \rangle \Downarrow_a n_2 \quad n_3 = n_1n_2 \quad \langle x_2, \Delta \rangle \Downarrow_a +x_2 \quad \langle y_2, \Delta \rangle \Downarrow_a +y_2}{\langle (x_1 + x_2)(y_1 + y_2), \Delta \rangle \Downarrow_a n_3 + n_1(+x_2) + n_2(+y_2) + (+x_2)(+y_2)}$$
{% endraw %}

The commutativity of addition allows us to rearrange the expression and evaluate down the expression down to two components -- the first part is a number, and the second is a set of terms (summands) that are a series of products, each of which have at least one external term.
