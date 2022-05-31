import Web3 from "web3";
import CONTRACT_ABI from "../ethContractABI";
import {
  ROPSTEN_CONTRACT_ADDRESS,
  NFT_STORAGE_KEY,
  ALCHEMY_API_KEY,
} from "../constants";
import { NFTStorage } from "nft.storage";
import Notification from "../classes/notification";
import { TsetNotifications } from "../components/NotificationContext";

declare global {
  interface Window {
    ethereum: any;
    web3: Web3;
  }
}

interface postcardReturn {
  ipfsLink?: string | undefined;
  transactionHash?: string | undefined;
}

async function convertToNft(
  imageToUpload: File,
  notifications: Notification[] | null | undefined,
  setNotifications: TsetNotifications
): Promise<postcardReturn | null> {
  try {
    const web3 = await CreateWeb3Object();
    const etherAddress = window.ethereum.selectedAddress;
    const metadata = await GetNFTmetadata(imageToUpload);
    const NFTminter = createNftContract(web3);

    const estimatedGas = await CheckIfTokenExists(
      NFTminter,
      metadata,
      etherAddress
    );
    if (typeof estimatedGas === "string") return null;
    const receipt = await mintToken(
      NFTminter,
      metadata,
      etherAddress,
      web3,
      estimatedGas
    );

    return {
      ipfsLink: metadata.data.image.href,
      transactionHash: receipt!.transactionHash,
    };
  } catch (error: any) {
    returnError(error, setNotifications, notifications);
    return null;
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

async function CreateWeb3Object(): Promise<Web3> {
  if (window.ethereum) {
    const enable = await window.ethereum.enable();
    return new Web3(window.ethereum);
  } else {
    throw Error(`The Ethereum Javascript Provider API was not found. You should 
    try to install a wallet like Metamask and then try again!`);
  }
}

async function CheckIfTokenExists(
  NFTminter: any,
  metadata: any,
  etherAddress: string
) {
  const check: string | number = await NFTminter.methods
    .safeMint(etherAddress, metadata.data.image.href)
    .estimateGas((error: any, gasAmount: number) => {
      if (error) return "The image has already been minted.";
      else return gasAmount;
    });
  return check;
}

function createNftContract(web3: any) {
  return new web3.eth.Contract(CONTRACT_ABI, ROPSTEN_CONTRACT_ADDRESS);
}

async function mintToken(
  NFTminter: any,
  metadata: any,
  etherAddress: string,
  web3: Web3,
  estimatedGas: number
) {
  const transactionReceipt = await NFTminter.methods
    .safeMint(etherAddress, metadata.data.image.href)
    .send({
      from: etherAddress,
      gas: estimatedGas,
    });
  return transactionReceipt;
}

function returnError(
  error: any,
  setNotifications: TsetNotifications,
  notifications: Notification[] | null | undefined
) {
  if (error.message.includes("Internal JSON-RPC error.")) {
    setNotifications!(notifications!.concat(new Notification("notEnoughGas")));
    return;
  }
  if (error.message.includes("Transaction has been reverted by the EVM")) {
    setNotifications!(
      notifications!.concat(new Notification("imageAlreadyUploaded"))
    );
    return;
  }
  if (error.message.includes("Metamask is not installed.")) {
    setNotifications!(
      notifications!.concat(new Notification("metamaskNotInstalled"))
    );
    return;
  }
  return null;
}
export default convertToNft;
