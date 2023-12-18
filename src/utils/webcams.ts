import { IAvailableWebcam } from "../types";

export const webcams = (data: IAvailableWebcam[]) => {
  const validSource = data.filter(
    (source) => source.deviceId.trim() !== "" || source.label.trim() !== ""
  );

  return validSource;
};
