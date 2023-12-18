import { IColorPaletteProps } from "../types";
import { colors } from "../utils/color";

const ColorPalette = ({ handleClick }: IColorPaletteProps) => {
  return (
    <div className="colors">
      {colors.map((color) => {
        return (
          <button
            key={color.name}
            className="color"
            onClick={() => handleClick(color)}
            style={{
              backgroundColor: `rgba(${color.rgb[0]},${color.rgb[1]},${color.rgb[2]}, 0.7)`,
            }}
          >
            {color.name}
          </button>
        );
      })}
    </div>
  );
};

export default ColorPalette;
