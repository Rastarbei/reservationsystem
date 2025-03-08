const SeatSelection = () => {
    return (
      <div className="seat-map">
        <h3>Select Your Seat</h3>
        <div className="seat-grid">
          {Array.from({ length: 50 }).map((_, i) => (
            <button key={i} className="seat"> {i + 1} </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default SeatSelection;
  