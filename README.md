# ETH-AVAX-2

The Flight Booking System contract implements simple functions like Book Flight, Cancel Bookings, getBookingStatus etc. which is being displayed on as a front-end application after connection of both with the help of hardhat. Metamask wallet is used as well for the transaction.

The smart contract is made on the remix.org and is deployed on the environment Dev - Hardhat Provider. The front-end is developed on vs-code and connected to the smart contract. The metamask wallet has been also added to the custom network so that it can easily connect to this http://127.0.0.1:8545 RPC.


```js

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract FlightBooking {
    address payable public owner;
    mapping(address => bool) public bookings;

    event FlightBooked(address indexed user);
    event BookingCancelled(address indexed user);

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    constructor() {
        owner = payable(msg.sender);
    }

    function bookFlight() public payable {
        require(msg.value == 1 ether, "You must send exactly 1 ETH to book a flight");
        require(!bookings[msg.sender], "Flight already booked");
        bookings[msg.sender] = true;
        emit FlightBooked(msg.sender);
    }

    function cancelBooking() public {
        require(bookings[msg.sender], "No flight to cancel");
        bookings[msg.sender] = false;
        payable(msg.sender).transfer(1 ether);
        emit BookingCancelled(msg.sender);
    }

    function getBookingStatus(address user) public view returns (bool) {
        return bookings[user];
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}


```
After creating this file we will have to deploy it using hardhat so we follow the following instructions:

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/

First, we will record the deployed contract address. Next, we will develop a frontend for the project, integrating it with the MetaMask wallet. This integration will ensure that users are directed to their wallet page whenever a transaction needs to be executed.
