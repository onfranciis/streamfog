import { ReactNode } from "react";

export interface IColors {
  name: string;
  rgb: number[];
}

export interface IColorPaletteProps {
  handleClick: (data: IColors) => void;
}

export interface ICanvasParentProps {
  children: ReactNode;
  color: IColors["rgb"];
  imageSrc: string | null;
}

export type IAvailableWebcam = {
  deviceId: string;
  kind: string;
  label: string;
  groupId: string;
};
