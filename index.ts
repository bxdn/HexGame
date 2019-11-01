import { SimplexNoise } from "./SimplexNoise.js"
var moveRight: number
var moveUp: number
var moveLeft: number
var moveDown: number
function scroll(event: WheelEvent) {
    const delta = event.deltaY;
    const map = document.getElementById("map")
    const scaleStr = map.style.transform ? map.style.transform : "scale(1)"
    const scale = Number(scaleStr.slice(6, scaleStr.indexOf(")")))
    if (delta > 0) {
        map.style.transform = `scale(${scale - .1})`
    } else if (delta < 0) {
        map.style.transform = `scale(${scale + .1})`
    }
}

function keyDown(event: KeyboardEvent) {
    if(event.repeat){
        return
    }
    console.log(event.code)
    const map = document.getElementById("map")
    switch (event.code) {
        case "KeyS":
            moveDown = setInterval(function () {
                const marginTopStr = map.style.marginTop ? map.style.marginTop : "0px"
                const marginTop = Number(marginTopStr.slice(0, marginTopStr.indexOf("p")))
                map.style.marginTop = `${marginTop + 1}px`
            }, 5)
            break;
        case "KeyW":
            moveUp = setInterval(function () {
                const marginTopStr = map.style.marginTop ? map.style.marginTop : "0px"
                const marginTop = Number(marginTopStr.slice(0, marginTopStr.indexOf("p")))
                map.style.marginTop = `${marginTop - 1}px`
            }, 5)
            break;
        case "KeyA":
            moveLeft = setInterval(function () {
                const marginLeftStr = map.style.marginLeft ? map.style.marginLeft : "0px"
                const marginLeft = Number(marginLeftStr.slice(0, marginLeftStr.indexOf("p")))
                map.style.marginLeft = `${marginLeft - 1}px`
            }, 5)
            break;
        case "KeyD":
            moveRight = setInterval(function () {
                const marginLeftStr = map.style.marginLeft ? map.style.marginLeft : "0px"
                const marginLeft = Number(marginLeftStr.slice(0, marginLeftStr.indexOf("p")))
                map.style.marginLeft = `${marginLeft + 1}px`
            }, 5)
    }
}

function keyUp(event: KeyboardEvent) {
    console.log("HAAA")
    switch (event.code) {
        case "KeyS":
            clearInterval(moveDown)
            break;
        case "KeyW":
            clearInterval(moveUp)
            break;
        case "KeyA":
            clearInterval(moveLeft)
            break;
        case "KeyD":
            clearInterval(moveRight)
    }
}


var noise = new SimplexNoise("hello");
console.log(noise.noise2D(1, 2))
const mapContainer = document.getElementById("mapContainer")
mapContainer.addEventListener("wheel", scroll);
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);
