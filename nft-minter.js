//用来挖一个区块链给用户
//不知道怎么使用只能够看文档
import {ethers, JsonRpcProvider} from "ethers";
import fs from 'fs'

//url是这个NFT的唯一标识符
export async function mint(to, url) {
    //连接到本地测试网络
    const provider = new JsonRpcProvider("http:/localhost:8545");
    const signer = await provider.getSigner();
    //erc721地址
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const abi = JSON.parse(fs.readFileSync("./abis/MyNFT.json"));
    const contract = new ethers.Contract(contractAddress, abi, signer);;
    const result = await contract.safeMint(to, url);
    console.log(result.hash);
}
