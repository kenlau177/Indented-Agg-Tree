
var margin = {top: 30, right: 20, bottom: 30, left: 20},
    width = 960 - margin.left - margin.right,
    barHeight = 20,
    barWidth = width * .8;

var infoBarHeight = 20, infoBarWidth = barWidth * .05;
var classBarHeight = infoBarHeight, classBarWidth = barWidth * .05;
var cumClBarHeight = infoBarHeight, cumClBarWidth = barWidth * .065;

var i = 0,
    duration = 400,
    root;

var tree = d3.layout.tree()
    .nodeSize([0, 20]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("aggTree_5_500.json", function(error, flare) {
  flare.x0 = 0;
  flare.y0 = 0;

//  console.log(flare);

  function toggleAll(d){
  	if(d.children) {
  		d.children.forEach(toggleAll);
  		toggle(d);
  	}
  }

  flare.children.forEach(toggleAll);

  update(root = flare);
});

function update(source) {

  var igDomain = root.domainIG;
  var clDomain = root.domainCl;
  var cumClDomain = root.domainCumCl;

  //console.log(source);

  var scaleInfoBar = d3.scale.linear()
        .domain(igDomain)
        .range(["white", "red"]);
  var colorInfoBarLeft = function(d) {
    return scaleInfoBar(d.less);
  }
  var colorInfoBarRight = function(d) {
    return scaleInfoBar(d.greater);
  }

  var scaleClassBar = d3.scale.linear()
          .domain(clDomain)
          .range(["white", "blue"]);
  var colorClassBar0 = function(d) {
    if (d.hasOwnProperty('classes')){
      //  console.log(d.classes)
      return scaleClassBar(d.classes.ook);
    } else {
      return
    }
  }
  var colorClassBar1 = function(d) {
    if (d.hasOwnProperty('classes')){
      return scaleClassBar(d.classes.bpsk);
    } else {
      return
    }
  }
  var colorClassBar2 = function(d) {
    if (d.hasOwnProperty('classes')){
      return scaleClassBar(d.classes.oqpsk);
    } else {
      return
    }
  }
  var colorClassBar3 = function(d) {
    if (d.hasOwnProperty('classes')){
      return scaleClassBar(d.classes.bfskA);
    } else {
      return
    }
  }
  var colorClassBar4 = function(d) {
    if (d.hasOwnProperty('classes')){
      return scaleClassBar(d.classes.bfskB);
    } else {
      return
    }
  }
  var colorClassBar5 = function(d) {
    if (d.hasOwnProperty('classes')){
      return scaleClassBar(d.classes.bfskR2);
    } else {
      return
    }
  }

  var scaleCumClBar = d3.scale.linear()
          .domain(cumClDomain)
          .range(["white", "orange"]);
  var colorCumClBar0 = function(d) {
    if (d.hasOwnProperty('cumCl')){
      //  console.log(d.classes)
      return scaleCumClBar(d.cumCl.ook);
    } else {
      return
    }
  }
  var colorCumClBar1 = function(d) {
    if (d.hasOwnProperty('cumCl')){
      return scaleCumClBar(d.cumCl.bpsk);
    } else {
      return
    }
  }
  var colorCumClBar2 = function(d) {
    if (d.hasOwnProperty('cumCl')){
      return scaleCumClBar(d.cumCl.oqpsk);
    } else {
      return
    }
  }
  var colorCumClBar3 = function(d) {
    if (d.hasOwnProperty('cumCl')){
      return scaleCumClBar(d.cumCl.bfskA);
    } else {
      return
    }
  }
  var colorCumClBar4 = function(d) {
    if (d.hasOwnProperty('cumCl')){
      return scaleCumClBar(d.cumCl.bfskB);
    } else {
      return
    }
  }
  var colorCumClBar5 = function(d) {
    if (d.hasOwnProperty('cumCl')){
      return scaleCumClBar(d.cumCl.bfskR2);
    } else {
      return
    }
  }


  // Compute the flattened node list. TODO use d3.layout.hierarchy.
  var nodes = tree.nodes(root);

//  console.log(nodes);

  var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

  d3.select("svg").transition()
      .duration(duration)
      .attr("height", height);

  d3.select(self.frameElement).transition()
      .duration(duration)
      .style("height", height + "px");

  // Compute the "layout".
  nodes.forEach(function(n, i) {
    n.x = i * barHeight;
  });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .style("opacity", 1e-6);

  // Enter any new nodes at the parent's previous position.
  nodeEnter.append("rect")
      .attr("y", -barHeight / 2)
      .attr("height", barHeight)
      .attr("width", barWidth)
      .style("fill", color)
      .on("click", click);

  //////// Info Bar
  xInfo = 65;
  nodeEnter.append("rect")
  		.attr("x", xInfo)
  		.attr("y", -barHeight / 2)
  		.attr("height", infoBarHeight)
  		.attr("width", infoBarWidth)
  		.style("fill", colorInfoBarLeft)
      .style("fill-opacity", opacityInfoBarLeft)
      .style("stroke-opacity", strokeOpacityInfoBarLeft)
  		.on("click", click);
  nodeEnter.append("rect")
      .attr("x", xInfo + 1 + infoBarWidth)
      .attr("y", -barHeight / 2)
      .attr("height", infoBarHeight)
      .attr("width", infoBarWidth)
      .style("fill", colorInfoBarRight)
      .style("fill-opacity", opacityInfoBarRight)
      .style("stroke-opacity", strokeOpacityInfoBarRight)
      .on("click", click);      

  nodeEnter.append("text")
      .attr("dy", 3.5)
      .attr("dx", xInfo + 18)
      .attr("text-anchor", "middle")
      .text(function(d) { return d.less});
  nodeEnter.append("text")
      .attr("dy", 3.5)
      .attr("dx", xInfo + 18 + infoBarWidth)
      .attr("text-anchor", "middle")
      .text(function(d) { 
        if (d.type === "split") { return d.greater } });
  
  ///////////////
  
  ///////// Class Bar
  
  xClass = 478;
  nodeEnter.append("rect")
      .attr("x", xClass)
      .attr("y", -barHeight / 2)
      .attr("height", infoBarHeight)
      .attr("width", classBarWidth)
      .style("fill", colorClassBar0)
      .style("fill-opacity", opacityInfoBarLeft)
      .style("stroke-opacity", strokeOpacityInfoBarLeft)
      .on("click", click);    
  nodeEnter.append("rect")
      .attr("x", xClass + classBarWidth)
      .attr("y", -barHeight / 2)
      .attr("height", infoBarHeight)
      .attr("width", classBarWidth)
      .style("fill", colorClassBar1)
      .style("fill-opacity", opacityInfoBarLeft)
      .style("stroke-opacity", strokeOpacityInfoBarLeft)
      .on("click", click);       
  nodeEnter.append("rect")
      .attr("x", xClass + 2*(classBarWidth))
      .attr("y", -barHeight / 2)
      .attr("height", infoBarHeight)
      .attr("width", classBarWidth)
      .style("fill", colorClassBar2)
      .style("fill-opacity", opacityInfoBarLeft)
      .style("stroke-opacity", strokeOpacityInfoBarLeft)
      .on("click", click);       
  nodeEnter.append("rect")
      .attr("x", xClass + 3*(classBarWidth))
      .attr("y", -barHeight / 2)
      .attr("height", infoBarHeight)
      .attr("width", classBarWidth)
      .style("fill", colorClassBar3)
      .style("fill-opacity", opacityInfoBarLeft)
      .style("stroke-opacity", strokeOpacityInfoBarLeft)
      .on("click", click);       
  nodeEnter.append("rect")
        .attr("x", xClass + 4*(classBarWidth))
        .attr("y", -barHeight / 2)
        .attr("height", infoBarHeight)
        .attr("width", classBarWidth)
        .style("fill", colorClassBar4)
        .style("fill-opacity", opacityInfoBarLeft)
        .style("stroke-opacity", strokeOpacityInfoBarLeft)
        .on("click", click);       
  nodeEnter.append("rect")
        .attr("x", xClass + 5*(classBarWidth))
        .attr("y", -barHeight / 2)
        .attr("height", infoBarHeight)
        .attr("width", classBarWidth)
        .style("fill", colorClassBar5)
        .style("fill-opacity", opacityInfoBarLeft)
        .style("stroke-opacity", strokeOpacityInfoBarLeft)
        .on("click", click);             

  var xClassText = xClass + 20;
  nodeEnter.append("text")
        .attr("dy", 3.5)
        .attr("dx", xClassText)
        .attr("text-anchor", "middle")
        .text(addTextClass0);
  nodeEnter.append("text")
        .attr("dy", 3.5)
        .attr("dx", xClassText + classBarWidth)
        .attr("text-anchor", "middle")
        .text(addTextClass1);
  nodeEnter.append("text")
        .attr("dy", 3.5)
        .attr("dx", xClassText + 2*classBarWidth)
        .attr("text-anchor", "middle")
        .text(addTextClass2);
  nodeEnter.append("text")
        .attr("dy", 3.5)
        .attr("dx", xClassText + 3*classBarWidth)
        .attr("text-anchor", "middle")
        .text(addTextClass3);
  nodeEnter.append("text")
        .attr("dy", 3.5)
        .attr("dx", xClassText + 4*classBarWidth)
        .attr("text-anchor", "middle")
        .text(addTextClass4);
  nodeEnter.append("text")
        .attr("dy", 3.5)
        .attr("dx", xClassText + 5*classBarWidth)
        .attr("text-anchor", "middle")
        .text(addTextClass5);                        
  
  //////////////    

  ///////// Cum Class Bar
  xCumCl = 165;
  nodeEnter.append("rect")
      .attr("x", xCumCl)
      .attr("y", -barHeight / 2)
      .attr("height", infoBarHeight)
      .attr("width", cumClBarWidth)
      .style("fill", colorCumClBar0)
      .style("fill-opacity", opacityInfoBarLeft)
      .style("stroke-opacity", strokeOpacityInfoBarLeft)
      .on("click", click);    
  nodeEnter.append("rect")
      .attr("x", xCumCl + cumClBarWidth)
      .attr("y", -barHeight / 2)
      .attr("height", infoBarHeight)
      .attr("width", cumClBarWidth)
      .style("fill", colorCumClBar1)
      .style("fill-opacity", opacityInfoBarLeft)
      .style("stroke-opacity", strokeOpacityInfoBarLeft)
      .on("click", click);   
  nodeEnter.append("rect")
      .attr("x", xCumCl + 2*cumClBarWidth)
      .attr("y", -barHeight / 2)
      .attr("height", infoBarHeight)
      .attr("width", cumClBarWidth)
      .style("fill", colorCumClBar2)
      .style("fill-opacity", opacityInfoBarLeft)
      .style("stroke-opacity", strokeOpacityInfoBarLeft)
      .on("click", click);   
  nodeEnter.append("rect")
      .attr("x", xCumCl + 3*cumClBarWidth)
      .attr("y", -barHeight / 2)
      .attr("height", infoBarHeight)
      .attr("width", cumClBarWidth)
      .style("fill", colorCumClBar3)
      .style("fill-opacity", opacityInfoBarLeft)
      .style("stroke-opacity", strokeOpacityInfoBarLeft)
      .on("click", click);   
  nodeEnter.append("rect")
      .attr("x", xCumCl + 4*cumClBarWidth)
      .attr("y", -barHeight / 2)
      .attr("height", infoBarHeight)
      .attr("width", cumClBarWidth)
      .style("fill", colorCumClBar4)
      .style("fill-opacity", opacityInfoBarLeft)
      .style("stroke-opacity", strokeOpacityInfoBarLeft)
      .on("click", click);   
  nodeEnter.append("rect")
      .attr("x", xCumCl + 5*cumClBarWidth)
      .attr("y", -barHeight / 2)
      .attr("height", infoBarHeight)
      .attr("width", cumClBarWidth)
      .style("fill", colorCumClBar5)
      .style("fill-opacity", opacityInfoBarLeft)
      .style("stroke-opacity", strokeOpacityInfoBarLeft)
      .on("click", click);   


  var xCumClText = xCumCl + 23;
 
  nodeEnter.append("text")
        .attr("dy", 3.5)
        .attr("dx", xCumClText)
        .attr("text-anchor", "middle")
        .text(addTextCumCl0);
  nodeEnter.append("text")
        .attr("dy", 3.5)
        .attr("dx", xCumClText + cumClBarWidth)
        .attr("text-anchor", "middle")
        .text(addTextCumCl1);
  nodeEnter.append("text")
        .attr("dy", 3.5)
        .attr("dx", xCumClText + 2*cumClBarWidth)
        .attr("text-anchor", "middle")
        .text(addTextCumCl2);
  nodeEnter.append("text")
        .attr("dy", 3.5)
        .attr("dx", xCumClText + 3*cumClBarWidth)
        .attr("text-anchor", "middle")
        .text(addTextCumCl3);
  nodeEnter.append("text")
        .attr("dy", 3.5)
        .attr("dx", xCumClText + 4*cumClBarWidth)
        .attr("text-anchor", "middle")
        .text(addTextCumCl4); 
  nodeEnter.append("text")
        .attr("dy", 3.5)
        .attr("dx", xCumClText + 5*cumClBarWidth)
        .attr("text-anchor", "middle")
        .text(addTextCumCl5);                       


  /////////////////      

  nodeEnter.append("text")
      .attr("dy", 3.5)
      .attr("dx", 5.5)
      .text(function(d) { return d.name; });

  // Transition nodes to their new position.
  nodeEnter.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1);

  node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1)
    .select("rect")
      .style("fill", color);

  // Transition exiting nodes to the parent's new position.
  node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .style("opacity", 1e-6)
      .remove();

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(tree.links(nodes), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
    .transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

function toggle(d) {
	if (d.children) {
		d._children = d.children;
		d.children = null;
	} else {
		d.children = d._children;
		d._children = null;
	}
}

function opacityInfoBarLeft(d) {
  if (d.name === "start") {
    return 1e-6
  } else {
    return 1;
  }
}

function opacityInfoBarRight(d) {
  if (d.name === "start") {
    return 1e-6;
  } else if (d.type === "root") {
    return 1e-6;
  } else {
    return 1;
  }
}

function strokeOpacityInfoBarLeft(d) {
  if (d.name === "start") {
    return 1e-6
  } else {
    return 1
  }
}

function strokeOpacityInfoBarRight(d) {
  if (d.name === "start") {
    return 1e-6
  } else if (d.type === "root") {
    return 1e-6;
  } else {
    return 1
  }
}

function addText0(d, key) {
  if (d.type !== undefined){
    if (key === "cumCl") {
      return d.cumCl.ook;
    } else if (key === "classes") {
      return d.classes.ook
    } else {
      return
    }
  } else {
    return
  }
}
function addText1(d, key) {
  if (d.type !== undefined){
    if (key === "cumCl") {
      return d.cumCl.bpsk;
    } else if (key === "classes") {
      return d.classes.bpsk;
    } else {
      return
    }
  } else {
    return
  }
}
function addText2(d, key) {
  if (d.type !== undefined){
    if (key === "cumCl") {
      return d.cumCl.oqpsk;
    } else if (key === "classes") {
      return d.classes.oqpsk;
    } else {
      return
    }
  } else {
    return
  }
}
function addText3(d, key) {
  if (d.type !== undefined){
    if (key === "cumCl") {
      return d.cumCl.bfskA;
    } else if (key === "classes") {
      return d.classes.bfskA;
    } else {
      return
    }
  } else {
    return
  }
}
function addText4(d, key) {
  if (d.type !== undefined){
    if (key === "cumCl") {
      return d.cumCl.bfskB;
    } else if (key === "classes") {
      return d.classes.bfskB;
    } else {
      return
    }
  } else {
    return
  }
}
function addText5(d, key) {
  if (d.type !== undefined){
    if (key === "cumCl") {
      return d.cumCl.bfskR2;
    } else if (key === "classes") {
      return d.classes.bfskR2;
    } else {
      return
    }
  } else {
    return
  }
}


function addTextClass0(d) {
  return addText0(d, "classes")
}
function addTextClass1(d) {
  return addText1(d, "classes")
}
function addTextClass2(d) {
  return addText2(d, "classes")
}
function addTextClass3(d) {
  return addText3(d, "classes")
}
function addTextClass4(d) {
  return addText4(d, "classes")
}
function addTextClass5(d) {
  return addText5(d, "classes")
}

function addTextCumCl0(d) {
  return addText0(d, "cumCl")
}
function addTextCumCl1(d) {
  return addText1(d, "cumCl")
}
function addTextCumCl2(d) {
  return addText2(d, "cumCl")
}
function addTextCumCl3(d) {
  return addText3(d, "cumCl")
}
function addTextCumCl4(d) {
  return addText4(d, "cumCl")
}
function addTextCumCl5(d) {
  return addText5(d, "cumCl")
}




function colorCase(d, clickedCol, nonClickedCol) {
	if (d._children && d._children.length > 0) {
		return nonClickedCol;
	} else {
		return clickedCol;
	}
}


function color(d) {
	var out;
  switch (d.depth) {
		case 0:
      out = colorCase(d, "#BDBDBD", "#737373");
			break;
		case 1:
			out = colorCase(d, "#CAB2D6", "#6A3D9A");
			break;
		case 2:
			out = colorCase(d, "#B2Df8A", "#33A02C");
			break;
		case 3:
			out = colorCase(d, "#FFFF99", "#B15928");
			break;
		case 4:
			out = colorCase(d, "#A6CEE3", "#1F78B4");
			break;
		case 5:
			//console.log(d._children);
      //console.log(d._children.length);
      out = colorCase(d, "#CAB2D6", "#6A3D9A");
			break;
		case 6:
      out = colorCase(d, "#B2Df8A", "#33A02C");
      break;
    case 7:
      out = colorCase(d, "#FFFF99", "#B15928");
      break;
    case 8:
      out = colorCase(d, "#A6CEE3", "#1F78B4");
      break; 
    default:
			out = colorCase(d, "#FFFF99", "#B15928");
			break;			
	}
	return out
}



/*
function colorStroke(d) {
	var out;
	switch (d.depth) {
		case 0:
			out = "#1F78B4";
			break;
		case 1:
			out = "#33A02C";
			break;
		case 2:
			out = "#FF7F00";
			break;
		case 3:
			out = "#6A3D9A";
			break;
		case 4:
			out = "#B15928";
			break;
		case 5:
			out = "#737373";
			break;
		default:
			out = "#737373";
			break;			
	}
	return out	
}
*/

function colorInfoBar(d) {

  var scaleInfoBar = d3.scale.linear()
        .domain(igDomain)
        .range(["white", "red"]);
	return scaleInfoBar(d.less)

}




/*
  if (d._children) {
    return "#3182bd";
  } else if (d.children) {
    return "#c6dbef";
  } else {
    return "#fd8d3c";
  }
*/

//var maxLess = d3.max(d3.entries(flare), function(d) {
  //  return d3.max(d3.entries(d.less), function(e) {
  //    return d3.max(e.less);
  //  });
  //});

  //var maxLess = d3.max(flare.children, function(d){return d.less});

  //var maxGreater = d3.max(flare.children, function(d){return d.greater});