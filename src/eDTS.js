eDTS={
   options:{// should use a standard graphics grammar...
      "axesMethod":"default",
      "id":"none",
      "xLabel":"X (x unit)",
      "yLabel":"Y (y unit)",
      "margin": {top: 20, right: 20, bottom: 30, left: 50},

      "width": 960, //total width
      "height": 500  //total height

   },
   bind:function(id){//bind to an id
      this.options.id=id;
      var rect=document.getElementById(id).getBoundingClientRect();
      var xpad=rect.width*5/100;
      var ypad=rect.height*5/100;
      this.options.margin={top:ypad/2,right:xpad/2,bottom:ypad/2,left:xpad/2};
      this.options.width=rect.width - xpad;
      this.options.height=rect.height - ypad;
      // padding inside axis...
      return this;
   },
   set: function (opt){
      for (var key in opt){
         this.options[key]=opt[key];
      }
      return this;
   },

  setData:function(data,timeFormat){
     this.data=data.map(function(elem){return[d3.time.format(timeFormat).parse(elem[0]),elem[1]]});
     this.minX = this.data[0][0];
     this.maxX = this.data[this.data.length-1][0];
     this.minY=Math.min(...data.map(function(elem){return elem[1]}));
     this.maxY=Math.max(...data.map(function(elem){return elem[1]}));
     return this;
 },




init:function(){
//   var margin = {top: 20, right: 0, bottom: 20, left: 0},
//   width = 960 - margin.left - margin.right,
//   height = 500 - margin.top - margin.bottom;

var chart = $("#"+eDTS.options.id);
console.log(eDTS.options.id);
var rect=document.getElementById(eDTS.options.id).getBoundingClientRect();
    aspect = rect.width / rect.height;
$(window).on("resize", function() {
   var rect=document.getElementById(eDTS.options.id).getBoundingClientRect();
    var chart = $("#itrf");
    console.log(chart);
    chart.attr("width", rect.width);
    chart.attr("height", Math.round(rect.width/ aspect));
}).trigger("resize");

var formatNumber = d3.format(".1f");

var y = d3.scale.linear()
   .domain([this.minY, this.maxY])
   .range([this.options.height, 0]);

var x = d3.time.scale()
   .domain([this.minX, this.maxX])
   .nice(d3.time.week)
   .range([0, this.options.width]);

var xAxis = d3.svg.axis()
   .scale(x)
   .ticks(d3.time.years)
   .orient("bottom");

var yAxis = d3.svg.axis()
   .scale(y)
   .tickSize(this.options.width)
   //.tickFormat(formatCurrency)
   .orient("right");

var svg = d3.select("#"+this.options.id).append("svg")
   .attr("width", this.options.width + this.options.margin.left + this.options.margin.right)
   .attr("height", this.options.height + this.options.margin.top + this.options.margin.bottom)
   .attr("id","itrf")
   .attr("viewBox", "0 0 "+this.options.width+" "+this.options.height)
   .attr("preserveAspectRatio","xMinYMid")
   .append("g")
   .attr("transform", "translate(" + this.options.margin.left + "," + this.options.margin.top + ")");

svg.append("g")
   .attr("class", "x axis")
   .attr("transform", "translate(0," + this.options.height + ")")
   .call(xAxis);

var gy = svg.append("g")
   .attr("class", "y axis")
   .call(yAxis);

gy.selectAll("g").filter(function(d) { return d; })
   .classed("minor", true);

gy.selectAll("text")
   .attr("x", 0)
   .attr("dy", -5);

var lineGen=d3.svg.line()
   .x(function(d){return x(d[0])})
   .y(function(d){return y(d[1])})

svg.append('svg:path')
   .attr('d',lineGen(this.data))



function formatCurrency(d) {
 var s = formatNumber(d );
 return d === y.domain()[1]
     ? "$" + s + " million"
     : s;
}
return this;
}




}
