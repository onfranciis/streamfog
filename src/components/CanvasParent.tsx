import { ICanvasParentProps } from "../types";

const CanvasParent = ({ children, color, imageSrc }: ICanvasParentProps) => {
  return (
    <div
      className="CanvasParent"
      style={{
        backgroundColor: !imageSrc
          ? `rgba(${color[0]},${color[1]},${color[2]}, ${
              ((color[3] ?? 1 / 1) * 100) / 1
            })`
          : "",
        backgroundImage: `url(${imageSrc ?? ""})`,
      }}
    >
      {children}
    </div>
  );
};

export default CanvasParent;
