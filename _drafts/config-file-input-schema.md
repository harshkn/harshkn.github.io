---
layout: post
type: post
comments: true
author:
  display_name: Emma Tosch
---

We would like to add assertions, annotations, and maybe even types to the PlanOut language. However, since it's infeasible to rewrite our corpus of scripts in this updated language, we have a temporary solution: we are parsing in YAML config files to provide supplementary type information for inference.

<!--summary-->

Each datum in the config file associates a parameter name with its properties.

**Valid Properties**

* **card** We can annotate any parameter's cardinality as **high** or **low**. We use cardinality in two places: when analyzing experimental validity and to check on the values being logged. When analyzing experimental validity, we need to know whether the units of randomization have sufficiently high cardinality. Low cardinality parameters will likely cause imbalance in randomization. High cardinality in logged parameters will tax the experimentation system, in the worst case causing it to crash. 

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
	Here, &oplus; denotes any of the set of operators in {(), &times;, +}, where () is the tuple operator. When we combine two parameters using one of these operators, so long as one of them has high cardinality[^1], the result of the &oplus; operator will have high cardinality. The most common usecase we have for this is when the unit of randomization is a tuple. 

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
	<!--division-->
	<text x="350" y="12">high / low</text>
	<text x="250" y="116">high / high</text>
	<text x="350" y="116">low / high</text>
	<text x="450" y="116">low / low</text>
	<line x1="280" y1="100" x2="380" y2="15" style="stroke:black;stroke-width:2"></line>
	<line x1="380" y1="100" x2="380" y2="15" style="stroke:black;stroke-width:2"></line>
	<line x1="480" y1="100" x2="380" y2="15" style="stroke:black;stroke-width:2"></line>
	<svg>

<!-- <text x="100" y="12">independent</text> -->
<!-- <line id="asdf" x1="150" x2="150" y1="15" y2="100" style="stroke:black;stroke-width:2"></line><text x="110" y="112">dependent</text> -->



At some point it might make sense to include an *M*, but for now we keep just the high and low values.


The tuple operation is the meet of 

[^1]: Note that although it might be possible to multiply two low cardinality parameters and get back a high cardinality one, in the worst case this is not likely. Since our static analyses are conservative, we assume that the product of two low-cardinality operators also has low cardinality
