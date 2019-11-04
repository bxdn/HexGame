import { Biome } from "./Biome.js";
class Hex extends Image {
    constructor(x, y, z, biome) {
        super(Hex.IMG_DIM, Hex.IMG_DIM);
        this.style.position = Hex.ABSOLUTE;
        this.style.left = `${x}${Hex.PX}`;
        this.style.top = `${y}${Hex.PX}`;
        if (z < Hex.OCEAN_THRESH) {
            this.src = Hex.BLUE_HEX_IMG;
        }
        else if (z < Hex.MOUNTAIN_THRESH) {
            switch (biome) {
                case Biome.Desert:
                    this.src = Hex.YELLOW_HEX_IMG;
                    break;
                case Biome.Plains:
                    this.src = Hex.GREEN_HEX_IMG;
                    break;
                case Biome.Forest:
                    this.src = Hex.FOREST_HEX_IMG;
            }
        }
        else {
            this.src = Hex.GRAY_HEX_IMG;
        }
        if (Hex.border == null) {
            Hex.border = new Image(100, 100);
            Hex.border.src = Hex.BORDER_HEX_IMG;
            Hex.border.style.position = Hex.ABSOLUTE;
            Hex.border.style.zIndex = Hex.ZIDX;
            Hex.map.style.zIndex = Hex.ZIDX;
            Hex.map.appendChild(Hex.border);
        }
        this.addEventListener(Hex.MOUSE_OVER, function () {
            Hex.border.style.left = `${x}${Hex.PX}`;
            Hex.border.style.top = `${y}${Hex.PX}`;
        });
    }
}
Hex.GREEN_HEX_IMG = "GreenHex.png";
Hex.BLUE_HEX_IMG = "BlueHex.png";
Hex.YELLOW_HEX_IMG = "YellowHex.png";
Hex.GRAY_HEX_IMG = "GrayHex.png";
Hex.FOREST_HEX_IMG = "ForestHex.png";
Hex.BORDER_HEX_IMG = "BorderHex.png";
Hex.ABSOLUTE = "absolute";
Hex.PX = "px";
Hex.IMG_DIM = 100;
Hex.border = null;
Hex.map = document.getElementById("map");
Hex.ZIDX = "1000";
Hex.MOUSE_OVER = "mouseover";
Hex.OCEAN_THRESH = .05;
Hex.MOUNTAIN_THRESH = .35;
export { Hex };
