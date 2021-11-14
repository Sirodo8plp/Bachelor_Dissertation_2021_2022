import { ethers } from "ethers";
import { NFTStorage } from "nft.storage";
import {
  CONTRACT_ADDRESS,
  METAMASK_ADDRESS,
  NFT_STORAGE_KEY,
} from "../constants";
import CONTRACT_ABI from "../ethContractABI";

declare global {
  interface Window {
    ethereum: any;
  }
}

const testMe = async (imageToUpload: File, description: string) => {
  try {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    const client = new NFTStorage({ token: NFT_STORAGE_KEY });

    const metadata = await client.store({
      name: "From: User Name",
      description: "User description goes here",
      image: imageToUpload,
    });
    console.log(metadata);

    let tx = await contract.functions["safeMint"](
      METAMASK_ADDRESS,
      metadata.url
    );
    console.log(tx);
  } catch (error) {
    console.error(error);
  }
};

export default testMe;
