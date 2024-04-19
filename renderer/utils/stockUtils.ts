export const handleBuy = (
  stocks,
  portfolio,
  setStocks,
  setPortfolio,
  playerBalance,
  setPlayerBalance,
  symbol
) => {
  const selectedStock = stocks.find((stock) => stock.symbol === symbol);
  const totalPrice = selectedStock.price;
  if (playerBalance >= totalPrice) {
    setPlayerBalance(playerBalance - totalPrice);
    const updatedStocks = stocks.map((stock) =>
      stock.symbol === symbol
        ? { ...stock, quantity: stock.quantity + 1 }
        : stock
    );
    setStocks(updatedStocks);
    const existingPortfolioItem = portfolio.find(
      (item) => item.symbol === selectedStock.symbol
    );
    if (existingPortfolioItem) {
      const updatedPortfolio = portfolio.map((item) =>
        item.symbol === selectedStock.symbol
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setPortfolio(updatedPortfolio);
    } else {
      setPortfolio([...portfolio, { ...selectedStock, quantity: 1 }]);
    }
  } else {
    alert("Insufficient funds!");
  }
};

export const handleSell = (
  portfolio,
  setPortfolio,
  playerBalance,
  setPlayerBalance,
  symbol
) => {
  const selectedStock = portfolio.find((item) => item.symbol === symbol);
  const totalPrice = selectedStock.price;
  if (selectedStock.quantity > 0) {
    setPlayerBalance(playerBalance + totalPrice);
    const updatedPortfolio = portfolio.map((item) =>
      item.symbol === symbol ? { ...item, quantity: item.quantity - 1 } : item
    );
    setPortfolio(updatedPortfolio.filter((item) => item.quantity > 0));
  } else {
    alert("You don't have this stock in your portfolio!");
  }
};
