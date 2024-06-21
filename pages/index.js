import { useState, useEffect } from "react";
import { ethers } from "ethers";
import flightBookingAbi from "../artifacts/contracts/FlightBooking.sol/FlightBooking.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [flightBooking, setFlightBooking] = useState(undefined);
  const [bookingStatus, setBookingStatus] = useState(undefined);
  const [message, setMessage] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
  const flightBookingABI = flightBookingAbi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(undefined);
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts);
      getFlightBookingContract();
    } catch (error) {
      setMessage("Error connecting account: " + (error.message || error));
    }
  };

  const getFlightBookingContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const flightBookingContract = new ethers.Contract(contractAddress, flightBookingABI, signer);

    setFlightBooking(flightBookingContract);
  };

  const getBookingStatus = async () => {
    try {
      if (flightBooking && account) {
        const status = await flightBooking.getBookingStatus(account);
        setBookingStatus(status);
      }
    } catch (error) {
      setMessage("Error fetching booking status: " + (error.message || error));
    }
  };

  const bookFlight = async () => {
    setMessage("");
    if (flightBooking) {
      try {
        let tx = await flightBooking.bookFlight({ value: ethers.utils.parseEther("1.0") });
        await tx.wait();
        getBookingStatus();
        setMessage("Flight booked successfully!");
      } catch (error) {
        const userMessage = error.code === "ACTION_REJECTED"
          ? "Unable to book flight: user rejected transaction"
          : "Unable to book flight: " + (error.message || error);
        setMessage(userMessage);
      }
    }
  };

  const cancelBooking = async () => {
    setMessage("");
    if (flightBooking) {
      try {
        let tx = await flightBooking.cancelBooking();
        await tx.wait();
        getBookingStatus();
        setMessage("Flight cancelled successfully!");
      } catch (error) {
        const errorMessage = error.data?.message || error.message || error.toString();
        const userMessage = errorMessage.includes("No flight to cancel")
          ? "No flights to cancel!"
          : "Unable to cancel booking: " + errorMessage;
        setMessage(userMessage);
      }
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this flight booking system.</p>;
    }

    if (!account) {
      return (
        <button onClick={connectAccount}>Connect MetaMask Wallet</button>
      );
    }

    if (bookingStatus === undefined) {
      getBookingStatus();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Booking Status: {bookingStatus ? "Booked" : "Not Booked"}</p>
        <div className="button-container">
          <button onClick={bookFlight}>Book Flight (1 ETH)</button>
          <button onClick={cancelBooking}>Cancel Booking</button>
        </div>
        {message && <p><strong>{message}</strong></p>}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to Flight Booking System</h1>
      </header>
      {initUser()}
      <style jsx>{`
 .container {
  text-align: center;
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #333;
  font-family: 'Arial', sans-serif;
  background-color: #b0e0e6;
  padding: 20px;
}

header h1 {
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  color: #4682b4;
}

.button-container {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

button {
  padding: 15px 30px;
  font-size: 18px;
  background-color: #1e90ff;
  color: #fff;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  max-width: 300px;
  width: 100%;
}

button:hover {
  background-color: #104e8b;
  transform: scale(1.05);
}

p {
  margin: 10px 0;
  font-size: 1.2rem;
  line-height: 1.6;
  color: #333;
}

.message {
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  font-weight: bold;
  max-width: 400px;
  text-align: center;
}
`}</style>

    </main>
  );
}
