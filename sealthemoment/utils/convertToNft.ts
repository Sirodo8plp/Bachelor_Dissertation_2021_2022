import Web3 from "web3";
import CONTRACT_ABI from "../ethContractABI";
import { AbiItem } from "web3-utils";
import {
  ROPSTEN_CONTRACT_ADDRESS,
  NFT_STORAGE_KEY,
  ALCHEMY_API_KEY,
} from "../constants";
import { NFTStorage } from "nft.storage";
import { AlchemyWeb3, createAlchemyWeb3 } from "@alch/alchemy-web3";

declare global {
  interface Window {
    ethereum: any;
    web3: Web3;
  }
}

interface postcardReturn {
  ipfsLink?: string | undefined;
  transactionHash?: string | undefined;
  errorMessage?: string | undefined;
}

async function convertToNft(
  imageToUpload: File,
  privateKey: string
): Promise<postcardReturn> {
  try {
    const web3 = await CreateWeb3Object();
    const etherAddress = window.ethereum.selectedAddress;
    const metadata = await GetNFTmetadata(imageToUpload);
    const NFTminter = createNftContract(web3);

    CheckIfTokenExists(NFTminter, metadata, etherAddress);
    const receipt = await mintToken(
      NFTminter,
      metadata,
      etherAddress,
      web3,
      privateKey
    );

    return {
      ipfsLink: metadata.data.image.href,
      transactionHash: receipt!.transactionHash,
    };
  } catch (error: any) {
    return returnError(error);
  }
}

async function GetNFTmetadata(imageToUpload: File) {
  const client = new NFTStorage({ token: NFT_STORAGE_KEY });
  const metadata = await client.store({
    name: "Image uploaded by customer.",
    description: "Get image's ipfs link in order to convert it to NFT.",
    image: imageToUpload,
  });
  return metadata;
}

async function CreateWeb3Object(): Promise<AlchemyWeb3> {
  if (window.ethereum) {
    const enable = window.ethereum.enable();
    return createAlchemyWeb3(ALCHEMY_API_KEY);
  }
  else {
    throw Error("Metamask is not installed.");
  }
}

async function CheckIfTokenExists(
  NFTminter: any,
  metadata: any,
  etherAddress: string
) {
  const check = await NFTminter.methods
    .safeMint(etherAddress, metadata.url)
    .estimateGas((error: any, gasAmount: any) => {
      if (error) 
        return "The image has already been minted.";
      
    });
}

function createNftContract(web3: any) {
  return new web3.eth.Contract(
    CONTRACT_ABI,
    ROPSTEN_CONTRACT_ADDRESS
  );
}

async function mintToken(
  NFTminter: any,
  metadata: any,
  etherAddress: string,
  web3: AlchemyWeb3,
  privateKey: string
) {
  const tx = {
    from: etherAddress,
    to: ROPSTEN_CONTRACT_ADDRESS,
    //nonce: nonce,
    gas: 350000,
    data: NFTminter.methods
      .safeMint(etherAddress, metadata.data.image.href)
      .encodeABI(),
  };
  const signedTx = await web3.eth.accounts.signTransaction(tx, tx.from);
  const transactionReceipt = await web3.eth.sendSignedTransaction(
    signedTx.rawTransaction!
  );

  return transactionReceipt;
}

function returnError(error: any) {
  console.debug(error.message);
  if (error.message.includes("Internal JSON-RPC error."))
    return {
      errorMessage: "Internal JSON-RPC error.",
    };
  else if (error.message.includes("Transaction has been reverted by the EVM"))
    return {
      errorMessage: "Token already Exists.",
    };
  return {
    errorMessage: error.message,
  };
}
export default convertToNft;
