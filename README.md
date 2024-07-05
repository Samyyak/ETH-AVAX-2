# ETH-AVAX-2: Flight Booking System

The Flight Booking System smart contract facilitates the booking and cancellation of flights. Users can book flights by sending 1 ETH, and they can cancel their bookings to receive a refund. This contract includes functionalities for checking booking statuses and is controlled by the contract owner. The frontend application interacts with the smart contract via Hardhat and Metamask.

## Description

The Flight Booking System contract allows users to book and cancel flights on a decentralized platform. It is deployed using Hardhat and integrates with a frontend application developed using VS Code. The system uses Metamask for handling transactions.

## Getting Started

### Installing

1. Clone the project repository from GitHub.
2. Navigate to the project directory.
3. Run the following command to install necessary dependencies:

   ```bash
   npm i

``` javascript
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

## Executing program

1. Open three terminals in your VS Code and navigate to the project directory in each terminal.
2. In the first terminal, start the local blockchain node:


   ```bash
    npx hardhat node

4. In the second terminal, deploy the contract to the local blockchain network:


   ```bash
    npx hardhat run --network localhost scripts/deploy.js
   
6. In the third terminal, launch the front-end of the project:


   ```bash
    npm run dev

   
The project should now be running on your localhost, typically at http://localhost:3000/.


## Working

We will document the deployed contract address and place it in the contract address of our index.js file. The frontend will establish a connection with the MetaMask wallet, directing the user to the wallet page for transaction approvals. Users will be able to book and cancel flights, which will redirect them to MetaMask to authorize transactions.

## Help
If you encounter any issues or need further assistance, refer to the help command within the project.


```bash
    npx hardhat help
```

## Authors

Contributors names and contact info:

Samyak Jain[https://www.linkedin.com/in/samyak-jain-179710233/]

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.

