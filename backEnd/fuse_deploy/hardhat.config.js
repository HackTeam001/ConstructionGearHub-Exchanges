require("@nomicfoundation/hardhat-toolbox");


require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */


const FUSE_URL = process.env.FUSE_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: { version: "0.8.20" },
  networks: {
    fuse: {
      url: FUSE_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    ganache: {
      url: `http://127.0.0.1:7545`,
    },
  },
};
