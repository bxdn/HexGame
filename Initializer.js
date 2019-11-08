import { Hex } from "./Hex.js";
import { SimplexNoise } from "./SimplexNoise.js";
import { Biome } from "./Biome.js";
class Initializer {
    static initialize() {
        Initializer.assignListeners();
        if (localStorage.getItem("map")) {
            const map = JSON.parse(localStorage.getItem("map"));
            for (let hex of map) {
                Initializer.MAP.appendChild(new Hex(hex[0], hex[1], hex[2], null, hex[3]));
            }
        }
        else {
            Initializer.buildHexMap(Initializer.createNoiseMap(), Initializer.createBiomeMap());
        }
        Initializer.initializeMapPosition();
    }
    static assignListeners() {
        Initializer.MAP_CONTAINER.addEventListener(Initializer.WHEEL, Initializer.scroll);
        window.addEventListener(Initializer.KEYDOWN, Initializer.keyDown);
        window.addEventListener(Initializer.KEYUP, Initializer.keyUp);
        Initializer.saveBtn.addEventListener("mousedown", Initializer.save);
        Initializer.clearBtn.addEventListener("mousedown", Initializer.clear);
    }
    static clear() {
        localStorage.removeItem("map");
    }
    static save() {
        let map = [];
        for (let hex of Hex.instances) {
            map.push([hex.getX(), hex.getY(), hex.getZ(), hex.getSource()]);
        }
        localStorage.setItem("map", JSON.stringify(map));
    }
    static createNoiseMap() {
        const noise = new SimplexNoise();
        const map = [];
        for (let i = 0; i < Initializer.HEX_COUNT_X; i++) {
            const row = [];
            for (let j = 0; j < Initializer.HEX_COUNT_Y; j++) {
                row.push(Initializer.sumOcatave(noise, Initializer.NUM_OCTAVES, i, j / 3, Initializer.PERSISTANCE, Initializer.NOISE_SCALE));
            }
            map.push(row);
        }
        return map;
    }
    static createBiomeMap() {
        const map = [];
        for (let i = 0; i < Initializer.BIOMES; i++) {
            const biome = Math.floor(Math.random() * Biome._Length);
            map.push([Math.random() * Initializer.HEX_COUNT_X, Math.random() * Initializer.HEX_COUNT_Y, biome]);
        }
        return map;
    }
    static buildHexMap(NoiseMap, biomeMap) {
        for (let i = 0; i < Initializer.HEX_COUNT_Y; i++) {
            for (let j = 0; j < Initializer.HEX_COUNT_X; j++) {
                const x = (i % 2 == 0) ? j * Initializer.HEX_WIDTH * 1.5 : j * Initializer.HEX_WIDTH * 1.5 + Initializer.HEX_WIDTH * .75;
                const y = Initializer.HEX_HEIGHT / 2 * i;
                const z = NoiseMap[j][i];
                const biome = Initializer.getBiome(j, i, biomeMap);
                Initializer.MAP.appendChild(new Hex(x, y, z, biome));
            }
        }
    }
    static getBiome(x, y, biomeMap) {
        var closestPoint = biomeMap[0];
        var closestDistance = Initializer.getDistance(x, y, closestPoint[0], closestPoint[1]);
        for (let point of biomeMap) {
            const curDistance = Initializer.getDistance(x, y, point[0], point[1]);
            if (curDistance < closestDistance) {
                closestPoint = point;
                closestDistance = curDistance;
            }
        }
        return closestPoint[2];
    }
    static getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }
    static initializeMapPosition() {
        Initializer.MAP.style.left = `${Initializer.MAP_INITIAL_X}${Initializer.PX}`;
        Initializer.MAP.style.top = `${Initializer.MAP_INITIAL_Y}${Initializer.PX}`;
        Initializer.SCROLL_CONTAINER.style.transformOrigin = Initializer.CENTER;
        setTimeout(function () {
            Initializer.MAP.style.opacity = "1";
            setTimeout(function () {
                Initializer.topLeftMenu.style.opacity = "1";
            }, 1000);
        }, 1000);
    }
    static sumOcatave(noiseGen, num_iterations, x, y, persistence, scale) {
        var maxAmp = 0.0;
        var amp = 1.0;
        var freq = scale;
        var noise = 0.0;
        for (let i = 0; i < num_iterations; i++) {
            noise += noiseGen.noise2D(x * freq, y * freq) * amp;
            maxAmp += amp;
            amp *= persistence;
            freq *= 2;
        }
        noise /= maxAmp;
        return noise;
    }
    static scroll(event) {
        const delta = event.deltaY;
        const scaleStr = Initializer.SCROLL_CONTAINER.style.transform ? Initializer.SCROLL_CONTAINER.style.transform : `${Initializer.SCALE}1${Initializer.CLOSE_PAREN}`;
        const scale = Number(scaleStr.slice(6, scaleStr.indexOf(Initializer.CLOSE_PAREN)));
        if (delta > 0) {
            Initializer.SCROLL_CONTAINER.style.transform = `${Initializer.SCALE}${scale / Initializer.SCALE_FACTOR}${Initializer.CLOSE_PAREN}`;
            Initializer.moveSpeed *= Initializer.SCALE_FACTOR;
        }
        else if (delta < 0) {
            Initializer.SCROLL_CONTAINER.style.transform = `${Initializer.SCALE}${scale * Initializer.SCALE_FACTOR}${Initializer.CLOSE_PAREN}`;
            Initializer.moveSpeed /= Initializer.SCALE_FACTOR;
        }
    }
    static keyDown(event) {
        if (event.repeat) {
            return;
        }
        switch (event.code) {
            case Initializer.KEYS:
                Initializer.MOVE_DOWN.push(setInterval(function () {
                    const topStr = Initializer.MAP.style.top ? Initializer.MAP.style.top : Initializer.ZERO;
                    const top = Number(topStr.slice(0, topStr.indexOf(Initializer.P)));
                    Initializer.MAP.style.top = `${top - Initializer.moveSpeed}${Initializer.PX}`;
                }, 20));
                break;
            case Initializer.KEYW:
                Initializer.MOVE_UP.push(setInterval(function () {
                    const topStr = Initializer.MAP.style.top ? Initializer.MAP.style.top : Initializer.ZERO;
                    const top = Number(topStr.slice(0, topStr.indexOf(Initializer.P)));
                    Initializer.MAP.style.top = `${top + Initializer.moveSpeed}${Initializer.PX}`;
                }, 20));
                break;
            case Initializer.KEYA:
                Initializer.MOVE_LEFT.push(setInterval(function () {
                    const leftStr = Initializer.MAP.style.left ? Initializer.MAP.style.left : Initializer.ZERO;
                    const left = Number(leftStr.slice(0, leftStr.indexOf(Initializer.P)));
                    Initializer.MAP.style.left = `${left + Initializer.moveSpeed}${Initializer.PX}`;
                }, 20));
                break;
            case Initializer.KEYD:
                Initializer.MOVE_RIGHT.push(setInterval(function () {
                    const leftStr = Initializer.MAP.style.left ? Initializer.MAP.style.left : Initializer.ZERO;
                    const left = Number(leftStr.slice(0, leftStr.indexOf(Initializer.P)));
                    Initializer.MAP.style.left = `${left - Initializer.moveSpeed}${Initializer.PX}`;
                }, 20));
        }
    }
    static keyUp(event) {
        switch (event.code) {
            case Initializer.KEYS:
                for (let interval of Initializer.MOVE_DOWN) {
                    clearInterval(interval);
                }
                break;
            case Initializer.KEYW:
                for (let interval of Initializer.MOVE_UP) {
                    clearInterval(interval);
                }
                break;
            case Initializer.KEYA:
                for (let interval of Initializer.MOVE_LEFT) {
                    clearInterval(interval);
                }
                break;
            case Initializer.KEYD:
                for (let interval of Initializer.MOVE_RIGHT) {
                    clearInterval(interval);
                }
        }
    }
}
Initializer.WHEEL = "wheel";
Initializer.KEYDOWN = "keydown";
Initializer.KEYUP = "keyup";
Initializer.CENTER = "center";
Initializer.PX = "px";
Initializer.ZERO = "0px";
Initializer.KEYS = "KeyS";
Initializer.KEYA = "KeyA";
Initializer.KEYW = "KeyW";
Initializer.KEYD = "KeyD";
Initializer.P = "p";
Initializer.SCALE = "scale(";
Initializer.CLOSE_PAREN = ")";
Initializer.SCROLL_CONTAINER = document.getElementById("scrollContainer");
Initializer.MAP_CONTAINER = document.getElementById("mapContainer");
Initializer.MAP = document.getElementById("map");
Initializer.topLeftMenu = document.getElementById("topLeftMenu");
Initializer.saveBtn = document.getElementById("saveButton");
Initializer.clearBtn = document.getElementById("clearButton");
Initializer.MAP_INITIAL_X = -2000;
Initializer.MAP_INITIAL_Y = -1900;
Initializer.HEX_COUNT_X = 33;
Initializer.HEX_COUNT_Y = 99;
Initializer.HEX_WIDTH = 96;
Initializer.HEX_HEIGHT = 84;
Initializer.PERSISTANCE = .5;
Initializer.NOISE_SCALE = .05;
Initializer.NUM_OCTAVES = 16;
Initializer.SCALE_FACTOR = 1.2;
Initializer.BIOMES = 100;
Initializer.MOVE_RIGHT = [];
Initializer.MOVE_UP = [];
Initializer.MOVE_LEFT = [];
Initializer.MOVE_DOWN = [];
Initializer.moveSpeed = 100;
export { Initializer };
