import { Hex } from "./Hex.js"
import { SimplexNoise } from "./SimplexNoise.js"
import { Biome } from "./Biome.js"
class Initializer {
    private static readonly WHEEL = "wheel"
    private static readonly KEYDOWN = "keydown"
    private static readonly KEYUP = "keyup"
    private static readonly CENTER = "center"
    private static readonly PX = "px"
    private static readonly ZERO = "0px"
    private static readonly KEYS = "KeyS"
    private static readonly KEYA = "KeyA"
    private static readonly KEYW = "KeyW"
    private static readonly KEYD = "KeyD"
    private static readonly P = "p"
    private static readonly SCALE = "scale("
    private static readonly CLOSE_PAREN = ")"

    private static readonly SCROLL_CONTAINER = document.getElementById("scrollContainer")
    private static readonly MAP_CONTAINER = document.getElementById("mapContainer")
    private static readonly MAP = document.getElementById("map")
    private static readonly topLeftMenu = document.getElementById("topLeftMenu")
    private static readonly saveBtn = document.getElementById("saveButton")
    private static readonly clearBtn = document.getElementById("clearButton")

    private static readonly MAP_INITIAL_X = -2000
    private static readonly MAP_INITIAL_Y = -1900
    private static readonly HEX_COUNT_X = 33
    private static readonly HEX_COUNT_Y = 99
    private static readonly HEX_WIDTH = 96
    private static readonly HEX_HEIGHT = 84
    private static readonly PERSISTANCE = .5
    private static readonly NOISE_SCALE = .05
    private static readonly NUM_OCTAVES = 16
    private static readonly SCALE_FACTOR = 1.2
    private static readonly BIOMES = 100

    private static readonly MOVE_RIGHT: number[] = []
    private static readonly MOVE_UP: number[] = []
    private static readonly MOVE_LEFT: number[] = []
    private static readonly MOVE_DOWN: number[] = []
    private static moveSpeed = 100
    private static mouseX: number = null
    private static mouseY: number = null

    static initialize(): Hex[] {
        Initializer.assignListeners()
        var hexMap = null
        if (localStorage.getItem("map")) {
            const map = JSON.parse(localStorage.getItem("map"))
            hexMap = []
            for (let hexData of map) {
                const hex = new Hex(hexData[0], hexData[1], hexData[2], null, hexData[3])
                hexMap.push(hex)
            }
        }
        else {
            hexMap = Initializer.buildHexMap(Initializer.createNoiseMap(), Initializer.createBiomeMap())
        }
        Initializer.initializeMapPosition()
        return hexMap
    }

    private static assignListeners() {
        Initializer.MAP_CONTAINER.addEventListener(Initializer.WHEEL, Initializer.scroll)
        Initializer.MAP_CONTAINER.addEventListener("mousedown", Initializer.toggleDrag)
        Initializer.MAP_CONTAINER.addEventListener("contextmenu",Initializer.preventContextMenu)
        window.addEventListener(Initializer.KEYDOWN, Initializer.keyDown)
        window.addEventListener(Initializer.KEYUP, Initializer.keyUp)
        Initializer.saveBtn.addEventListener("mousedown", Initializer.save)
        Initializer.clearBtn.addEventListener("mousedown", Initializer.clear)
    }

    private static preventContextMenu(event: MouseEvent){
        event.preventDefault()
    }

    private static toggleDrag(event: MouseEvent) {
        if(event.button != 2){
            return
        }
        Initializer.mouseX = event.clientX
        Initializer.mouseY = event.clientY
        Initializer.MAP_CONTAINER.addEventListener("mouseup", Initializer.stopDrag)
        Initializer.MAP_CONTAINER.addEventListener("mousemove", Initializer.drag)
    }

