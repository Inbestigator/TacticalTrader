const StockCard = ({
  stocks,
  stock,
  portfolio,
  setStocks,
  setPortfolio,
  playerBalance,
  setPlayerBalance,
  handleBuy,
  showMod,
  weeklyTrend,
}) => {
  return (
    <div key={stock.symbol} className="card">
      <h2 className="text-xl font-semibold">{stock.name}</h2>
      <p>Price: ${stock.price.toFixed(2)}</p>
      {showMod && <p>Mod: {weeklyTrend[stock.symbol]}</p>}
      <button
        onClick={() =>
          handleBuy(
            stocks,
            portfolio,
            setStocks,
            setPortfolio,
            playerBalance,
            setPlayerBalance,
            stock.symbol
          )
        }
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md"
      >
        Buy
      </button>
    </div>
  );
};

export default StockCard;
