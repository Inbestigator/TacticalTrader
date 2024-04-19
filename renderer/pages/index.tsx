import React, { useState, useEffect } from "react";
import { handleBuy, handleSell } from "../utils/stockUtils";
import defaultStocks from "../utils/stocks";
import Konami from "konami-code-js";
import { useRouter } from "next/router";

const GamePage = () => {
  const router = useRouter();
  const [playerBalance, setPlayerBalance] = useState(2000);
  const [stocks, setStocks] = useState(defaultStocks);

  const [portfolio, setPortfolio] = useState([]);
  const [dayCount, setDayCount] = useState(0);
  const [showMod, setShowMod] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [weeklyTrend, setWeeklyTrend] = useState({});
  const [displayedStocks, setDisplayedStocks] = useState([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [showCheatsModal, setShowCheatsModal] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    new Konami(() => {
      setShowCheatsModal(!showCheatsModal);
    });

    const intervalId = setInterval(() => {
      const updatedStocks = stocks.map((stock) => {
        let change = 0;
        switch (weeklyTrend[stock.symbol]) {
          case "upward":
            if (Math.random() < 0.1) {
              change = Math.random() * -0.15 - 0.1; // 10% chance to go down
            } else {
              change = Math.random() * 0.1 + 0.05; // Upward trend: +5% to +15%
            }
            break;
          case "downward":
            if (Math.random() < 0.1) {
              change = Math.random() * 0.1 + 0.05; // 10% chance to go up
            } else {
              change = Math.random() * -0.15 - 0.1; // Downward trend: -10% to -25%
            }
            break;
          case "craze":
            change = Math.random() * 0.5 + 0.5; // Craze: +50% to +100%
            break;
          case "recess":
            change = Math.random() * -0.5 - 0.3; // Recess: -30% to -80%
            break;
          case "idle":
          default:
            change = Math.random() * 0.05 - 0.025; // Idle: -2.5% to +2.5%
        }
        const newPrice = stock.price * (1 + change);
        return { ...stock, price: newPrice };
      });
      setStocks(updatedStocks);

      setDayCount((prevDayCount) => prevDayCount + 1);

      if (dayCount % 7 === 0) {
        const updatedWeeklyTrend = {};
        updatedStocks.forEach((stock) => {
          const random = Math.random();
          if (random < 0.3) {
            updatedWeeklyTrend[stock.symbol] = "upward"; // 30% chance for upward trend
          } else if (random < 0.6) {
            updatedWeeklyTrend[stock.symbol] = "downward"; // 30% chance for downward trend
          } else if (random < 0.7) {
            updatedWeeklyTrend[stock.symbol] = "craze"; // 10% chance for craze
          } else if (random < 0.8) {
            updatedWeeklyTrend[stock.symbol] = "recess"; // 10% chance for recess
          } else {
            updatedWeeklyTrend[stock.symbol] = "idle"; // 20% chance for idle
          }
        });
        setWeeklyTrend(updatedWeeklyTrend);

        const randomStocks = [];
        while (randomStocks.length < 3) {
          const randomIndex = Math.floor(Math.random() * stocks.length);
          const randomStock = stocks[randomIndex];
          if (!randomStocks.includes(randomStock)) {
            randomStocks.push(randomStock);
          }
        }

        setDisplayedStocks(showAll ? stocks : randomStocks);
      }

      // Check win condition
      if (playerBalance >= 20000) {
        setGameEnded(true);
      }

      // Check lose condition
      if (dayCount >= 365 && playerBalance < 20000) {
        setGameEnded(true);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [stocks, dayCount, weeklyTrend, playerBalance]);

  useEffect(() => {
    setPortfolio((prevPortfolio) => {
      const updatedPortfolio = prevPortfolio.map((item) => {
        const correspondingStock = stocks.find(
          (stock) => stock.symbol === item.symbol
        );
        return {
          ...item,
          price: correspondingStock ? correspondingStock.price : item.price,
        };
      });
      return updatedPortfolio;
    });

    setDisplayedStocks((prevDisplayedStocks) => {
      const updatedDisplayedStocks = prevDisplayedStocks.map((stock) => {
        const correspondingStock = stocks.find(
          (s) => s.symbol === stock.symbol
        );
        return {
          ...stock,
          price: correspondingStock ? correspondingStock.price : stock.price,
        };
      });
      return updatedDisplayedStocks;
    });
  }, [stocks]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleCheatSelection = (cheat) => {
    switch (cheat) {
      case "showMod":
        setShowMod(!showMod);
        break;
      case "showAll":
        setShowAll(!showAll);
        break;
      case "win":
        setPlayerBalance(20000);
        break;
      case "lose":
        setDayCount(365);
        break;
      default:
        break;
    }
  };

  if (gameEnded) {
    if (playerBalance >= 20000) {
      return (
        <div className="container mx-auto flex flex-col justify-center items-center h-screen">
          <h1 className="text-3xl font-bold mt-8 mb-4">
            Congratulations! You won!
          </h1>
          <button
            onClick={() => router.reload()}
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md"
          >
            Home
          </button>
        </div>
      );
    } else {
      return (
        <div className="container mx-auto flex flex-col justify-center items-center h-screen">
          <h1 className="text-3xl font-bold mt-8 mb-4">Game Over! You lost!</h1>
          <button
            onClick={() => router.reload()}
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md"
          >
            Home
          </button>
        </div>
      );
    }
  }

  return (
    <div className="container mx-auto">
      {showBanner && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-yellow-500 text-white p-8 rounded-lg">
            <h2 className="text-elg font-semibold">
              10x your savings in one year!
            </h2>
          </div>
        </div>
      )}
      <h2 className="text-2xl font-semibold">Available Stocks</h2>
      <div className="grid grid-cols-3 gap-4">
        {displayedStocks.map((stock) => (
          <div key={stock.symbol} className="card w-full">
            <h2 className="text-xl font-semibold">{stock.name}</h2>
            <p>Price: ${stock.price.toFixed(2)}</p>{" "}
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
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Portfolio</h2>
        <div className="grid grid-cols-3 gap-4">
          {portfolio.map((item) => (
            <div key={item.symbol} className="card w-full">
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
          ))}
        </div>
      </div>
      <div className="mt-8 justify-center fixed bottom-0 right-4 text-right">
        <h2 className="text-2xl font-semibold">Day: {dayCount}</h2>{" "}
        <h2 className="text-2xl font-semibold">
          Player Balance: ${playerBalance.toFixed(2)}
        </h2>
      </div>
      {showCheatsModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Select Cheats</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
              onClick={() => handleCheatSelection("showMod")}
            >
              Show modifiers
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
              onClick={() => handleCheatSelection("showAll")}
            >
              Show all stocks
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
              onClick={() => handleCheatSelection("win")}
            >
              Win
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
              onClick={() => handleCheatSelection("lose")}
            >
              Lose
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;