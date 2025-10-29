import { useEffect, useRef, useState } from 'react';
import * as d3 from "d3";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import Axes from './components/Axes';
import Legend from './components/Legend';
import './App.css';

const App = () => {
  const originalWidth = 900;
  const originalHeight = 500;
  const aspectRatio = originalWidth / originalHeight;
  const margin = { top: 20, right: 30, bottom: 60, left: 70 };
  
  const containerRef = useRef(null);
  const [svgSize, setSvgSize] = useState({ width: originalWidth, height: originalHeight });
  const [dataset, setDataset] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [tooltip, setTooltip] = useState(null);

  const innerWidth = svgSize.width - margin.left - margin.right;
  const innerHeight = svgSize.height - margin.top - margin.bottom;


  // handle chart responsivness
  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      const minWidth = 500;
      const maxWidth = 1200;
      const width = Math.min(Math.max(viewportWidth * 0.5, minWidth), maxWidth);
      const height = width / aspectRatio;
      setSvgSize({ width, height });
    };
  
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  

  // fetch our data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await d3.csv(
          "https://ourworldindata.org/grapher/literacy-rate-of-young-men-and-women.csv?v=1&csvType=filtered&useColumnShortNames=false&overlay=download-data"
        );
        const data = response?.map((d) => ({
          literacy_rate_men: +d["Literacy rate among young men"],
          literacy_rate_women: +d["Literacy rate among young women"],
          year: +d["Year"],
          continent: d["World regions according to OWID"],
          entity: d["Entity"],
        }));
        setDataset(data);
      }
      catch (error) {
        setIsLoading(false);
        setErrorMsg(error || 'Opps, an error occurred while fetching data.')
      }
      finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);


  // scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, (d) => d.literacy_rate_women))
    .range([0, innerWidth]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, (d) => d.literacy_rate_men))
    .range([innerHeight, 0]);

  // map unique continents + assign colors
  const continents = Array.from(new Set(dataset?.map((d) => d.continent)));
  const colorScale = d3.scaleOrdinal().domain(continents).range(d3.schemeCategory10);

  return (
    <>
    <div ref={containerRef} style={{ width: "100%" }}>
      <h1 style={{ margin: 0 }}>
        <span className="title-highlight">Literacy rate of young men vs. women, 2023</span>
        </h1>
      <p style={{ color:'gray', fontSize: 13, marginTop:3, marginBottom:25 }}>
        Share of women and men aged between 15 and 24 years old who can both read and write.
      </p>
      <p style={{ marginBottom: 20, fontSize: 8 }}>
        Data source: UNESCO Institute for Statistics (2025) 
        -
        {' '}
        <a style={{ color:'black' }} href="https://ourworldindata.org/literacy" target='_blank'>
         ourworldindata.org/literacy
        </a>
      </p>
      
      {errorMsg && 
      <h6 style={{ color: 'red' }}>
        {errorMsg}
      </h6>}

      {isLoading 
      ? <span className="loader"></span>
      :
      <>
      <svg
          width="100%"
          height={svgSize.height}
          viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
        >
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            <Axes 
            innerWidth={innerWidth}
            innerHeight={innerHeight} 
            xScale={xScale} 
            yScale={yScale} 
            margin={margin} 
            />

          <text
            x={innerWidth / 2}
            y={innerHeight + margin.bottom - 5}
            textAnchor="middle"
            fontSize="14"
            fill="#333"
          >
            Literacy Rate among Women (%)
          </text>

          <text
            transform={`rotate(-90)`}
            x={-innerHeight / 2}
            y={-margin.left + 15}
            textAnchor="middle"
            fontSize="14"
            fill="#333"
          >
            Literacy Rate among Men (%)
          </text>

          {dataset?.map((d, i) => (
              <g
                key={i}
                onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY, data: d })}
                onMouseLeave={() => setTooltip(null)}
              >
                <motion.circle
                  cx={xScale(d.literacy_rate_women)}
                  cy={yScale(d.literacy_rate_men)}
                  fill={colorScale(d.continent)}
                  r={6}
                  opacity={0.9}
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: 6, opacity: 0.9 }}
                  transition={{ duration: 1 }} />
                <motion.text
                  x={xScale(d.literacy_rate_women) + 10}
                  y={yScale(d.literacy_rate_men) + 4}
                  fontSize="10"
                  fill="#525252"
                  style={{ cursor: "default" }}
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                >
                  {d.entity}
                </motion.text>
              </g>
            ))}
          </g>
        </svg>

        <Legend 
        continents={continents} 
        colorScale={colorScale} 
        />

        {tooltip && (
          <div
            style={{
              position: "fixed",
              left: tooltip.x + 12,
              top: tooltip.y + 12,
              backgroundColor: "black",
              color: "white",
              padding: "6px 10px",
              fontSize: "10px",
              opacity: 0.8,
            }}
          >
            <strong>{tooltip.data.entity}</strong>
            <div style={{ height: "0.09px", backgroundColor: "#868686", margin: 5 }} />
            <strong>Women:</strong> {tooltip.data.literacy_rate_women.toFixed(1)}%
            <br />
            <strong>Men:</strong> {tooltip.data.literacy_rate_men.toFixed(1)}%
            <br />
          </div>
        )}
        </>
      }

    </div>
    
    <div className="footer">
      [Built by: Ibtisam]
    </div>
    </>
  );
};

export default App;