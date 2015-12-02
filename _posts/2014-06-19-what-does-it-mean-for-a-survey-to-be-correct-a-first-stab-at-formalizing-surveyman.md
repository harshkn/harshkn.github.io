---
layout: post
title: What does it mean for a survey to be "correct"? -- Part I.
date: 2014-06-19 15:05:06.000000000 -04:00
type: post
published: true
status: publish
categories:
- Research
tags:
- surveyman
meta:
  _edit_last: '20775'
author:
  login: etosch
  email: etosch@cns.umass.edu
  display_name: Emma Tosch
  first_name: Emma
  last_name: Tosch
---
One of the arguments we keep making about SurveyMan is that our approach allows us to debug surveys. We talk about the specific biases (order, wording, sampling) that skew the results, but one thing that we don't really emphasize in the tech report is what it really means for a survey to be correct. Here I'd like to tease out various notions of correctness in the context of survey design.

#Response Set Invariant

Over the past few months, I've been explaining the central concept of correctness as one where we're trying to preserve an invariant: the set of answers returned by a particular respondent. The idea is that if this universe were to split and you were not permitted to break off, the you in Universe A would return the same set of answers as the you in Universe B. That is, your set of answers should be invariant with respect to ordering, branching, and sampling. 

![The Real Kirk]({{ site.baseurl }}/assets/capt-kirk_yellowCU-001_1196284873.jpg){:style="width=50%; align=left"}
![This guy]({{ site.baseurl }}/assets/pine.jpeg){:style="width=50%; align=right"}
These guys should give the same responses to a survey, up to the whole timeline split thing.


<p><b>Invalidation via biases</b> Ordering and sampling can be flawed and when they are, they lead to our order bias and wording bias bugs. Since we randomize order, we want to be able to say that your answer to some question is invariant with respect to the questions that precede it. Since we sample possible wordings for variants, we want to be able to say that each question in an <code>ALL</code> block is essentially "the same." We denote "sameness" by treating each question wording variant as exchangeable and aligning the answer options. The prototypicality survey best illustrates variants, both in the question wording and the option wording:</p>

{{% insert {{ site.baseurl }}/_tablepress_tables/2014-06-18-prototypicality-csv.html %}}
![prototypicality]( {{ site.baseurl }}/_tablepress_tables/2014-06-18-prototypicality-csv.html)
<p>[table id=5 /]</p>

# Invalidation via runtime implementation

Clearly ordering and sampling are typical, well-known biases that we are framing as survey bugs. These bugs violate our invariant. We have also put restrictions on the survey language in order to preserve this invariant. I <a href="http://blogs.umass.edu/etosch/2014/03/21/regarding-survey-paths/">discussed</a> these restrictions <a href="http://blogs.umass.edu/etosch/2014/03/19/static-analysis/">previously</a>, but didn't delve into their relationship with correctness. In order to understand the correctness of a survey program, we will have to talk a little about semantics.

Generally when we talk about language design in the PL community, we have two sets of rules for understanding a language: the syntax and the semantics. As with natural language, the syntax describes the rules for how components may be combined, whereas the semantics describes what they "really mean". The more information we have encoded in the syntax, the more we can check at compile time -- that is, before actually executing the program. At its loosest, the syntax describes a valid surface string in the language, whereas the semantics describes the results of an execution.

When we want "safer" languages, we generally try to encode more and more information in the syntax. A common example of this is type annotation. We can think of this extra information baked into the language's syntax as some additional structure to the program. Taking the example of types, if we say some variable <code>foo</code> has type <code>string</code> and then try to use it in a function that takes type <code>number</code>, we should fail before we actually load data into <code>foo</code> -- typically before we begin executing the program.

In SurveyMan, these rules are encoded in the permitted values of the boolean columns, the syntax of the block notation, and the permitted branch destinations. Let's first look at the syntax rules for SurveyMan.

##<a href="#syntax">SurveyMan Syntax : Preliminaries</a>

