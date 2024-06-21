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
