const Legend = ({
    continents = [], 
    colorScale = () => {} 
    }) => {

    return (
      <div style={{ display: "flex", flexWrap: 'wrap', justifyContent: 'center', gap: 18, marginTop: 30 }}>
        {continents?.map((continent) => (
          <div key={continent} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: colorScale(continent), opacity: 0.9}} />
            <span style={{fontSize:12}}>{continent}</span>
          </div>
        ))}
      </div>
    );
  }
  

export default Legend;