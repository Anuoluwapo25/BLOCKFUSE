import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const IUniswapV2Factory = require('@uniswap/v2-core/build/IUniswapV2Factory.json');
// const IUniswapV2Router02 = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json');
const IUniswapV2Pair = require('@uniswap/v2-core/build/IUniswapV2Pair.json');

const addLiquidityETH = async () => {
   
    const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const theAddressWithTokenAndETH = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621"; 
    const factoryAddress ="0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  
    const amountTokenDesired = ethers.parseUnits('1000', 18); 
    const amountTokenMin = ethers.parseUnits('990', 18);
    const amountETHMin = ethers.parseEther('0.005'); 
    const ethAmount = ethers.parseEther('1'); 
    const deadline = await helpers.time.latest() + 1000;
    let AmtAMin = ethers.parseUnits('990', 6);
    
    await helpers.impersonateAccount(theAddressWithTokenAndETH);
    const impersonatedSigner = await ethers.getSigner(theAddressWithTokenAndETH);
    
    const tokenContract = await ethers.getContractAt('IERC20', DAIAddress);
    const uniswapContract = await ethers.getContractAt(
        'IUniswap', 
      UNIRouter
    );
    
    const tokenBalBefore = await tokenContract.balanceOf(impersonatedSigner.address);
    const ethBalBefore = await ethers.provider.getBalance(impersonatedSigner.address);
    
    console.log('Token balance before:', ethers.formatUnits(tokenBalBefore, 18));
    console.log('ETH balance before:', ethers.formatEther(ethBalBefore));
    
    await tokenContract.connect(impersonatedSigner).approve(UNIRouter, amountTokenDesired);
    console.log('Token approved for router');
    
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
    
    const receipt = await tx.wait();
    console.log('-------------------------- ETH liquidity added -------------');
    
    const tokenBalAfter = await tokenContract.balanceOf(impersonatedSigner.address);
    const ethBalAfter = await ethers.provider.getBalance(impersonatedSigner.address);
    
    console.log('Token balance after:', ethers.formatUnits(tokenBalAfter, 18));
    console.log('ETH balance after:', ethers.formatEther(ethBalAfter));

    const uniswapcontract = await ethers.getContractAt("IUniswap", UNIRouter)
    const daicontact = await ethers.getContractAt("IERC20", DAIAddress)
    await helpers.impersonateAccount(theAddressWithTokenAndETH);
    const impersonateAccount = await ethers.getSigner(theAddressWithTokenAndETH);

    const getfactoryContract = await ethers.getContractAt(IUniswapV2Factory.abi, factoryAddress)
    const LPAddress = await (getfactoryContract as any).getPair(DAIAddress, WETH)
    const lpTokenContract = await ethers.getContractAt(IUniswapV2Pair.abi, LPAddress);

    const lpBalance = await lpTokenContract.balanceOf(impersonateAccount.address);

    await lpTokenContract.connect(impersonateAccount).approve(UNIRouter, lpBalance);
    console.log("LP Token Approved for Removal");

    console.log("---------------Liquidity Removed Successfully!--------------");
    console.log('Lp balance', ethers.formatUnits(lpBalance))
 
    await uniswapcontract.connect(impersonateAccount).removeLiquidityETH(
      DAIAddress ,
      lpBalance,
      AmtAMin,
      amountETHMin,
      impersonateAccount.address,
      deadline,
      )
    


    
  };
  
  




addLiquidityETH().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

//   main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });