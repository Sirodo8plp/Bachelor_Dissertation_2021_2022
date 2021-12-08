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

interface postcardReturn {
  ipfsLink?: string | undefined;
  tokenID?: number | undefined;
  errorMessage?: string | undefined;
}

const testMe = async (
  imageToUpload: File,
  description: string
): Promise<postcardReturn> => {
  try {
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
    const check = await NFTminter.methods
      .safeMint(METAMASK_ADDRESS, metadata.url)
      .estimateGas((error: any, gasAmount: any) => {
        if (error) return "asdfsdafasfa";
      });
    const receipt = await NFTminter.methods
      .safeMint(METAMASK_ADDRESS, metadata.url)
      .send({ from: METAMASK_ADDRESS });
    return {
      ipfsLink: metadata.data.image.href,
      tokenID: receipt.events.Transfer.returnValues.tokenId,
    };
  } catch (error) {
    return {
      errorMessage: "Image has already been uploaded.",
    };
  }
};

export default testMe;
