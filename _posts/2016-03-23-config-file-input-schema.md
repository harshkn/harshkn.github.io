---
layout: post
type: post
comments: true
author:
  display_name: Emma Tosch
---

We would like to add assertions, annotations, and maybe even types to the PlanOut language. However, since it's infeasible to rewrite our corpus of scripts in this updated language, we have a temporary solution: we are parsing in YAML config files to provide supplementary type information for inference.

<!--summary-->

Each datum in the config file associates a variable name with its properties.

**Valid Properties**

* **card** We can annotate any variable's cardinality as **high** or **low**. We use cardinality in two places: when analyzing experimental validity and to check on the values being logged. When analyzing experimental validity, we need to know whether the units of randomization have sufficiently high cardinality. Low cardinality variables will likely cause imbalance in randomization. High cardinality in logged variables will tax the experimentation system, in the worst case causing it to crash. 

	<svg height="150" width="100%">
	<!--basic lattice-->
	<text x="10" y="12">high</text>
	<line x1="20" x2="20" y1="15" y2="100" style="stroke:black;stroke-width:2"></line>
	<text x="12" y="116">low</text>
	<a href="#fig1" id="fig1"><text x="4" y="133" style="font-style:italic;font-size:10pt">Figure 1</text></a>
	<!--tuple-->
	<text x="100" y="14">high &oplus; high</text>
	<text x="200" y="14">high &oplus; low</text>
	<text x="300" y="14">low &oplus; high</text>
	<line x1="230" x2="230" y1="15" y2="100" style="stroke:black;stroke-width:2"></line>
	<line x2="230" y2="100" x1="130" y1="15" style="stroke:black;stroke-width:2"></line>
	<line x2="230" y2="100" x1="330" y1="15" style="stroke:black;stroke-width:2"></line>
	<text x="194" y="116">low &oplus; low</text>
	<a id="fig2" href="#fig2"><text x="205" y="133" style="font-style:italic;font-size:10pt">Figure 2</text></a>
	<!--logging vars-->
	<text x="500" y="14">high % high</text> 
	<text x="400" y="116">high % low</text>
	<text x="500" y="116">low % high</text>
	<text x="600" y="116">low % low</text>
	<line x1="540" y1="15" x2="430" y2="100" style="stroke:black;stroke-width:2"></line>
	<line x1="540" y1="15" x2="540" y2="100" style="stroke:black;stroke-width:2"></line>
	<line x1="540" y1="15" x2="660" y2="100" style="stroke:black;stroke-width:2"></line>
		<a id="fig3" href="#fig3"><text x="515" y="133" style="font-style:italic;font-size:10pt">Figure 3</text></a></svg>
	Here, &oplus; denotes any of the set of operators in {(), &times;, +}, where () is the tuple operator. When we combine two variables using one of these operators, so long as one of them has high cardinality[^1], the result of the &oplus; operator will have high cardinality. The most common usecase we have for this is when the unit of randomization is a tuple.  Conversely, using the modulus operator demotes the result of two variables to the lowest cardinality amongst them. This makes the &oplus; operator the meet and the % operator the join:

	<p>
	<svg height="150" width="100%">
	<text x="300" y="14">x &oplus; y</text>
	<text x="175" y="64">x</text>
	<text x="450" y="64">y</text>
	<text x="300" y="116">x % y </text>
	<line x1="185" y1="56" x2="300" y2="18" style="stroke:black;stroke-width:2"></line>
	<line x1="185" y1="64" x2="295" y2="106" style="stroke:black;stroke-width:2"></line>
	<line x1="445" y1="64" x2="350" y2="106" style="stroke:black;stroke-width:2"></line>
	<line x1="445" y1="56" x2="350" y2="18" style="stroke:black;stroke-width:2"></line>
	<a href="#fig4" id="fig4"><text x="298" y="133" style="font-style:italic;font-size:10pt">Figure 4</text></a>
	</svg>
	</p>
	When we examine the behavior of the operators, we observe relations that don't fit in as well into the above framework:
	<p>
	<svg height="150" width="100%">
	<!--subtraction-->
	<text x="10" y="12">high - low</text>
	<text x="110" y="12">low - high</text>
	<text x="12" y="116">high - high</text>
	<text x="112" y="116">low - low</text>
	<line x1="47" y1="15" x2="47" y2="100" style="stroke:black;stroke-width:2"></line>
	<line x1="147" y1="15" x2="147" y2="100" style="stroke:black;stroke-width:2"></line>
	<line x1="47" y1="15" x2="147" y2="100" style="stroke:black;stroke-width:2"></line>
	<line x1="147" y1="15" x2="47" y2="100" style="stroke:black;stroke-width:2"></line>
	<a href="#fig5" id="fig5"><text x="80" y="133" style="font-style:italic;font-size:10pt">Figure 5</text></a>
	<!--division-->
	<text x="350" y="12">high / low</text>
	<text x="250" y="116">high / high</text>
	<text x="350" y="116">low / high</text>
	<text x="450" y="116">low / low</text>
	<line x1="280" y1="100" x2="380" y2="15" style="stroke:black;stroke-width:2"></line>
	<line x1="380" y1="100" x2="380" y2="15" style="stroke:black;stroke-width:2"></line>
	<line x1="480" y1="100" x2="380" y2="15" style="stroke:black;stroke-width:2"></line>
	<a href="#fig6" id="fig6"><text x="350" y="133" style="font-style:italic;font-size:10pt">Figure 6</text></a>
	</svg>
	</p>
	Subtraction looks a lot like XOR, but division is totally weird and not commutative. We'll see later how these properties interact to help us infer the soundness of our estimator generation algorithm.

* **dynamism** In a given experiment, we generally consider the *factors* and the *covariates* to have the same value through the duration of the experiment. Holding these values constant allows us to reason about the outcome of interest ($$Y$$).	What happens when the variables in our experiment *do* vary? In this case, we will need to consider *how* they vary and their interaction with the assignment mechanism. Since we are only looking at ATE at this point, we cannot consider dynamic variables in our estimator generation. Dynamism pollutes assignment. This property can take on values **constant** and **tv** (for time-varying).

* **randomness** Variables can be marked as **random** or **nonrandom**. Since it is possible to refer to an external source of randomness, we would like to be able to mark variables in the system as random when this happens. If a variable has been marked as random, but is not, then we should alert the user, sinec it will reduce the number of valid estimators in the system. If a variable has been marked as nonrandom but is random, then we will also need to alert the user. 

* **domain** We can specify the the domain of external random variables and use this to help typecheck. The domain cannot include types outside of our system : they must be **boolean**s, **number**s, **strings**, or one of the container types (**json**, **array**, or **map**).

* **codomain** If the variable listed is a function, we may also want to specify its codomain. Again, the codomain must be one of our known types. 

* **domain_y** The estimator inference algorithm assumes that the unit of ranomization is correlated with $$Y$$ -- if it weren't, we would *never* be able to detect an effect! However, there are cases when it may appear that our unit of randomization allows us to compute a between-subjects estimator, but we cannot. 

* **corr** We should allow users to list other variables we expect to be correlated with this variable. Then when looking at independence assumptions, we can add latent causal variables to account for unobserved causal variables. 

[^1]: Note that although it might be possible to multiply two low cardinality variables and get back a high cardinality one, in the worst case this is not likely. Since our static analyses are conservative, we assume that the product of two low-cardinality operators also has low cardinality
