var eDTS=function eDTS(){

   state={alreadyPlotted:false};

   data={
      title:"",
      description:"",
      dataStructure:"",
      xUnit:"",
      xLabel:"",
      xFormat:"",
      yUnit:"",
      yLabel:"",
      yFormat:"",
      rawData:[]
   };


    parameters={
      margin:{top: 20, right: 20, bottom: 30, left: 50},
      padding:{},
      scene:{width:960,height:500}
   }

   operators={
      xParser:undefined,
      yparser:undefined
   };


    treatData=function(){

        // selection des Parsers de données

        operators.xParser=parserSelector(data.xDimension,data.xUnit,data.xFormat);
        operators.yParser=parserSelector(data.yDimension,data.yUnit,data.yFormat);

   };

    treatParameters=function(){
   //   console.log("treatParameters");
      parameters.width=parameters.scene.width + parameters.margin.left + parameters.margin.right;
      parameters.height=parameters.scene.height + parameters.margin.top + parameters.margin.bottom;
   };

// interface
  this.update=function(command, inData){
   //  console.log(command=="showGraph");
      switch (command) {
         case("insertData"):
             for (key in inData){
                data[key]=inData[key];
             }
            break;
         case("showGraph"):
             if (state.alreadyPlotted){
                updateGraph();
             }else{
                newGraph();
             }

             break;
         default:
            console.log("commande inconnue ou inexistante");
            break;
      }
      return this;
   };



   this.bindSVG=function(container_id){

      this.id=container_id;
      treatParameters();
      d3.select("#"+this.id).append("svg")
        .attr("id", this.id+"-svg")
        .attr("width", parameters.width )
        .attr("height", parameters.height)
        .attr("viewbox","0 0 "+(parameters.width)+" "+(parameters.height))
        .attr("preserveAspectRatio","xMinYMin")


      return this;
   };



   updateGraph=function(){

      treatData();

       var x = d3.time.scale()
          .range([0, parameters.scene.width]);

       var y = d3.scale.linear()
          .range([parameters.scene.height, 0]);

       var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

       var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

       var line = d3.svg.line()
          .x(function(d) { return x(operators.xParser.parse(d[0])); })
          .y(function(d) { return y(operators.yParser.parse(d[1])); });



       x.domain(d3.extent(data.rawData, function(d) { return operators.xParser.parse(d[0]); }));
       y.domain(d3.extent(data.rawData, function(d) { return operators.yParser.parse(d[1]); }));


       svg=d3.select("#"+this.id+"-svg").selectAll("*").remove();

         svg=d3.select("#"+this.id+"-svg").append("g")
         .attr("transform", "translate(" + parameters.margin.left + "," + parameters.margin.top + ")")

         svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + parameters.scene.height + ")")
            .call(xAxis);

      svg.append("g")
            .attr("class", "y axis")
       //     .attr("transform", "translate(" + parameters.scene.width + ",0)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(data.yLabel);

       svg.append("path")
           .datum(data.rawData)
           .attr("class", "line")
           .attr("d", line);

    state.alreadyPlotted=true;
    return this;
 }.bind(this);

   newGraph=function(){
      // is this grap bounded?

     treatData();

      var x = d3.time.scale()
         .range([0, parameters.scene.width]);

      var y = d3.scale.linear()
         .range([parameters.scene.height, 0]);

      var xAxis = d3.svg.axis()
         .scale(x)
         .orient("bottom");

      var yAxis = d3.svg.axis()
         .scale(y)
         .orient("left");

      var line = d3.svg.line()
         .x(function(d) { return x(operators.xParser.parse(d[0])); })
         .y(function(d) { return y(operators.yParser.parse(d[1])); });



      x.domain(d3.extent(data.rawData, function(d) { return operators.xParser.parse(d[0]); }));
      y.domain(d3.extent(data.rawData, function(d) { return operators.yParser.parse(d[1]); }));


      svg=d3.select("#"+this.id+"-svg").append("g")
        .attr("class",this.id+"-viz")
        .attr("transform", "translate(" + parameters.margin.left + "," + parameters.margin.top + ")")

        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + parameters.scene.height + ")")
           .call(xAxis);

     svg.append("g")
           .attr("class", "y axis")
      //     .attr("transform", "translate(" + parameters.scene.width + ",0)")
           .call(yAxis)
           .append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 6)
           .attr("dy", ".71em")
           .style("text-anchor", "end")
           .text(data.yLabel);

      svg.append("path")
          .datum(data.rawData)
          .attr("class", "line")
          .attr("d", line);

   state.alreadyPlotted=true;
   return this;
}.bind(this);





   return this;
}




function parserSelector(dimension,unit,format){
   switch (dimension) {
      case "time":
           switch (unit) {
              case "date":
                 return d3.time.format(format);
                 break;
              case "delay":
                  return d3.time.format(format);
              default:

           }
      case "money":
         switch (unit) {
            case "dollar":
               return function(){
                  this.parse=function(value){return +value;};
                  return this}();
               break;
            default:

         }
         break;
      default:
         console.log("dimension inconnue ou inexistante");

   }
};
