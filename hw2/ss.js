const width = 1000;
const height = 500;
const margin = 30;
const f = height -margin;
const svg  = d3.select('#scatter-plot')
            .attr('width', width)
            .attr('height', height);

let xParam = 'fertility-rate';
let yParam = 'child-mortality';
let radius = 'gdp';
let year = '2000';

// These variables will be useful in Part 2 & 3
const params = ['child-mortality', 'fertility-rate', 'gdp', 'life-expectancy', 'population'];
const colors = ['aqua', 'lime', 'gold', 'hotpink']

const x = d3.scaleLinear().range([margin*2, width-margin]);
const y = d3.scaleLinear().range([height-margin, margin]);


const xLable = svg.append('text').attr('transform', `translate(${width/2}, ${height})`);
const yLable = svg.append('text').attr('transform', `translate(${margin/2}, ${height/2}) rotate(-90)`);

// Part 1: similar to rows above, set the 'transform' attribute for axis
const xAxis = svg.append('g').attr('transform',  "translate( " + -margin      +" , " + f + ")");
const yAxis = svg.append('g').attr('transform',  "translate( " + margin       +" ,   0)");


// Part 2: define color and radius scales
const color = d3.scaleOrdinal(colors);
const r = d3.scaleSqrt([0, 1e8], [0, width / 48]);


// Part 2: add options to select element http://htmlbook.ru/html/select
// and add selected property for default value
 d3.select('#radius').selectAll('option');


// Part 3: similar to above, but for axis
 d3.select('#xParam').selectAll('option');
 d3.select('#yParam').selectAll('option');


loadData().then(data => {

    let regions = d3.nest()
                        .key(d => d.region)
                          .entries(data);
console.log(regions);
    color.domain(regions);


    d3.select('.slider').on('change', newYear);

    d3.select('#radius').on('change', newRadius);

    d3.select('#xParam').on('change',GetSelectedValuex );
    d3.select('#xParam').on('change', GetSelectedtextx);
    d3.select('#yParam').on('change', GetSelectedValuey);
    d3.select('#yParam').on('change', GetSelectedtexty);

    
    // Part 3: subscribe to axis selectors change

function GetSelectedValuex(){
       let ctx = document.getElementById("xParam");
       xParam = ctx.options[ctx.selectedIndex].value;
	return xParam;
        updateChart()
          }
          
function GetSelectedtextx(){
       let ctx = document.getElementById("xParam");
       xParam = ctx.options[ctx.selectedIndex].text;
	return xParam;
        updateChart()
          }
          
console.log(GetSelectedValuex(xParam)); 

function GetSelectedValuey(){
       let cty = document.getElementById("yParam");
       yParam = cty.options[cty.selectedIndex].value;
	return yParam;
        updateChart()
               
         }
function GetSelectedtexty(){
       let cty = document.getElementById("yParam");
       yParam = cty.options[cty.selectedIndex].text;
	return yParam;
        updateChart()
               
         }
console.log(GetSelectedValuey(yParam));
    // change 'year' value
    function newYear(){
        year = this.value;
        updateChart()

    }

    function newRadius(){
        // Part 2: similar to 'newYear'
        radius = this.value;
        updateChart()
    }

    
    function updateChart(){
        xLable.text(GetSelectedtextx());
        yLable.text(GetSelectedtexty());
        d3.select('.year').text(year);
 
        // change the domain of 'x', transform String to Number using '+'
        let xRange = data.map(d=> +d[GetSelectedValuex(xParam)][year]);
        x.domain([d3.min(xRange), d3.max(xRange)]);
	
        // call for axis    
	 xAxis .call(d3.axisBottom(x));

        // Part 1: create 'y axis' similary to 'x'
        let yRange = data.map(d=> +d[GetSelectedValuey(yParam)][year]);
        y.domain([d3.min(yRange), d3.max(yRange)]);

	yAxis.call(d3.axisLeft(y));
        // Part 2: change domain of new scale
        let rRange = data.map(d=> +d[radius][year]);
        r.domain([d3.min(rRange), d3.max(rRange)]);
	const svg= d3.select('svg');
        // Part 1, 2: create and update points
	let p = svg.selectAll("circle")
          
          .data(data, d => d.country)
	  .attr("r", d=> r(+d[radius][year]))
	  .attr("cx",d=> x(+d[GetSelectedValuex(xParam)][year]))
	  .attr("cy", d=> y(+d[GetSelectedValuey(yParam)][year]))
          .style("fill",d => color(d.region));
	p.enter().append("circle")
	  .attr("r", d=> r(+d[radius][year]) )
	  .attr("cx", d=> x(+d[GetSelectedValuex(xParam)][year]))
	  .attr("cy", d=> y(+d[GetSelectedValuey(yParam)][year]))
         .style("fill",d => color(d.region));
	p.exit().remove();
}
   updateChart(); 
});

async function loadData() {
   const population = await d3.csv("data/pop.csv");
    const rest = { 
        'gdp': await d3.csv('data/gdppc.csv'),
        'child-mortality': await d3.csv('data/cmu5.csv'),
        'life-expectancy': await d3.csv('data/life_expect.csv'),
        'fertility-rate': await d3.csv('data/tfr.csv')
    };
    const data = population.map(d=>{
        return {
            geo: d.geo,
            country: d.country,
            region: d.region,
            population: {...d},
            ...Object.values(rest).map(v=>v.find(r=>r.geo===d.geo)).reduce((o, d, i)=>({...o, [Object.keys(rest)[i]]: d }), {})
            
        }
    })
    return data;
}