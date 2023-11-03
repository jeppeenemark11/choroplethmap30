
let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

let countyData
let educationData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {


canvas.selectAll('path')
.data(countyData)
.enter()
.append('path')
.attr('d', d3.geoPath())
.attr('class', 'county')
.attr('fill', (cdi) => {
    let id = cdi['id']
    let c = educationData.find((item) => {
       return item['fips'] === id
    })
    let p = c['bachelorsOrHigher']
    if (p <= 11) {
        return '#98FB98'
    } if (p <= 22 && p > 11) {
        return '#90EE90'
    } if (p <= 33 && p > 22) {
        return '#3CB371'
    } if (p <= 44 && p > 33) {
        return '#2E8B57'
    } if (p <= 55 && p > 44) {
        return '#228B22'
    } if ( p > 55) {
        return '#006400'
    }})
    .attr('data-fips', (item) => {
        return item['id']
    })
    .attr('data-education', (item) => {
        let id = item['id']
        let c = educationData.find((item) => {
           return item['fips'] === id
        })
        let p = c['bachelorsOrHigher']
        return p
    })
    .on('mouseover', (item) =>{
        tooltip.transition()
        .style('visibility', 'visible')

        let id = item['id']
        let c = educationData.find((item) => {
           return item['fips'] === id
        })

        tooltip.text(c["area_name"] + ", " + c["state"] + ": " + c["bachelorsOrHigher"] + "%")
        .style("left", d3.event.pageX + 20 + "px")
    .style("top", d3.event.pageY - 10 + "px");

    })
    .on('mouseout', (item) => {
        tooltip.transition()
        .style('visibility', 'hidden')
    })

}

d3.json(countyURL).then(
    (data, error) =>{
        if (error){
            console.log(error)
        } else{
            countyData = topojson.feature(data, data.objects.counties).features 
            console.log(countyData)

            d3.json(educationURL).then(
                (data, error) => {
                    if (error){
                        console.log(error)
                    } else {
                        educationData = data
                        console.log(educationData)
                        drawMap()
                    }
                }
            )
        }
    }
    
)