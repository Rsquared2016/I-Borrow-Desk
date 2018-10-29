import React, { Component } from 'react';
import {
  ChartCanvas,
  Chart,
  EventCapture,
} from 'react-stockcharts';
import {
  BarSeries,
  LineSeries,
} from 'react-stockcharts/lib/series';
import {
  XAxis,
  YAxis,
} from 'react-stockcharts/lib/axes';
import { fitWidth } from 'react-stockcharts/lib/helper';
import {
  CrossHairCursor,
  MouseCoordinateX,
} from 'react-stockcharts/lib/coordinates';
import { SingleValueTooltip } from 'react-stockcharts/lib/tooltip';
import { discontinuosTimeScaleProvider } from 'react-stockcharts/lib/scale';
import d3 from 'd3';
import { timeFormat } from "d3-time-format";

class StockChart extends Component {
  render() {

    const { data, daily, width, ratio } = this.props;
    const parseDate = daily
      ? d3.time.format("%Y-%m-%d").parse
      : d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

    const parsedData = data.map(el => {
      let parsed = {};
      parsed.fee = el.fee !== -0.99 ? el.fee : null;
      parsed.available = el.available;
      parsed.date = new Date(parseDate(el.time).getTime());
      return parsed;
    });

    return (
      <ChartCanvas
        ratio={ratio} width={width} height={600}
        margin={{left: 80, right: 50, top:60, bottom: 30}}
        type="hybrid"
        data={parsedData}
        xAccessor={d => d.date}
        xScaleProvider={discontinuousTimeScaleProvider}
        seriesName="Stock Chart"
        xExtents={list => list.map(d => d.date)}
      >
        <Chart
          id={1}
          yMousePointerDisplayLocation="right"
          yMousePointerDisplayFormat={d3.format(".1%")}
          yExtents={[d => 0, d => d.fee > 0 ? d.fee : 0]}
        >
          <XAxis axisAt="bottom" orient="bottom" />
          <YAxis axisAt="right" orient="right" ticks={5} tickFormat={d3.format(".0%")}/>
          <LineSeries yAccessor={d => d.fee} stroke="#FF2D04" />
          <MouseCoordinateX
            at="bottom"
            displayFormat={timeFormat("%Y-%m-%d")}/>
          <SingleValueTooltip
            yAccessor={d => d.fee}
            xAccessor={d => d.date}
            yLabel="Fee"
            origin={[-80, -40]}
            yDisplayFormat={d3.format(".1%")}
            fontSize={16}
            xLabel="Date"
            xDisplayFormat={timeFormat("%Y-%m-%d")}
            labelStroke="#2C3E50"
          />
        </Chart>
        <Chart id={2}
               yMousePointerDisplayLocation="left"
               yMousePointerDisplayFormat={d3.format(",")}
               yExtents={[d => 0, d => d.available]}
        >
          <YAxis axisAt="left" orient="left" ticks={5}/>
          <BarSeries  yAccessor={d => d.available } />
          <SingleValueTooltip
            yAccessor={d => d.available}
            xAccessor={d => d.date}
            yLabel="Available"
            xLabel="Date"
            xDisplayFormat={timeFormat("%Y-%m-%d")}
            origin={[-80, -20]}
            yDisplayFormat={d3.format(",")}
            fontSize={16}
            labelStroke="#2C3E50"
          />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    );
  }
}

export default fitWidth(StockChart);