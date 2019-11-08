import { Biome } from "./Biome.js"
class Hex extends Image {
    private static readonly GREEN_HEX_IMG = "grass.png"
    private static readonly BLUE_HEX_IMG = "water.png"
    private static readonly YELLOW_HEX_IMG = "sand.png"
    private static readonly GRAY_HEX_IMG = "mountain.png"
    private static readonly FOREST_HEX_IMG = "trees.png"
    private static readonly HILLS_HEX_IMG = "hills.png"
    private static readonly BORDER_HEX_IMG = "BorderHex.png"

    private static readonly ABSOLUTE = "absolute"
    private static readonly PX = "px"
    private static readonly IMG_DIM = 96
    private static border: HTMLImageElement = null

    private static readonly map = document.getElementById("map")
    private static readonly ZIDX = "1000"
    private static readonly MOUSE_OVER = "mouseover"

    private static readonly OCEAN_THRESH = .05
    private static readonly HILLS_THRESH = .35
    private static readonly MOUNTAIN_THRESH = .45

    public static instances: Hex[] = []
    private _x: number = null
    private _y: number = null
    private _z: number = null
    private _biome: Biome = null

    constructor(x: number, y: number, z: number, biome: Biome, src?: string) {
        super(Hex.IMG_DIM, Hex.IMG_DIM)
        Hex.instances.push(this)
        this._x = x
        this._y = y
        this._z = z
        this._biome = biome
        this.style.position = Hex.ABSOLUTE
        this.style.left = `${x}${Hex.PX}`
        this.style.top = `${y}${Hex.PX}`
        if (src) {
            this.src = src
        }
        else {
            if (z < Hex.OCEAN_THRESH) {
                this.src = Hex.BLUE_HEX_IMG
            }
            else if (z < Hex.HILLS_THRESH) {
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
            else if (z < Hex.MOUNTAIN_THRESH) {
                this.src = Hex.HILLS_HEX_IMG
            }
            else {
                this.src = Hex.GRAY_HEX_IMG
            }
        }
        if (Hex.border == null) {
            Hex.border = new Image(100, 100)
            Hex.border.src = Hex.BORDER_HEX_IMG
            Hex.border.style.position = Hex.ABSOLUTE
            Hex.border.style.zIndex = Hex.ZIDX
            Hex.map.style.zIndex = Hex.ZIDX
            Hex.border.style.pointerEvents = "none"
            Hex.map.appendChild(Hex.border)
        }

        this.addEventListener(Hex.MOUSE_OVER, function () {
            Hex.border.style.left = `${x}${Hex.PX}`
            Hex.border.style.top = `${y}${Hex.PX}`
        })
        const that = this
        this.addEventListener("mousedown", function () {
            that.src = "housing.png"
        })
    }
    public getX(): number {
        return this._x
    }
    public getY(): number {
        return this._y
    }
    public getZ(): number {
        return this._z
    }
    public getSource(): String {
        return this.src
    }
}
export { Hex }