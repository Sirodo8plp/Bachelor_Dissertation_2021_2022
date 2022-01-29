import Web3 from "web3";
import CONTRACT_ABI from "../ethContractABI";
import { AbiItem } from "web3-utils";
import {
  ROPSTEN_CONTRACT_ADDRESS,
  NFT_STORAGE_KEY,
  ALCHEMY_API_KEY,
} from "../constants";
import { NFTStorage } from "nft.storage";
import { Contract } from "web3-eth-Contract";
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
    await CreateWeb3Object();
    const web3 = createAlchemyWeb3(ALCHEMY_API_KEY);
    const etherAddress = window.ethereum.selectedAddress;
    const metadata = await GetNFTmetadata(imageToUpload);
    const NFTminter = createNftContract(web3, etherAddress);

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
    name: "From: User",
    description: "IMage to be converted to nft",
    image: imageToUpload,
  });
  return metadata;
}

async function CreateWeb3Object() {
  if (window.ethereum) {
    try {
      const enable = window.ethereum.enable();
      return;
    } catch (error) {
      console.log(error);
    }
  }
}

async function CheckIfTokenExists(
  NFTminter: Contract,
  metadata: any,
  etherAddress: string
) {
  const check = await NFTminter.methods
    .safeMint(etherAddress, metadata.url)
    .estimateGas((error: any, gasAmount: any) => {
      if (error) {
        console.error(error);
        return "An error has occured";
      }
    });
}

function createNftContract(web3: any, etherAddress: string) {
  const NFTminter = new web3.eth.Contract(
    CONTRACT_ABI,
    ROPSTEN_CONTRACT_ADDRESS
  );
  return NFTminter;
}

async function mintToken(
  NFTminter: Contract,
  metadata: any,
  etherAddress: string,
  web3: AlchemyWeb3,
  privateKey: string
) {
  const tx = {
    from: etherAddress,
    to: ROPSTEN_CONTRACT_ADDRESS,
    //nonce: nonce,
    gas: 2000000,
    maxPriorityFeePerGas: 1999999987,
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
