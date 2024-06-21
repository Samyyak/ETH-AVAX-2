// scripts/deploy.js
const hre = require("hardhat");

async function main() {
    const FlightBooking = await hre.ethers.getContractFactory("FlightBooking");
    const flightBooking = await FlightBooking.deploy();
    await flightBooking.deployed();

    console.log(`FlightBooking deployed to: ${flightBooking.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
