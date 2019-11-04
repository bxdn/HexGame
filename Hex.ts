import { Biome } from "./Biome.js"
class Hex extends Image {
    private static readonly GREEN_HEX_IMG = "GreenHex.png"
    private static readonly BLUE_HEX_IMG = "BlueHex.png"
    private static readonly YELLOW_HEX_IMG = "YellowHex.png"
    private static readonly GRAY_HEX_IMG = "GrayHex.png"
    private static readonly FOREST_HEX_IMG = "ForestHex.png"
    private static readonly BORDER_HEX_IMG = "BorderHex.png"

    private static readonly ABSOLUTE = "absolute"
    private static readonly PX = "px"
    private static readonly IMG_DIM = 100
    private static border: HTMLImageElement = null

    private static readonly map = document.getElementById("map")
    private static readonly ZIDX = "1000"
    private static readonly MOUSE_OVER = "mouseover"

    private static readonly OCEAN_THRESH = .05
    private static readonly MOUNTAIN_THRESH = .35

    constructor(x: number, y: number, z: number, biome: Biome) {
        super(Hex.IMG_DIM, Hex.IMG_DIM)
        this.style.position = Hex.ABSOLUTE
        this.style.left = `${x}${Hex.PX}`
        this.style.top = `${y}${Hex.PX}`
        if (z < Hex.OCEAN_THRESH) {
            this.src = Hex.BLUE_HEX_IMG
        }
        else if (z < Hex.MOUNTAIN_THRESH) {
            switch (biome) {
                case Biome.Desert:
                    this.src = Hex.YELLOW_HEX_IMG
                    break
                case Biome.Plains:
                    this.src = Hex.GREEN_HEX_IMG
                    break
                case Biome.Forest:
                    this.src = Hex.FOREST_HEX_IMG
            }
        }
        else {
            this.src = Hex.GRAY_HEX_IMG
        }
        if (Hex.border == null) {
            Hex.border = new Image(100, 100)
            Hex.border.src = Hex.BORDER_HEX_IMG
            Hex.border.style.position = Hex.ABSOLUTE
            Hex.border.style.zIndex = Hex.ZIDX
            Hex.map.style.zIndex = Hex.ZIDX
            Hex.map.appendChild(Hex.border)
        }

        this.addEventListener(Hex.MOUSE_OVER, function () {
            Hex.border.style.left = `${x}${Hex.PX}`
            Hex.border.style.top = `${y}${Hex.PX}`
        })
    }
}
export { Hex }