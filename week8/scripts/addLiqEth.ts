import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const IUniswapV2Factory = require('@uniswap/v2-core/build/IUniswapV2Factory.json');
// const IUniswapV2Router02 = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json');
const IUniswapV2Pair = require('@uniswap/v2-core/build/IUniswapV2Pair.json');

const addLiquidityETH = async () => {
   
    const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // Example token to pair with ETH
    const theAddressWithTokenAndETH = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621"; // Address with both token and ETH
  
    // Parameters for addLiquidityETH
    const amountTokenDesired = ethers.parseUnits('1000', 18); // Example amount of DAI
    const amountTokenMin = ethers.parseUnits('990', 18);
    const amountETHMin = ethers.parseEther('0.005'); // Minimum ETH amount
    const ethAmount = ethers.parseEther('1'); // ETH to add as liquidity
    const deadline = await helpers.time.latest() + 1000;
    
    // Impersonate account
    await helpers.impersonateAccount(theAddressWithTokenAndETH);
    const impersonatedSigner = await ethers.getSigner(theAddressWithTokenAndETH);
    
    // Get the contracts
    const tokenContract = await ethers.getContractAt('IERC20', DAIAddress);
    const uniswapContract = await ethers.getContractAt(
        'IUniswap', 
      UNIRouter
    );
    
    // Check balances before
    const tokenBalBefore = await tokenContract.balanceOf(impersonatedSigner.address);
    const ethBalBefore = await ethers.provider.getBalance(impersonatedSigner.address);
    
    console.log('Token balance before:', ethers.formatUnits(tokenBalBefore, 18));
    console.log('ETH balance before:', ethers.formatEther(ethBalBefore));
    
    // Approve the token for the router
    await tokenContract.connect(impersonatedSigner).approve(UNIRouter, amountTokenDesired);
    console.log('Token approved for router');
    
    // Call addLiquidityETH
    console.log('-------------------------- Adding ETH liquidity -------------');
    const tx = await uniswapContract.connect(impersonatedSigner).addLiquidityETH(
      DAIAddress,
      amountTokenDesired,
      amountTokenMin,
      amountETHMin,
      impersonatedSigner.address,
      deadline,
      { value: ethAmount }
    );
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log('-------------------------- ETH liquidity added -------------');
    
    // Check balances after
    const tokenBalAfter = await tokenContract.balanceOf(impersonatedSigner.address);
    const ethBalAfter = await ethers.provider.getBalance(impersonatedSigner.address);
    
    console.log('Token balance after:', ethers.formatUnits(tokenBalAfter, 18));
    console.log('ETH balance after:', ethers.formatEther(ethBalAfter));
    
    // Get the LP token address (WETH pair)
    const factoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // Wrapped ETH address on mainnet
    
    const factoryContract = await ethers.getContractAt(
      IUniswapV2Factory.abi,
      factoryAddress
    );
    
    // TypeScript workaround
    const lpTokenAddress = await (factoryContract as any).getPair(DAIAddress, WETH);
    console.log("ETH-Token LP Token Address:", lpTokenAddress);
    
    // Get LP token balance
    const lpToken = await ethers.getContractAt(IUniswapV2Pair.abi, lpTokenAddress);
    const lpBalance = await lpToken.balanceOf(impersonatedSigner.address);
    console.log("LP Token Balance:", ethers.formatUnits(lpBalance, 18));
    
    return {
      lpTokenAddress,
      lpBalance,
      impersonatedSigner
    };
    
  };

  addLiquidityETH().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});