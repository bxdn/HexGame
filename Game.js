import { Initializer } from "./Initializer.js";
class Game {
    start() {
        this.hexMap = Initializer.initialize();
    }
}
export { Game };