    private static drag(event: MouseEvent){
        const scaleStr = Initializer.SCROLL_CONTAINER.style.transform ? Initializer.SCROLL_CONTAINER.style.transform : `${Initializer.SCALE}1${Initializer.CLOSE_PAREN}`
        const scale = Number(scaleStr.slice(6, scaleStr.indexOf(Initializer.CLOSE_PAREN)))
        const deltaX = (Initializer.mouseX - event.clientX) / scale
        const deltaY = (Initializer.mouseY - event.clientY) / scale
        Initializer.mouseX = event.clientX
        Initializer.mouseY = event.clientY
        Initializer.MAP.style.left = (Initializer.MAP.offsetLeft - deltaX) + Initializer.PX
        Initializer.MAP.style.top = (Initializer.MAP.offsetTop - deltaY) + Initializer.PX
    }

    private static stopDrag() {
        Initializer.MAP_CONTAINER.removeEventListener("mousemove", Initializer.drag)
    }

    private static clear() {
        localStorage.removeItem("map")
    }

    private static save() {
        let map = []
        for (let hex of Hex.instances) {
            map.push([hex.getX(), hex.getY(), hex.getZ(), hex.getSource()])
        }
        localStorage.setItem("map", JSON.stringify(map))
    }

    private static createNoiseMap(): number[][] {
        const noise = new SimplexNoise()
        const map = []
        for (let i = 0; i < Initializer.HEX_COUNT_X; i++) {
            const row = []
            for (let j = 0; j < Initializer.HEX_COUNT_Y; j++) {
                row.push(Initializer.sumOcatave(noise, Initializer.NUM_OCTAVES, i, j / 3, Initializer.PERSISTANCE, Initializer.NOISE_SCALE))
            }
            map.push(row)
        }
        return map
    }

    private static createBiomeMap(): number[][] {
        const map = []
        for (let i = 0; i < Initializer.BIOMES; i++) {
            const biome = Math.floor(Math.random() * Biome._Length)
            map.push([Math.random() * Initializer.HEX_COUNT_X, Math.random() * Initializer.HEX_COUNT_Y, biome])
        }
        return map
    }

    private static buildHexMap(NoiseMap: number[][], biomeMap: number[][]): Hex[] {
        const hexMap = []
        for (let i = 0; i < Initializer.HEX_COUNT_Y; i++) {
            for (let j = 0; j < Initializer.HEX_COUNT_X; j++) {
                const x = (i % 2 == 0) ? j * Initializer.HEX_WIDTH * 1.5 : j * Initializer.HEX_WIDTH * 1.5 + Initializer.HEX_WIDTH * .75
                const y = Initializer.HEX_HEIGHT / 2 * i
                const z = NoiseMap[j][i]
                const biome = Initializer.getBiome(j, i, biomeMap)
                const hex = new Hex(x, y, z, biome)
                hexMap.push(hex)
            }
        }
        return hexMap
    }

    private static getBiome(x: number, y: number, biomeMap: number[][]): Biome {
        var closestPoint: number[] = biomeMap[0]
        var closestDistance: number = Initializer.getDistance(x, y, closestPoint[0], closestPoint[1])
        for (let point of biomeMap) {
            const curDistance = Initializer.getDistance(x, y, point[0], point[1])
            if (curDistance < closestDistance) {
                closestPoint = point
                closestDistance = curDistance
            }
        }
        return closestPoint[2]
    }

    private static getDistance(x1, y1, x2, y2): number {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
    }

    private static initializeMapPosition() {
        Initializer.MAP.style.left = `${Initializer.MAP_INITIAL_X}${Initializer.PX}`
        Initializer.MAP.style.top = `${Initializer.MAP_INITIAL_Y}${Initializer.PX}`
        Initializer.SCROLL_CONTAINER.style.transformOrigin = Initializer.CENTER
        setTimeout(function () {
            Initializer.MAP.style.opacity = "1"
            setTimeout(function () {
                Initializer.topLeftMenu.style.opacity = "1"
            }, 1000)
        }, 1000)
    }

