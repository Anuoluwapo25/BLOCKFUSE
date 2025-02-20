const { ethers } = require("hardhat");
// import hre from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

const main = async () => {
  try {
    const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
   
    const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  
    const theAddressIFoundWithUSDCAndDAI = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";
    

    
    // Impersonate the account with USDC and DAI
    await helpers.impersonateAccount(theAddressIFoundWithUSDCAndDAI);
    const impersonatedSigner = await ethers.getSigner(theAddressIFoundWithUSDCAndDAI);
    
    // Get contract instances
    const usdcContract = await ethers.getContract("IERC20", USDCAddress);
    const daiContract = await ethers.getContract("IERC20", DAIAddress);
    const uniswapContract = await ethers.getContract("IUniswap", UNIRouter);
    
    // Get USDC balance
    const usdcBal = await usdcContract.balanceOf(impersonatedSigner.address);
    
    // Log the balance as a string and formatted
    console.log('Raw USDC balance:', usdcBal.toString());
    console.log('Impersonated acct USDC bal:', ethers.formatUnits(usdcBal, 6));
    
    // Get DAI balance
    const daiBal = await daiContract.balanceOf(impersonatedSigner.address);
    console.log('Raw DAI balance:', daiBal.toString());
    console.log('Impersonated acct DAI bal:', ethers.formatUnits(daiBal, 18));
    
    // Log account details
    console.log('Impersonated account address:', impersonatedSigner.address);
    
    // Optional: Check ETH balance
    const ethBal = await ethers.provider.getBalance(impersonatedSigner.address);
    console.log('ETH balance:', ethers.formatEther(ethBal));
    
  } catch (error) {
    console.error('Error in main function:');
    console.error(error);
  }
};

// Execute main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });