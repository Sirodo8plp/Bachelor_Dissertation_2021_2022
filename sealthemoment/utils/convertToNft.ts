import Web3 from "web3";
import CONTRACT_ABI from "../ethContractABI";
import { AbiItem } from "web3-utils";
import {
  ROPSTEN_CONTRACT_ADDRESS,
  METAMASK_ADDRESS,
  NFT_STORAGE_KEY,
} from "../constants";
import { NFTStorage } from "nft.storage";
import { Contract } from "web3-eth-Contract";
import { useGetEtherAddressQuery } from "../generated/graphql";
import { useEffect } from "react";

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

async function convertToNft(
  imageToUpload: File,
  etherAddress: string
): Promise<postcardReturn> {
  try {
    const web3 = new Web3(window.ethereum);
    console.log(web3);
    const metadata = await GetNFTmetadata(imageToUpload);
    const NFTminter = createNftContract(web3, etherAddress);
    CheckIfTokenExists(NFTminter, metadata);
    const receipt = await mintToken(NFTminter, metadata, etherAddress);

    return {
      ipfsLink: metadata.data.image.href,
      tokenID: receipt.events.Transfer.returnValues.tokenId,
    };
  } catch (error: any) {
    return returnError(error);
  }
}

async function GetNFTmetadata(imageToUpload: File) {
  const client = new NFTStorage({ token: NFT_STORAGE_KEY });
  const metadata = await client.store({
    name: "From: User",
    description: "User description goes here",
    image: imageToUpload,
  });
  return metadata;
}

async function CheckIfTokenExists(NFTminter: Contract, metadata: any) {
  const check = await NFTminter.methods
    .safeMint(METAMASK_ADDRESS, metadata.url)
    .estimateGas((error: any, gasAmount: any) => {
      if (error) return "An error has occured";
    });
}

function createNftContract(web3: any, etherAddress: string) {
  const NFTminter = new web3.eth.Contract(
    CONTRACT_ABI as AbiItem[],
    ROPSTEN_CONTRACT_ADDRESS,
    { from: etherAddress }
  );
  return NFTminter;
}

async function mintToken(
  NFTminter: Contract,
  metadata: any,
  etherAddress: string
) {
  const receipt = await NFTminter.methods
    .safeMint(METAMASK_ADDRESS, metadata.url)
    .send({ from: etherAddress });
  return receipt;
}

function returnError(error: any) {
  if (error.message.includes("Internal JSON-RPC error."))
    return {
      errorMessage: "Internal JSON-RPC error.",
    };
  return {
    errorMessage: error.message,
  };
}
export default convertToNft;
