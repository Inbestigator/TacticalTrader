const PortfolioCard = ({
  item,
  portfolio,
  setPortfolio,
  playerBalance,
  setPlayerBalance,
  handleSell
}) => {
  return (
    <div key={item.symbol} className="card">
      <h3 className="text-xl font-semibold">{item.name}</h3>
      <p>Price: ${item.price.toFixed(2)}</p>
      <p>Quantity: {item.quantity}</p>
      <button
        onClick={() =>
          handleSell(
            portfolio,
            setPortfolio,
            playerBalance,
            setPlayerBalance,
            item.symbol
          )
        }
        className="bg-red-500 text-white px-4 py-2 mt-2 rounded-md"
      >
        Sell
      </button>
    </div>
  );
};

export default PortfolioCard;
