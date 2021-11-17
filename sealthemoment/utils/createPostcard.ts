import Web3 from "web3";
import CONTRACT_ABI from "../ethContractABI";
import { AbiItem } from "web3-utils";
import {
  CONTRACT_ADDRESS,
  METAMASK_ADDRESS,
  NFT_STORAGE_KEY,
} from "../constants";
import { NFTStorage } from "nft.storage";

declare global {
  interface Window {
    ethereum: any;
    web3: Web3;
  }
}

const ethEnabled = async () => {
  if (window.ethereum) {
    await window.ethereum.send("eth_requestAccounts");
    return true;
  }
  return false;
};

const testMe = async (imageToUpload: File, description: string) => {
  try {
    //USING ETHERS.IO
    // await window.ethereum.enable();
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    // const contract = new ethers.Contract(
    //   CONTRACT_ADDRESS,
    //   CONTRACT_ABI,
    //   signer
    // );
    // const client = new NFTStorage({ token: NFT_STORAGE_KEY });
    // const metadata = await client.store({
    //   name: "From: User Name",
    //   description: "User description goes here",
    //   image: imageToUpload,
    // });
    // console.log(metadata);
    // let tx = await contract.functions["safeMint"](
    //   METAMASK_ADDRESS,
    //   metadata.url
    // );
    // console.log(tx);
    //USING WEB3
    const client = new NFTStorage({ token: NFT_STORAGE_KEY });
    const metadata = await client.store({
      name: "From: User Name",
      description: "User description goes here",
      image: imageToUpload,
    });
    const web3 = new Web3(window.ethereum);
    const NFTminter = new web3.eth.Contract(
      CONTRACT_ABI as AbiItem[],
      CONTRACT_ADDRESS,
      { from: METAMASK_ADDRESS }
    );
    NFTminter.methods
      .safeMint(METAMASK_ADDRESS, metadata.url)
      .send({ from: METAMASK_ADDRESS })
      .on("receipt", (receipt: any) => console.log(receipt));
  } catch (error) {
    console.error(error);
  }
};

export default testMe;
