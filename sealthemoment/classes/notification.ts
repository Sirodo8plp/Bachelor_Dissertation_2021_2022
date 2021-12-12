import Tnotification from "../types/Tnotification";

class Notification {
  static counter = -1;
  id!: number;
  message!: string;
  CSSclass!: string;
  visible!: boolean;

  constructor(id: Tnotification) {
    Notification.counter += 1;
    switch (id) {
      case "previewReady":
        this.id = Notification.counter;
        this.message =
          "Images are ready for preview. Press confirm in order to continue.";
        this.CSSclass = "notification notification--positive";
        this.visible = true;
        break;
      case "uploadSuccessful":
        this.id = Notification.counter;
        this.message = `Your content was successfully uploaded! You can proceed on creating a
        new postcard from the "Photographs" tab!`;
        this.CSSclass = "notification notification--positive";
        this.visible = true;
        break;
      case "uploadFailed":
        this.id = Notification.counter;
        this.message =
          "An unexpected error occurred during the upload process. Please, try again later!";
        this.CSSclass = "notification notification--negative";
        this.visible = true;
        break;
      case "500error":
        this.id = Notification.counter;
        this.message =
          "An internal server error has occurred. Please, try again later!";
        this.CSSclass = "notification notification--negative";
        this.visible = true;
        break;
      case "noCamera":
        this.id = Notification.counter;
        this.message = `Your camera could not be found. However, you can
          still upload or drag and drop your photographs from your file system.`;
        this.CSSclass = "notification notification--warning";
        this.visible = true;
        break;
      case "uploading":
        this.id = Notification.counter;
        this.message = `Your content is being uploaded. In order to save your photograph as a NFT, you must complete
        the transaction in the Metamask pop-up window!`;
        this.CSSclass = "notification notification--positive";
        this.visible = true;
        break;
      case "imageAlreadyUploaded":
        this.id = Notification.counter;
        this.message = `One of your selected images has already been uploaded! The transaction was cancelled.`;
        this.CSSclass = "notification notification--negative";
        this.visible = true;
    }
  }
}

export default Notification;
