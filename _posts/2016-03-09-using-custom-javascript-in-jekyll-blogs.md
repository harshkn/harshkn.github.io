---
layout: post
type: post
comments: true
author:
  display_name: Emma Tosch
---

I made the decision to port my blog over to a Github hosted Jekyll blog from a university-hosted Wordpress blog because I had no way to render custom Javascript in the Wordpress blog. In particular, I had wanted to be able to render interactive graphs using [d3](https://d3js.org/).

Unfortunately, I can't just add a link to d3 in my `_includes/head.html` file and embed my Javascript directly in a mardown-ified blog post: Jekyll (or maybe Liquid?) strips out the Javascript. There is a workaround, but since the process is more than one step, I wanted to document how one includes custom Javascript in a Jekyll blog.
<!--summary-->

# The Procedure
1. First, if we are using any external Javascript sources, we add those sources to my `_includes/head.html`. For example, in [a prior post]({{ base.url }}/estimator_inference.html), I used [vis.js](http://visjs.org/) to render program variable graphs as force-directed diagrams. I added the following to `head.html`:

    <pre><code>&lt;script src="https://cdnjs.cloudflare.com/ajax/libs/vis/4.15.0/vis.min.js" type="text/javascript"></script>&lt;link rel="https://cdnjs.cloudflare.com/ajax/libs/vis/4.15.0/vis.min.css"></link></code></pre>

2. Next, we need a place to put the Javascript. I created a folder in `_includes` called `graphs` to hold my JS code. For example, in the post where I used visjs, II created a file called `dag_default.js`.

3. The code in `dag_default.js` modifies the DOM in order to actually display the DAGs. The first graph is displayed in an HTML element with id `basic_dag`. We need to add `<div id="basic_dag"></dag>` in the appropriate location in the blog post.

4. Finally, in order to access the code I wrote in `_includes/dag_default.js`, I needed to load it in. We do this in two steps:

	A. Modify the front matter of the post so we have a variable to contain the locations of the Javascript we want to include. e.g.:
	<pre><code>
	    jsarr:
	    - graphs/dag_default.js
	</code></pre>

	B. Modify the content of `_layout/post.html` so we load the listed Javascript scripts. We add at the end:
	<pre><code>
	&#123;&#37; for js in page.jsarr &#37;&#125;
		&lt;script type="text/javascript">
		&#123;&#37; include &#123;&#123; js }} &#37;&#125;
		&lt;/script>
	&#123;&#37; endfor &#37;&#125;
	</code></pre>

# Problems

1. When we added the link to the visjs to `head.html`,  we made it so we fetch visjs for every page in the blog. Clearly this is suboptimal and can lead to slowdown if we have tons of external Javascript we need need to load. To get around this, we fence in the lines from Step 1 as below:

	<pre><code>
	&#123;&#37; if page.jsarr &#37;&#125;
	    &lt;script src="https://cdnjs.cloudflare.com/ajax/libs/vis/4.15.0/vis.min.js" type="text/javascript"&gt;&lt;/script&gt;
	    &lt;link rel="https://cdnjs.cloudflare.com/ajax/libs/vis/4.15.0/vis.min.css"></link&gt;
	&#123;&#37; endif &#37;&#125;
	</code></pre>
	This will load the scripts between the guards for every post that uses custom Javascript. We could also define variables for the individual Javascript/CSS pairs and load only the ones we need.
