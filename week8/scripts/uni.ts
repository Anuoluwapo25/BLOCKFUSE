import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const IUniswapV2Factory = require('@uniswap/v2-core/build/IUniswapV2Factory.json');
// const IUniswapV2Router02 = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json');
const IUniswapV2Pair = require('@uniswap/v2-core/build/IUniswapV2Pair.json');

const main = async () => {
    const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const theAddressIFoundWithUSDCAndDAI = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";
    
    let AmtADesired = ethers.parseUnits('100000', 6);
    let AmtBDesired = ethers.parseUnits('100000', 18);
    let AmtAMin = ethers.parseUnits('99000', 6);
    let AmtBMin = ethers.parseUnits('99000', 18);
    let deadline = await helpers.time.latest() + 5000;
    
    await helpers.impersonateAccount(theAddressIFoundWithUSDCAndDAI);
    const impersonatedSigner = await ethers.getSigner(theAddressIFoundWithUSDCAndDAI);
    
    let usdcContract = await ethers.getContractAt('IERC20', USDCAddress);
    let daiContract = await ethers.getContractAt('IERC20', DAIAddress);
    let uniswapContract = await ethers.getContractAt('IUniswap', UNIRouter);
    
    const usdcBal = await usdcContract.balanceOf(impersonatedSigner.address);
    const daiBal = await daiContract.balanceOf(impersonatedSigner.address);
    
    console.log('impersonneted acct usdc bal BA:', ethers.formatUnits(usdcBal, 6));
    console.log('impersonneted acct dai bal BA:', ethers.formatUnits(daiBal, 18));
    
    await usdcContract.connect(impersonatedSigner).approve(UNIRouter, AmtADesired);
    await daiContract.connect(impersonatedSigner).approve(UNIRouter, AmtBDesired);
    
    console.log('-------------------------- Adding liquidity -------------');
    await uniswapContract.connect(impersonatedSigner).addLiquidity(
        USDCAddress,
        DAIAddress,
        AmtADesired,
        AmtBDesired,
        AmtAMin,
        AmtBMin,
        impersonatedSigner.address,
        deadline
    );
    console.log('-------------------------- liquidity added -------------');
    
    const usdcBalAfter = await usdcContract.balanceOf(impersonatedSigner.address);
    const daiBalAfter = await daiContract.balanceOf(impersonatedSigner.address);
    
    console.log('impersonneted acct usdc bal AF:', ethers.formatUnits(usdcBalAfter, 6));
    console.log('impersonneted acct dai bal AF:', ethers.formatUnits(daiBalAfter, 18));
    
    // Get LP token address
    const factoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    const factoryContract = await ethers.getContractAt(IUniswapV2Factory.abi, factoryAddress);
    const lpTokenAddress = await (factoryContract as any).getPair(USDCAddress, DAIAddress);
    console.log("LP Token Address:", lpTokenAddress);
    
    // Create LP token contract instance
    const lpToken = await ethers.getContractAt(IUniswapV2Pair.abi, lpTokenAddress);
    
    // Get LP token balance
    const lpBalance = await lpToken.balanceOf(impersonatedSigner.address);
    console.log("LP Token Balance:", ethers.formatUnits(lpBalance, 18));
    
    // Step 6: Approve LP Token for Uniswap Router
    await lpToken.connect(impersonatedSigner).approve(UNIRouter, lpBalance);
    console.log("LP Token Approved for Removal");
    
    // Step 7: Remove Liquidity
    console.log('---------------- Removing Liquidity ----------------');
    await uniswapContract.connect(impersonatedSigner).removeLiquidity(
        USDCAddress,
        DAIAddress,
        lpBalance,
        AmtAMin,
        AmtBMin,
        impersonatedSigner.address,
        deadline
    );
    console.log('Liquidity Removed Successfully!');
    
    // Step 8: Check Final Balances
    const usdcBalFinal = await usdcContract.balanceOf(impersonatedSigner.address);
    const daiBalFinal = await daiContract.balanceOf(impersonatedSigner.address);
    console.log('Final USDC Balance:', ethers.formatUnits(usdcBalFinal, 6));
    console.log('Final DAI Balance:', ethers.formatUnits(daiBalFinal, 18));


   

    
};
   
// const addLiquidityETH = async () => {
//     const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
//     const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
//     const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
//     const theAddressIFoundWithUSDCAndDAI = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";
    
//     // Use correct interface
//     const uniswapContract = await ethers.getContractAt('IUniswap', UNIRouter);
//     const daiContract = await ethers.getContractAt('IERC20', DAIAddress);
    
//     // Use impersonated account
//     const impersonatedSigner = await ethers.getSigner(theAddressIFoundWithUSDCAndDAI);
    
//     // Set ETH amount
//     const ethAmount = ethers.parseEther('0.01'); // Small amount for testing
    
//     // Calculate equivalent token amount (assumes 1 ETH = 3000 DAI)
//     const amountTokenDesired = ethers.parseUnits('3', 18); // 0.01 ETH * 3000 = 30 DAI
    
//     // Set minimum amounts (99% of desired)
//     const amountTokenMin = amountTokenDesired;
//     const amountETHMin = ethAmount
    
//     // Check balances
//     const ethBalance = await ethers.provider.getBalance(impersonatedSigner.address);
//     const tokenBalance = await daiContract.balanceOf(impersonatedSigner.address);
    
//     console.log('ETH Balance:', ethers.formatEther(ethBalance));
//     console.log('DAI Balance:', ethers.formatUnits(tokenBalance, 18));
    
//     // Approve tokens
//     await daiContract.connect(impersonatedSigner).approve(UNIRouter, amountTokenDesired);
    
//     // Add liquidity
//     const deadline = await helpers.time.latest() + 1000;
    
//     console.log('Adding liquidity with:');
//     console.log('- DAI:', ethers.formatUnits(amountTokenDesired, 18));
//     console.log('- ETH:', ethers.formatEther(ethAmount));
    
//     const tx = await uniswapContract.connect(impersonatedSigner).addLiquidityETH(
//       DAIAddress,
//       amountTokenDesired,
//       amountTokenMin,
//       amountETHMin,
//       impersonatedSigner.address,
//       deadline,
//       { value: ethAmount }
//     );
    
//     await tx.wait();
//     console.log('Liquidity added successfully!');
    
//     // Get LP token address
//     const factoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
//     const factoryContract = await ethers.getContractAt(IUniswapV2Factory.abi, factoryAddress);
//     const lpTokenAddress = await (factoryContract as any).getPair(DAIAddress, WETH);
    
//     const lpToken = await ethers.getContractAt(IUniswapV2Pair.abi, lpTokenAddress);
//     const lpBalance = await lpToken.balanceOf(impersonatedSigner.address);
    
//     console.log('LP Token Address:', lpTokenAddress);
//     console.log('LP Token Balance:', ethers.formatUnits(lpBalance, 18));
    
//     return { lpTokenAddress, lpBalance, impersonatedSigner };
//   };
    

  
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


