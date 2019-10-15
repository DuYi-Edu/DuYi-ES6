const skyDom = document.querySelector(".sky");
const skyStyles = getComputedStyle(skyDom);
const skyWidth = parseFloat(skyStyles.width);
const skyHeight = parseFloat(skyStyles.height);

class Sky extends Rectangle {
    constructor() {
        super(skyWidth, skyHeight, 0, 0, -50, 0, skyDom);
    }

    onMove() {
        if (this.left <= -skyWidth / 2) {
            this.left = 0;
        }
    }
}

var sky = new Sky();

setInterval(() => {
    sky.move(16 / 1000);
}, 16)