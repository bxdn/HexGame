import { SimplexNoise } from "./SimplexNoise.js";
var moveRight;
var moveUp;
var moveLeft;
var moveDown;
function scroll(event) {
    const delta = event.deltaY;
    const map = document.getElementById("map");
    const scaleStr = map.style.transform ? map.style.transform : "scale(1)";
    const scale = Number(scaleStr.slice(6, scaleStr.indexOf(")")));
    if (delta > 0) {
        map.style.transformOrigin = "center";
        map.style.transform = `scale(${scale * .9})`;
    }
    else if (delta < 0) {
        map.style.transformOrigin = "center";
        map.style.transform = `scale(${scale * 1.1})`;
    }
}
function keyDown(event) {
    if (event.repeat) {
        return;
    }
    console.log(event.code);
    const map = document.getElementById("map");
    switch (event.code) {
        case "KeyS":
            if (event.repeat) {
                clearInterval(moveDown);
            }
            moveDown = setInterval(function () {
                const topStr = map.style.top ? map.style.top : "0px";
                const top = Number(topStr.slice(0, topStr.indexOf("p")));
                map.style.top = `${top - 1}px`;
            }, 5);
            break;
        case "KeyW":
            if (event.repeat) {
                clearInterval(moveUp);
            }
            moveUp = setInterval(function () {
                const topStr = map.style.top ? map.style.top : "0px";
                const top = Number(topStr.slice(0, topStr.indexOf("p")));
                map.style.top = `${top + 1}px`;
            }, 5);
            break;
        case "KeyA":
            if (event.repeat) {
                clearInterval(moveLeft);
            }
            moveLeft = setInterval(function () {
                const leftStr = map.style.left ? map.style.left : "0px";
                const left = Number(leftStr.slice(0, leftStr.indexOf("p")));
                map.style.left = `${left + 1}px`;
            }, 5);
            break;
        case "KeyD":
            if (event.repeat) {
                clearInterval(moveRight);
            }
            moveRight = setInterval(function () {
                const leftStr = map.style.left ? map.style.left : "0px";
                const left = Number(leftStr.slice(0, leftStr.indexOf("p")));
                map.style.left = `${left - 1}px`;
            }, 5);
    }
}
function keyUp(event) {
    switch (event.code) {
        case "KeyS":
            clearInterval(moveDown);
            break;
        case "KeyW":
            clearInterval(moveUp);
            break;
        case "KeyA":
            clearInterval(moveLeft);
            break;
        case "KeyD":
            clearInterval(moveRight);
    }
}
function sumOcatave(noiseGen, num_iterations, x, y, persistence, scale) {
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
const noise = new SimplexNoise();
const mapContainer = document.getElementById("mapContainer");
mapContainer.addEventListener("wheel", scroll);
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);
const map = [];
for (let i = 0; i < 33; i++) {
    const row = [];
    for (let j = 0; j < 99; j++) {
        row.push(sumOcatave(noise, 16, i, j / 3, .5, .05));
    }
    map.push(row);
}
console.log(map);
const green = new Image(100, 100);
green.src = "GreenHex.png";
const blue = new Image(100, 100);
blue.src = "BlueHex.png";
for (let i = 0; i < 99; i++) {
    for (let j = 0; j < 33; j++) {
        const x = (i % 2 == 0) ? j * 150 : j * 150 + 75;
        const y = 50 * i;
        const img = new Image(100, 100);
        img.src = (map[j][i] > .1) ? "GreenHex.png" : "BlueHex.png";
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;
        img.style.position = "absolute";
        document.getElementById("map").appendChild(img);
    }
}
