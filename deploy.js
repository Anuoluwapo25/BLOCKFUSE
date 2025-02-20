const ethers = require("ethers");
const fs = require("fs");


async function main() {
    // console.log();
    // const num = 15
    // console.log(num)
    const provider = new ethers.providers.JsonRpcProvider("http://0.0.0.0:8545");
    const wallet = new ethers.Wallet(
        "356909", provider
    );
    const abi = fs.readFileSync("./simpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./simpleStorage_sol_SimpleStorage.bin"
    );
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("deploying please wait")
    const contract = await contractFactory.deploy();

}

main()
.then(() => process.exit(0))
.catch((error) => {
    process.exit(1);
});