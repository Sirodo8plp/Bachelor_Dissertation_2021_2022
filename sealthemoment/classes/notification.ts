import Tnotification from "../types/Tnotification";

class Notification {
  static counter = -1;
  id!: number;
  message!: string;
  CSSclass!: string;

  constructor(id: Tnotification) {
    Notification.counter += 1;
    switch (id) {
      case "previewReady":
        this.id = Notification.counter;
        this.message =
          "Images are ready for preview. Press confirm in order to continue.";
        this.CSSclass = "notification notification--positive";
        break;
      case "uploadSuccessful":
        this.id = Notification.counter;
        this.message = `Your content was successfully uploaded! You can proceed on creating a
        new postcard from the "Photographs" tab!`;
        this.CSSclass = "notification notification--positive";
        break;
      case "uploadFailed":
        this.id = Notification.counter;
        this.message =
          "An unexpected error occurred during the upload process. Please, try again later!";
        this.CSSclass = "notification notification--negative";
        break;
      case "500error":
        this.id = Notification.counter;
        this.message =
          "An internal server error has occurred. Please, try again later!";
        this.CSSclass = "notification notification--negative";
        break;
      case "noCamera":
        this.id = Notification.counter;
        this.message = `Your camera could not be found or you did not grant us permission to use it
        . However, you can
          still upload or drag and drop your photographs from your file system.`;
        this.CSSclass = "notification notification--warning";
        break;
      case "uploading":
        this.id = Notification.counter;
        this.message = `Your content is being uploaded. In order to save your photograph as a NFT, you must complete
        the transaction in the Metamask pop-up window!`;
        this.CSSclass = "notification notification--positive";
        break;
      case "imageAlreadyUploaded":
        this.id = Notification.counter;
        this.message = `One of your selected images may have already been uploaded! The transaction was cancelled.`;
        this.CSSclass = "notification notification--negative";
        break;
      case "deniedTransaction":
        this.id = Notification.counter;
        this.message =
          "You rejected the metamask pop-up transaction in one of your images.";
        this.CSSclass = "notification notification--warning";
        break;
      case "notImage":
        this.id = Notification.counter;
        this.message =
          "It seems that one of the selected files is not an image. Please, select again all your files";
        this.CSSclass = "notification notification--negative";
        break;
      case "transactionInProgress":
        this.id = Notification.counter;
        this.message = `A transasction with this image is already in progress. Please, be patient 
        and wait for the process to be completed.`;
        this.CSSclass = "notification notification--negative";
        break;
      case "notEnoughGas":
        this.id = Notification.counter;
        this.message =
          "Your account does not have enough to Ether in order to complete this transaction.";
        this.CSSclass = "notification notification--negative";
      case "metamaskNotInstalled":
        this.id = Notification.counter;
        this.message =
          "Metamask or any other Ethereum-API-type digital wallet is not installed. Your image has not been uploaded.";
        this.CSSclass = "notification notification--negative";
    }
  }
}

export default Notification;