    private static sumOcatave(noiseGen: SimplexNoise, num_iterations: number, x: number, y: number, persistence: number, scale: number): number {
        var maxAmp = 0.0
        var amp = 1.0
        var freq = scale
        var noise = 0.0
        for (let i = 0; i < num_iterations; i++) {
            noise += noiseGen.noise2D(x * freq, y * freq) * amp
            maxAmp += amp
            amp *= persistence
            freq *= 2
        }
        noise /= maxAmp
        return noise
    }
    private static scroll(event: WheelEvent) {
        const delta = event.deltaY;
        const scaleStr = Initializer.SCROLL_CONTAINER.style.transform ? Initializer.SCROLL_CONTAINER.style.transform : `${Initializer.SCALE}1${Initializer.CLOSE_PAREN}`
        const scale = Number(scaleStr.slice(6, scaleStr.indexOf(Initializer.CLOSE_PAREN)))
        if (delta > 0) {
            Initializer.SCROLL_CONTAINER.style.transform = `${Initializer.SCALE}${scale / Initializer.SCALE_FACTOR}${Initializer.CLOSE_PAREN}`
            Initializer.moveSpeed *= Initializer.SCALE_FACTOR
        } else if (delta < 0) {
            Initializer.SCROLL_CONTAINER.style.transform = `${Initializer.SCALE}${scale * Initializer.SCALE_FACTOR}${Initializer.CLOSE_PAREN}`
            Initializer.moveSpeed /= Initializer.SCALE_FACTOR
        }
    }

    private static keyDown(event: KeyboardEvent) {
        if (event.repeat) {
            return
        }
        switch (event.code) {
            case Initializer.KEYS:
                Initializer.MOVE_DOWN.push(setInterval(function () {
                    const topStr = Initializer.MAP.style.top ? Initializer.MAP.style.top : Initializer.ZERO
                    const top = Number(topStr.slice(0, topStr.indexOf(Initializer.P)))
                    Initializer.MAP.style.top = `${top - Initializer.moveSpeed}${Initializer.PX}`
                }, 20))
                break;
            case Initializer.KEYW:
                Initializer.MOVE_UP.push(setInterval(function () {
                    const topStr = Initializer.MAP.style.top ? Initializer.MAP.style.top : Initializer.ZERO
                    const top = Number(topStr.slice(0, topStr.indexOf(Initializer.P)))
                    Initializer.MAP.style.top = `${top + Initializer.moveSpeed}${Initializer.PX}`

                }, 20))
                break;
            case Initializer.KEYA:
                Initializer.MOVE_LEFT.push(setInterval(function () {
                    const leftStr = Initializer.MAP.style.left ? Initializer.MAP.style.left : Initializer.ZERO
                    const left = Number(leftStr.slice(0, leftStr.indexOf(Initializer.P)))
                    Initializer.MAP.style.left = `${left + Initializer.moveSpeed}${Initializer.PX}`
                }, 20))
                break;
            case Initializer.KEYD:
                Initializer.MOVE_RIGHT.push(setInterval(function () {
                    const leftStr = Initializer.MAP.style.left ? Initializer.MAP.style.left : Initializer.ZERO
                    const left = Number(leftStr.slice(0, leftStr.indexOf(Initializer.P)))
                    Initializer.MAP.style.left = `${left - Initializer.moveSpeed}${Initializer.PX}`
                }, 20))
        }
    }

    private static keyUp(event: KeyboardEvent) {
        switch (event.code) {
            case Initializer.KEYS:
                for (let interval of Initializer.MOVE_DOWN) {
                    clearInterval(interval)
                }
                break;
            case Initializer.KEYW:
                for (let interval of Initializer.MOVE_UP) {
                    clearInterval(interval)
                }
                break;
            case Initializer.KEYA:
                for (let interval of Initializer.MOVE_LEFT) {
                    clearInterval(interval)
                }
                break;
            case Initializer.KEYD:
                for (let interval of Initializer.MOVE_RIGHT) {
                    clearInterval(interval)
                }
        }
    }
}

export { Initializer }