import {Initializer} from "./Initializer.js"
import { Hex } from "./Hex.js";
class Game {
    private hexMap: Hex[]
    start(){
        this.hexMap = Initializer.initialize();
    }
}
export { Game }