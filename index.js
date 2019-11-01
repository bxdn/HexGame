import { SimplexNoise } from "./SimplexNoise.js";
var moveRight = [];
var moveUp = [];
var moveLeft = [];
var moveDown = [];
var moveSpeed = 10;
function scroll(event) {
    const delta = event.deltaY;
    const map = document.getElementById("scrollContainer");
    const scaleStr = map.style.transform ? map.style.transform : "scale(1)";
    const scale = Number(scaleStr.slice(6, scaleStr.indexOf(")")));
    if (delta > 0) {
        map.style.transform = `scale(${scale * 1 / 1.1})`;
        moveSpeed *= 1.1;
    }
    else if (delta < 0) {
        map.style.transform = `scale(${scale * 1.1})`;
        moveSpeed *= 1 / 1.1;
    }
}
function keyDown(event) {
    if (event.repeat) {
        return;
    }
    const map = document.getElementById("map");
    switch (event.code) {
        case "KeyS":
            moveDown.push(setInterval(function () {
                const topStr = map.style.top ? map.style.top : "0px";
                const top = Number(topStr.slice(0, topStr.indexOf("p")));
                map.style.top = `${top - moveSpeed}px`;
            }, 5));
            break;
        case "KeyW":
            moveUp.push(setInterval(function () {
                const topStr = map.style.top ? map.style.top : "0px";
                const top = Number(topStr.slice(0, topStr.indexOf("p")));
                map.style.top = `${top + moveSpeed}px`;
            }, 5));
            break;
        case "KeyA":
            moveLeft.push(setInterval(function () {
                const leftStr = map.style.left ? map.style.left : "0px";
                const left = Number(leftStr.slice(0, leftStr.indexOf("p")));
                map.style.left = `${left + moveSpeed}px`;
            }, 5));
            break;
        case "KeyD":
            moveRight.push(setInterval(function () {
                const leftStr = map.style.left ? map.style.left : "0px";
                const left = Number(leftStr.slice(0, leftStr.indexOf("p")));
                map.style.left = `${left - moveSpeed}px`;
            }, 5));
    }
}
function keyUp(event) {
    switch (event.code) {
        case "KeyS":
            for (let interval of moveDown) {
                clearInterval(interval);
            }
            break;
        case "KeyW":
            for (let interval of moveUp) {
                clearInterval(interval);
            }
            break;
        case "KeyA":
            for (let interval of moveLeft) {
                clearInterval(interval);
            }
            break;
        case "KeyD":
            for (let interval of moveRight) {
                clearInterval(interval);
            }
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
        row.push(sumOcatave(noise, 16, i, j / 3, .6, .05));
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
setInterval(function () {
});
document.getElementById("map").style.left = "-2000px";
document.getElementById("map").style.top = "-2000px";
document.getElementById("scrollContainer").style.transformOrigin = "center";
