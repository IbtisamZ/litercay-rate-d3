const Axes = ({ 
   innerWidth = 0,
   innerHeight = 0, 
   xScale = () => {}, 
   yScale  = () => {} 
  }) => {

  const xTicks = xScale.ticks(6);
  const yTicks = yScale.ticks(6);

  return (
    <g>
      {/* gridlines */}
      {xTicks?.map((tick, i) => (
        <line
          key={`x-grid-${i}`}
          x1={xScale(tick)}
          x2={xScale(tick)}
          y1={0}
          y2={innerHeight}
          stroke="#e0e0e0"
          strokeWidth={1}
        />
      ))}
      {yTicks?.map((tick, i) => (
        <line
          key={`y-grid-${i}`}
          y1={yScale(tick)}
          y2={yScale(tick)}
          x1={0}
          x2={innerWidth}
          stroke="#e0e0e0"
          strokeWidth={1}
        />
      ))}

      {/* x-axis ticks */}
      {xTicks?.map((tick, i) => (
        <g key={`x-tick-${i}`} transform={`translate(${xScale(tick)}, ${innerHeight})`}>
          <line y2="6" stroke="#868686" />
          <text y="20" textAnchor="middle" fontSize="10">
            {`${tick}%`}
          </text>
        </g>
      ))}

       {/* y-axis ticks */}
      {yTicks?.map((tick, i) => (
        <g key={`y-tick-${i}`} transform={`translate(0, ${yScale(tick)})`}>
          <line x2="-6" stroke="#868686" />
          <text x="-10" dy="0.32em" textAnchor="end" fontSize="10">
          {`${tick}%`}
          </text>
        </g>
      ))}

       {/* draw x-y axes */}
      <line
        x1="0"
        x2={innerWidth}
        y1={innerHeight}
        y2={innerHeight}
        stroke="#868686"
      />
      <line
        x1="0"
        x2="0"
        y1="0"
        y2={innerHeight}
        stroke="#868686"
      />
    </g>
  );
}

export default Axes;