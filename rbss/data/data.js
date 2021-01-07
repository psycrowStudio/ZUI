var w = 150,
	h = 150;
 
var colorscale = d3.scale.category10();
 
//Legend titles
var LegendOptions = ['base', 'modified'];
 
//Data
var d = [
		  [
			{axis:"Open",value:1},
			{axis:"Conscientious",value:2},
			{axis:"Extroverted",value:3},
			{axis:"Agreeable",value:4},
			{axis:"Neurotic",value:1.24}
		  ],
		  [
			{axis:"Open",value:3.2},
			{axis:"Conscientious",value:2.9},
			{axis:"Extroverted",value:3.25},
			{axis:"Agreeable",value:2.88},
			{axis:"Neurotic",value:1.75}
		  ]
		];
 
//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 0.6,
  levels: 5,
  ExtraWidthX: 300
}
 
//Call function to draw the Radar chart
//Will expect that data is in %'s
RadarChart.draw('#chart', d, mycfg);
 
////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////
 
var svg = d3.select('#body')
	.selectAll('svg')
	// .append('svg')
	// .attr("width", w+300)
	// .attr("height", h+300)
 
//Create the title for the legend
// var text = svg.append("text")
// 	.attr("class", "title")
// 	.attr("x", w+(w/2) )
// 	.attr("y", h+80)
// 	.attr("text-anchor", "middle")
// 	.attr("font-size", "18px")
// 	.attr("font-weight", 500)
// 	.text("Anakin Skywalker");

// //Initiate Legend	
// var legend = svg.append("g")
// 	.attr("class", "legend")
// 	.attr("height", 100)
// 	.attr("width", 200)
// 	.attr('transform', 'translate('+(w)+','+h+100+')') 
// 	;

// 	//Create colour squares
// 	legend.selectAll('rect')
// 	  .data(LegendOptions)
// 	  .enter()
// 	  .append("rect")
// 	  .attr("x", w - 65)
// 	  .attr("y", function(d, i){ return i * 20;})
// 	  .attr("width", 10)
// 	  .attr("height", 10)
// 	  .style("fill", function(d, i){ return colorscale(i);})
// 	  ;

// 	//Create text next to squares
// 	legend.selectAll('text')
// 	  .data(LegendOptions)
// 	  .enter()
// 	  .append("text")
// 	  .attr("x", w - 52)
// 	  .attr("y", function(d, i){ return i * 20 + 9;})
// 	  .attr("font-size", "11px")
// 	  .attr("fill", "#737373")
// 	  .text(function(d) { return d; })
// 	  ;	
