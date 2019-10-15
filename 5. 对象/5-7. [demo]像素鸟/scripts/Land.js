const landDom = document.querySelector(".land");
const landStyles = getComputedStyle(landDom);
const landWidth = parseFloat(landStyles.width);
const landHeight = parseFloat(landStyles.height);
const landTop = parseFloat(landStyles.top);

class Land extends Rectangle {
    constructor() {
        super(landWidth, landHeight, 0, landTop, -100, 0, landDom);
    }

    onMove() {
        if (this.left <= -landWidth / 2) {
            this.left = 0;
        }
    }
}

var land = new Land();

setInterval(() => {
    land.move(16 / 1000);
}, 16)