Before we define the syntax formally, let us define two functions we'll need to express our relaxed orderings over questions, blocks, and column headers:</p>
<p>$$ \sigma_n : \forall (n : int), \text{ list } A \times n \rightarrow \text{ list } A \times n$$</p>
<p>This is our random permutation. Actually, it isn't *really* a random permutation, because we are not using the randomness as a resource. Instead, we will be using it more like a nondeterministic permutation (hence the subscript "n"). We will eventually want to say something along the lines of "this operator returns the appropriate permutation to match your input, so long as your input is a member of the set of valid outputs." $$\sigma_n$$ takes a list and its length as arguments and returns another list of the same length. We can do some hand-waving and say that it's equivalent to just having a variable length argument whose result has the same number of arguments, so that</p>
<p>$$ \sigma_n([\text{apples ; oranges ; pears}], 3) \equiv \sigma_n(\text{apples, oranges, pears})$$</p>
<p>and the set of all valid outputs for this function would be</p>
<p>$$ \lbrace \text{[apples ; oranges ; pears], [apples ; pears ; oranges], [oranges ; pears ; apples],}$$<br />
$$\quad \text{[oranges ; apples ; pears], [pears ; apples ; oranges], [pears ; oranges ; apples]} \rbrace$$.</p>
<p>We are going to abuse notation a little bit more and say that in our context, the output is actually a string where each element is separated by a newline. So, if we have for example </p>
<p>$$\sigma_n(\text{apples, oranges, pears}) \mapsto [\text{oranges ; pears ; apples}]$$, </p>
<p>then we can rewrite this as </p>
<p>$$\sigma_n(\text{apples, oranges, pears}) \mapsto \text{oranges}\langle newline \rangle \text{pears}\langle newline \rangle \text{apples}$$, </p>
<p>where $$\langle newline \rangle$$ is the appropriate newline symbol for the program/operating system.</p>
<p>Why not encode this directly in the typing of $$\sigma_n$$? The initial definition makes the syntax confined and well-understood for the (PL-oriented) reader. Since we're defining a specific kind of permutation operator, we want its type to be something easy to reason about. The "true" syntax is just some sugar, so we have some easy-to-understand rewrite rules to operate over, rather than having to define the function as taking variable arguments and returning a string whose value is restricted to some type. Note that I haven't formalized anything like this before, so there might be a "right way" to express this kind of permutation operator in a syntax rule. If someone's formalized spreadsheets or databases, I'm sure the answer lies in that literature.</p>
<p>The above permutation operator handles the case where we have a permutation where we can use some kind of equality operator to match up inputs and outputs that are actually equal. Consider this example: suppose there are two rules in our syntax:</p>
<p>$$\langle grocery\_list \rangle ::= \langle fruit\rangle \mid \sigma_n(\langle fruit\rangle,...,\langle fruit\rangle)$$<br />
$$\langle fruit \rangle ::= \text{ apple } \mid \text{ orange } \mid \text{ pear } \mid \text{ banana } \mid \text{ grape }$$</p>
<p>Suppose store our grocery list in a spreadsheet, which we export as a simple csv:<br />
<code><br />
apple<br />
banana<br />
orange<br />
</code><br />
Then we just want to be able to match this with the $$grocery\_list$$ rule. </p>
<p>Next we need to introduce a projection function: a function to select one element from an ordered, fixed-sized list (i.e. a tuple). This will actually be a family of functions, parameterized by the natural numbers. The traditional projection function selects elements from a tuple and is denoted by $$\pi$$. If we have some tuple $$(3,2,5)$$, then we define a family of projection functions $$\pi_1$$, $$\pi_2$$, and $$\pi_3$$, where $$\pi_1((3,2,5))=3$$, $$\pi_2((3,2,5))=2$$, and $$\pi_3((3,2,5))=5$$. Our projection function will have  to operator over list, rather than a tuple, since it will be used to extract values from columns and since we will not know the total number of columns until we read the first line of the input. The indices correspond to the column indices, but since columns may appear in any order, we must use the traditional permutation operator to denote the correct index:</p>
<p>$$\pi_{\sigma(\langle column \rangle)}(\langle col\_data \rangle_{(\sigma^{-1}(1))}, \langle col\_data \rangle_{(\sigma^{-1}(2))},...,\langle col\_data \rangle_{(\sigma^{-1}(n))})$$</p>
<p>Now we have some set of projection functions, $$\pi_{\sigma(\langle column \rangle)}$$, the size and values of which we do not know until we try to parse the first row of the csv. However, once we parse this row, the number of columns ($$n$$ above) and their values are fixed. Furthermore, we will also have to define a list of rules for the valid data in each column, but for column headers recognized by the SurveyMan parser, these are known ahead of time. All other columns are treated as string-valued. We parameterize the column data rules, using the subscripts to find the appropriate column name/rule for parsing.</p>
<h6><a href="#syntax">SurveyMan Syntax : Proper</a></h6>
<p></p>
<p>$$\langle survey \rangle ::= \langle block \rangle \mid \sigma_n(\langle block \rangle, ...,\langle block \rangle)$$</p>
<p>$$\langle block \rangle ::= \langle question \rangle \mid \sigma_n(\langle block \rangle, ..., \langle block \rangle)$$<br />
$$\quad\quad\mid \; \sigma_n(\langle question \rangle,...,\langle question \rangle) \mid \sigma_n(\langle question \rangle, ... ,\langle block \rangle,...)$$</p>
<p>$$\langle row \rangle ::= \langle col\_data \rangle_{(\sigma^{-1}(1))},...,\langle col\_data \rangle_{(\sigma^{-1}(n))} $$</p>
<p>$$\langle question \rangle ::= \langle other\_columns \rangle\; \pi_{\sigma(\mathbf{QUESTION})}(\langle row \rangle)$$<br />
$$\quad\quad\quad\quad\quad\;\langle other\_columns\rangle\;\pi_{\sigma(\mathbf{OPTIONS})}(\langle row \rangle) \;\langle other\_columns \rangle$$<br />
$$\quad\quad\mid\;\langle question \rangle \langle newline\rangle \langle option \rangle$$</p>
<p>$$\langle option \rangle ::= \langle empty\_question\rangle \; \langle other\_columns\rangle \; \pi_{\sigma(\mathbf{OPTIONS})}(\langle row \rangle) \; \langle other\_columns \rangle$$<br />
$$\quad\quad\mid\;\langle other\_columns\rangle \;\langle empty\_question\rangle \;  \pi_{\sigma(\mathbf{OPTIONS})}(\langle row \rangle) \; \langle other\_columns \rangle$$<br />
$$\quad\quad\mid\;\langle other\_columns\rangle \; \pi_{\sigma(\mathbf{OPTIONS})}(\langle row \rangle) \; \langle empty\_question\rangle \;\langle other\_columns \rangle$$<br />
$$\quad\quad\mid\;\langle other\_columns\rangle \; \pi_{\sigma(\mathbf{OPTIONS})}(\langle row \rangle) \; \langle other\_columns\; \rangle\langle empty\_question\rangle \;$$</p>
<p>$$\langle empty\_question \rangle ::= \langle null \rangle$$</p>
<p>$$\langle other\_columns \rangle ::= \langle null \rangle \mid \langle other\_column \rangle \; \langle other\_columns \rangle$$</p>
<p>$$\langle other\_column \rangle ::=  \langle repeatable\_column \rangle$$<br />
$$\quad\quad \mid\; \langle nonrepeatable\_column \rangle $$<br />
$$\quad\quad \mid \;\langle changable\_column\rangle$$</p>
<p>$$\langle nonrepeatable\_column \rangle ::= \;, \;\pi_{\sigma(\mathbf{FREETEXT})}(\langle row \rangle) \mid \pi_{\sigma(\mathbf{FREETEXT})}(\langle row \rangle)$$</p>
<p>$$\langle repeatable\_column \rangle ::= \; , \;\pi_{\sigma(\mathbf{BLOCK})}(\langle row \rangle) \mid \pi_{\sigma(\mathbf{BLOCK})}(\langle row \rangle)$$<br />
$$\quad\quad\mid\; , \;\pi_{\sigma(\mathbf{EXCLUSIVE})}(\langle row \rangle) \mid \pi_{\sigma(\mathbf{EXCLUSIVE})}(\langle row \rangle)$$<br />
$$\quad\quad\mid\; , \;\pi_{\sigma(\mathbf{ORDERED})}(\langle row \rangle) \mid \pi_{\sigma(\mathbf{ORDERED})}(\langle row \rangle)$$<br />
$$\quad\quad\mid\; , \;\pi_{\sigma(\mathbf{RANDOMIZE})}(\langle row \rangle) \mid \pi_{\sigma(\mathbf{RANDOMIZE})}(\langle row \rangle)$$<br />
$$\quad\quad\mid\; , \;\pi_{\sigma(\mathbf{CORRELATION})}(\langle row \rangle) \mid \pi_{\sigma(\mathbf{CORRELATION})}(\langle row \rangle)$$</p>
<p>$$\langle changable\_column \rangle ::= , \;\pi_{\sigma(\mathbf{BRANCH})}(\langle row \rangle) \mid \pi_{\sigma(\mathbf{BRANCH})}(\langle row \rangle)$$<br />
$$\quad\quad\mid\; , \;\pi_{\sigma(\langle user\_defined \rangle)}(\langle row \rangle) \mid \pi_{\sigma(\langle user\_defined \rangle)}(\langle row \rangle)$$</p>
<p>$$\langle col\_data \rangle_{(\mathbf{FREETEXT})} ::= \mathbf{TRUE} \mid \mathbf{FALSE} \mid \mathbf{YES} \mid \mathbf{NO} \mid \langle string \rangle \mid \#\;\lbrace\; \langle string \rangle \; \rbrace$$<br />
$$\langle col\_data \rangle_{(\mathbf{BLOCK})} ::= (\_|[a-z])?[1-9][0-9]*(\setminus .\_?[1-9][0-9]*)*$$<br />
$$\langle col\_data \rangle_{(\mathbf{BRANCH})} ::= \mathbf{NEXT} \mid [1-9][0-9]*$$<br />
$$\langle col\_data \rangle_{(\mathbf{EXCLUSIVE})} ::= \mathbf{TRUE} \mid \mathbf{FALSE} \mid \mathbf{YES} \mid \mathbf{NO}$$<br />
$$\langle col\_data \rangle_{(\mathbf{ORDERED})} ::= \mathbf{TRUE} \mid \mathbf{FALSE} \mid \mathbf{YES} \mid \mathbf{NO}$$<br />
$$\langle col\_data \rangle_{(\mathbf{RANDOMIZE})} ::= \mathbf{TRUE} \mid \mathbf{FALSE} \mid \mathbf{YES} \mid \mathbf{NO}$$</p>
<p><small>Notes :
<ul>
<li>The last match for the $$\langle block\rangle$$ rule should really be four rules -- one for one question and one block, one for one question and many blocks, one for one block and many questions, and one for many blocks and many questions, but I thought that would be cumbersome to read, so I shortened it.</li>
<li> All $$\langle col\_data \rangle$$ rules not explicitly listed are unconstrained strings.</li>
<li> Remember, the subscripted $$n$$ in $$\sigma_n$$ is for nondeterminism; the $$n$$ indexing the column data denotes the number of input columns.</li>
<li> We also accept json as input; the json parser assigns a canonical ordering to the columns, so generated ids and such are equivalent.</li>
</ul>
<p></small></p>
<p>What's worth noting here are the things that we intend to check on the first pass of the parser and compare them against those that require another iteration over the structure we've built. We would like to be able to push as much into the syntax as possible, since failing earlier is better than failing later. On the other hand, we want the syntax of the language to be clear to the survey writer; if the survey writer struggles to just get past the parser, we have a usability problem on our hands.</p>
<p>A good example of the limitations of what can be encoded where is the <code>BRANCH</code> column. Consider the following rules for branching:</p>
<ol>
<li> Branch only to top-level blocks.</li>
<li> Branch only to static (i.e. non-floating) blocks.</li>
<li> Only branch forward.</li>
<li> Either branch to a specific block, or go to the next block (may be floating).</li>
</ol>
<p>(1) and (2) are encoded in the grammar -- note that the regular expression does not include the subblock notation used in the <code>BLOCK</code> column's regular expression. Furthermore, the <code>BRANCH</code> rule will not match against floating blocks. Any survey that violates these rules will fail early.</p>
<p>(3) is not encoded directly in the grammar because we must build the question and top-level containing block first. Since it cannot be verified in the first pass, we perform this check after having parsed the survey into its internal representation. </p>
<p>(4) cannot be determined until runtime. This is an example of where our syntax and static checks reach their limits. $$\mathbf{NEXT}$$ is typically used when we want to select exactly one question from a block and continue as usual. A user could conceivably use $$\mathbf{NEXT}$$ as a branch destination in the usual branching context; the only effect this could have would be the usual introduction of constraints imposed by having that block contain a "true" branch question.</p>
<p>This leads into my next post, which will (finally!) be about the survey program semantics.</p>
