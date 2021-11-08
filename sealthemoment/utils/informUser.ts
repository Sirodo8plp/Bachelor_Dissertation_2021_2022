interface notification {
  message: string;
  CSSclass: string;
  visible: boolean;
}

type notificationType =
  | "previewReady"
  | "uploadSuccessful"
  | "uploadFailed"
  | "500error"
  | "noCamera"
  | "hide";
export function inform(
  state: notification,
  action: notificationType
): notification {
  switch (action) {
    case "previewReady":
      return {
        ...state,
        message:
          "Images are ready for preview. Press confirm in order to continue.",
        CSSclass: "notification notification--positive",
        visible: true,
      };
    case "uploadSuccessful":
      return {
        ...state,
        message: "Your content was successfully uploaded!",
        CSSclass: "notification notification--positive",
        visible: true,
      };
    case "uploadFailed":
      return {
        ...state,
        message:
          "An unexpected error occurred during the upload process. Please, try again later!",
        CSSclass: "notification notification--negative",
        visible: true,
      };
    case "500error":
      return {
        ...state,
        message:
          "An internal server error has occurred. Please, try again later!",
        CSSclass: "notification notification--negative",
        visible: true,
      };
    case "noCamera":
      return {
        ...state,
        message: `Your camera could not be found. However, you can
          still upload or drag and drop your photographs from your filesystem.`,
        CSSclass: "notification notification--warning",
        visible: true,
      };
    case "hide":
      return {
        ...state,
        visible: false,
      };
    default:
      neverReach(action);
  }
}

function neverReach(never: never): never {
  while (true) console.log("hello world");
}
