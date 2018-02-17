---
layout: page
title: Teaching
header: true 
---

<h3>Instructor</h3>

<div class="container-fluid">
  {% for course in site.teaching %}
     {% if course.link %}
       <h4><a href="{{ course.link }}">{{ course.term }}: {{ course.number }} ({{ course.name }})</a></h4>
     {% else %}
       <h4>{{ course.term }}: {{ course.number }} ({{ course.name }})</h4>
     {% endif %}
     <p>{{ course.summary }}</p>
     <p> For students: <a href="{{ course.permalink }}">course page</a> (requires umass login).</p>
  {% endfor %}
</div>

