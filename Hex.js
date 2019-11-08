import { Biome } from "./Biome.js";
class Hex extends Image {
    constructor(x, y, z, biome, src) {
        super(Hex.IMG_DIM, Hex.IMG_DIM);
        this._x = null;
        this._y = null;
        this._z = null;
        this._biome = null;
        Hex.instances.push(this);
        this._x = x;
        this._y = y;
        this._z = z;
        this._biome = biome;
        this.style.position = Hex.ABSOLUTE;
        this.style.left = `${x}${Hex.PX}`;
        this.style.top = `${y}${Hex.PX}`;
        if (src) {
            this.src = src;
        }
        else {
            if (z < Hex.OCEAN_THRESH) {
                this.src = Hex.BLUE_HEX_IMG;
            }
            else if (z < Hex.HILLS_THRESH) {
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
            else if (z < Hex.MOUNTAIN_THRESH) {
                this.src = Hex.HILLS_HEX_IMG;
            }
            else {
                this.src = Hex.GRAY_HEX_IMG;
            }
        }
        if (Hex.border == null) {
            Hex.border = new Image(100, 100);
            Hex.border.src = Hex.BORDER_HEX_IMG;
            Hex.border.style.position = Hex.ABSOLUTE;
            Hex.border.style.zIndex = Hex.ZIDX;
            Hex.map.style.zIndex = Hex.ZIDX;
            Hex.border.style.pointerEvents = "none";
            Hex.map.appendChild(Hex.border);
        }
        this.addEventListener(Hex.MOUSE_OVER, function () {
            Hex.border.style.left = `${x}${Hex.PX}`;
            Hex.border.style.top = `${y}${Hex.PX}`;
        });
        const that = this;
        this.addEventListener("mousedown", function () {
            that.src = "housing.png";
        });
    }
    getX() {
        return this._x;
    }
    getY() {
        return this._y;
    }
    getZ() {
        return this._z;
    }
    getSource() {
        return this.src;
    }
}
Hex.GREEN_HEX_IMG = "grass.png";
Hex.BLUE_HEX_IMG = "water.png";
Hex.YELLOW_HEX_IMG = "sand.png";
Hex.GRAY_HEX_IMG = "mountain.png";
Hex.FOREST_HEX_IMG = "trees.png";
Hex.HILLS_HEX_IMG = "hills.png";
Hex.BORDER_HEX_IMG = "BorderHex.png";
Hex.ABSOLUTE = "absolute";
Hex.PX = "px";
Hex.IMG_DIM = 96;
Hex.border = null;
Hex.map = document.getElementById("map");
Hex.ZIDX = "1000";
Hex.MOUSE_OVER = "mouseover";
Hex.OCEAN_THRESH = .05;
Hex.HILLS_THRESH = .35;
Hex.MOUNTAIN_THRESH = .45;
Hex.instances = [];
export { Hex };
