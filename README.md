# ETH-AVAX-2

The Flight Booking System contract implements simple functions like Book Flight, Cancel Bookings, getBookingStatus etc. which is being displayed on as a front-end application after connection of both with the help of hardhat. Metamask wallet is used as well for the transaction.

The smart contract is made on the remix.org and is deployed on the environment Dev - Hardhat Provider. The front-end is developed on vs-code and connected to the smart contract. The metamask wallet has been also added to the custom network so that it can easily connect to this http://127.0.0.1:8545 RPC.


```js

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract FlightBooking {
    address public owner;
    mapping(address => bool) public bookings;

    event FlightBooked(address passenger);
    event FlightCancelled(address passenger);

    constructor() {
        owner = msg.sender;
    }

    function bookFlight() public {
        require(msg.sender != owner, "Owner cannot book a flight.");
        require(!bookings[msg.sender], "Passenger has already booked a flight.");

        bookings[msg.sender] = true;

        emit FlightBooked(msg.sender);
    }

    function cancelBooking() public {
        require(bookings[msg.sender], "Passenger has not booked any flight.");

        bookings[msg.sender] = false;

        emit FlightCancelled(msg.sender);
    }

    function getBookingStatus(address passenger) public view returns (bool) {
        return bookings[passenger];
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


We will note down the deployed contract address and after that we will create a frontend for the project and then create a connection with the metamask wallet ans then direct the user to the wallet page whenever any transaction is to be made.
