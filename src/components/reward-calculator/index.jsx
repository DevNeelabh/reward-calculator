import React, { useEffect } from "react";
import { useState } from "react";
import transactions from "./data/transactions";
import axios from "axios";
import "./styles.css";

const RewardCalculator = () => {
  const [transactionData, setTransactionData] = useState([]);

  // Simulate API call to fetch transaction data
  const fetchData = async () => {
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000)).catch((error) =>
      console.error("Error fetching transaction data", error)
    );
    setTransactionData(transactions);
  };
  const fetchtransactionData = async () => {
    try {
      const response = await fetch("http://localhost:3001/transactions");
      const data = await response.json();
      setTransactionData(data);
    } catch (error) {
      console.error("Error fetching transaction data", error);
    }
  };

  const fetchDataFromAxios = async () => {
    try {
      const response = await axios.get("http://localhost:3001/transactions");
      if (response.status === 200) {
        const data = response.data.transactions;
        setTransactionData(data);
      }
    } catch (err) {
      console.error("Error fetching transaction data", err);
    }
  };
  // Call fetchData when components mount
  useEffect(() => {
    // Simulate async API call
    //fetchTransaction();
    //fetchJsonApi();
    //Uncomment above for using either fetch or axios
    //run below command terminal
    //npx json-server src/component/reward-calculator/data/db.json --port 3001
    fetchData();
  }, []);

  // Function to calculate reward points
  const calculateRewardPoints = (amount) => {
    let points = 0;
    if (amount > 100) {
      points += 2 * (amount - 100);
    } else if (amount > 50) {
      points += amount - 50;
    }
    return points;
  };

  // Function to calculate reward points for each customer per month and get total
  const calculateRewards = () => {
    const rewardSummary = {};
    transactionData.forEach((transaction) => {
      const { customerId, month, amount } = transaction;
      const points = calculateRewardPoints(amount);
      if (!rewardSummary[customerId]) {
        rewardSummary[customerId] = { total: 0, months: {} };
      }
      if (!rewardSummary[customerId].months[month]) {
        rewardSummary[customerId].months[month] = 0;
      }
      rewardSummary[customerId].months[month] += points;
      rewardSummary[customerId].total += points;
    });
    return rewardSummary;
  };

  const rewardSummary = calculateRewards();

  // Render reward summary
  return (
    <div className="container">
      <h1 className="header">Reward Points Summary</h1>
      <div>
        {Object.keys(rewardSummary).map((customerId) => (
          <div className="customer" key={customerId}>
            <h2>Customer ID: {customerId}</h2>
            <h3>Total Reward Points: {rewardSummary[customerId].total}</h3>
            <h3>Monthly Reward Points:</h3>
            <ul className="monthly-points">
              {Object.entries(rewardSummary[customerId].months).map(
                ([month, points]) => (
                  <li key={month}>
                    {month}: {points}
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardCalculator;
