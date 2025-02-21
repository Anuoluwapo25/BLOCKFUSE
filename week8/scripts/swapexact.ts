import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");


const swapExactTokens = async() => {
    const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const theAddressIFoundWithUSDCAndDAI = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";
    
    let AmtADesired = ethers.parseUnits('100000', 6);
    let AmtBDesired = ethers.parseUnits('100000', 18);
    let AmtAMin = ethers.parseUnits('9900', 6);
    let AmtBMin = ethers.parseUnits('9900', 18);
    let deadline = await helpers.time.latest() + 5000;
    let amountIn = ethers.parseUnits('5000', 6);
    let amountOutMin = ethers.parseUnits('500', 18);

    const address = [
        USDCAddress,
        DAIAddress
    ]

    
    await helpers.impersonateAccount(theAddressIFoundWithUSDCAndDAI);
    const impersonatedSigner = await ethers.getSigner(theAddressIFoundWithUSDCAndDAI);
    
    let usdcContract = await ethers.getContractAt('IERC20', USDCAddress);
    let daiContract = await ethers.getContractAt('IERC20', DAIAddress);
    let uniswapContract = await ethers.getContractAt('IUniswap', UNIRouter);
    
    const usdcBal = await usdcContract.balanceOf(impersonatedSigner.address);
    const daiBal = await daiContract.balanceOf(impersonatedSigner.address);
    
    console.log('impersonated acct usdc bal BA:', ethers.formatUnits(usdcBal, 6));
    console.log('impersonated acct dai bal BA:', ethers.formatUnits(daiBal, 18));
    
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
    
    console.log('impersonated acct usdc bal AF:', ethers.formatUnits(usdcBalAfter, 6));
    console.log('impersonated acct dai bal AF:', ethers.formatUnits(daiBalAfter, 18));


    console.log("-------------------------- Before Swap-------")
    await usdcContract.connect(impersonatedSigner).approve(UNIRouter, amountIn)
    const BalanceofUSDC = await usdcContract.balanceOf(impersonatedSigner)
    const BalDAI = await daiContract.balanceOf(impersonatedSigner)
    console.log("-------------------------- Amountin approved-------")
    console.log("Amount Before Swap:", ethers.formatUnits(BalanceofUSDC, 6))
    console.log("-------------------------- Amount of After Swap:-------", ethers.formatUnits(BalDAI, 6))

    await uniswapContract.connect(impersonatedSigner).swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        address,
        impersonatedSigner.address,
        deadline
    );

    console.log("-------------------------- Swaped sucessfully -------")
    console.log("-------------------------- Amount After Swap -------:", ethers.formatUnits(BalanceofUSDC, 6))
    console.log("-------------------------- Amount of After Swap: -------",  ethers.formatUnits(BalDAI, 6))
}

swapExactTokens().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});



