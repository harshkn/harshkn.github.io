var make_line = function(start, end) {
    return d3.svg.line()
	.x([start[0], end[0]])
	.y([start[1], end[1]])
	.interpolate('linear');
}

d3.select("card_lattice").append("svg")
    .attr("d", make_line((0,0), (0,10)))
    .attr("stroke", "black")
    .attr("stroke_width", 2)

    // .append("svg:line").attr("x1", 0).attr("x1", 0).attr("y1", 10).attr("y2", 0)
    // .style("stroke", "bold")
