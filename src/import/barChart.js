var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-scale"),
    require("d3-axis")
);

var drawChart = function () {
    let ds = this.ds
    let svgContainer = d3.select("#" + this.chartData.selector),
        cs = {
            bar: {
                hPadding: 8,
                vPadding: 5
            }, x: {
                axisHeight: 25,
                ticks: 5
            }, y: {
                domain: [],
                range: [],
                axisWidth: 40
            }
        };

    cs.x.scale = d3.scaleLinear()
        .domain([0, this.max])
        .range([0, this.width - cs.bar.hPadding - cs.y.axisWidth]);

    ds.forEach((t) => cs.y.domain.push(t['dim']));
    ds.forEach((t, i) => cs.y.range.push(((this.chartData.height - cs.x.axisHeight - this.titleHeight + cs.bar.vPadding) * i) / ds.length));
    cs.y.scale = d3.scaleOrdinal().domain(cs.y.domain).range(cs.y.range);

    svgContainer.selectAll("g")
        .data(ds)
        .enter().append("g")
        .append("rect")
        .attr("class", this.selector)
        .attr("width", d => {
            return cs.x.scale(d.metric);
        }).attr("height", (d, i) => {
            return (this.height - cs.x.axisHeight - this.titleHeight - cs.bar.vPadding) / this.chartData.data.length - 1
        }).attr("y", (d, i) => {
            return i * (this.height - cs.x.axisHeight - this.titleHeight) / this.chartData.data.length + 1 + this.titleHeight;
        }).attr("x", cs.y.axisWidth + cs.bar.hPadding)
        .on("mouseover", d => {
            this.addTooltip(d, event);
        })
        .on("mouseout", d => {
            this.removeTooltip(d);
        });

    cs.x.axis = d3.axisBottom().ticks(cs.x.ticks, "s").scale(cs.x.scale);
    cs.y.axis = d3.axisLeft().scale(cs.y.scale);

    cs.x.yOffset = this.height - this.titleHeight;
    cs.x.xOffset = cs.bar.hPadding + cs.y.axisWidth;

    cs.y.yOffset = cs.bar.vPadding + this.titleHeight - 1;
    cs.y.xOffset = cs.y.axisWidth;

    svgContainer.append("g").attr("transform", "translate(" + cs.y.xOffset + ", " + cs.y.yOffset + ")").call(cs.y.axis);
    svgContainer.append("g").attr("transform", "translate(" + cs.x.xOffset + ", " + cs.x.yOffset + ")").call(cs.x.axis);
};

export default drawChart;