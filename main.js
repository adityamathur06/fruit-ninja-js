const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

let score = 0;
let timeElapsed = 0;
let timerInterval;
let paused = false;
let fruits = [];
const slicedFruits = [];
let bombs = [];
let missedFruits = 0;
let gameEnded = false;
let isMouseDown = false;
const fruitImages = ["assets/Apple.png", "assets/Pineapple.png", "assets/Watermelon.png", "assets/Banana.png"]
let gamePaused = false;

function ToLoginScreen() {
    window.location.href = "Login/Login.html";
}

function ToTitleScreen() {
    window.location.href = "index.html";
}

function ToMainScreen() {
    window.location.href = "main.html";
}

function resize_canvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize_canvas);
resize_canvas();

function startGame() {
    timerInterval = setInterval(Timer, 1000);
    spawnFruit();
    spawnBomb();
    gameLoop();
}

function Timer() {
    if (gameEnded) return;
    timeElapsed++;
    document.getElementById("timer").innerText = `Time: ${timeElapsed}s`;
}

function handle_bomb_slice() {
    
    clearInterval(timerInterval);
    gamePaused = true;
    document.body.style.transition = "filter 4s";
    document.body.style.filter = "brightness(2)";

    
    const fruitsAndBombs = document.querySelectorAll('.fruit, .bomb');
    fruitsAndBombs.forEach(item => {
        item.style.animationPlayState = 'paused';
    });

    
    setTimeout(() => {
        document.body.style.filter = "brightness(1)";
        fruitsAndBombs.forEach(item => {
            item.style.animationPlayState = 'running';
        });
        timerInterval = setInterval(Timer, 1000);
        gamePaused = false;
        endGame()
    }, 4000);
}

function spawnFruit() {
    if (gamePaused) return
    if (fruits.length < 5) {
        const fruitImage = fruitImages[Math.floor(Math.random()*fruitImages.length)]
        const fruit = {
            x: Math.random() * (canvas.width - 200) + 100,
            y: canvas.height,
            radius: 70,
            speedX: (Math.random() - 0.5) * 4,
            speedY: -10 - Math.random() * 5,
            gravity: 0.3,
            maxHeight: Math.random() * canvas.height * 0.7 + 100,
            image: new Image(),
            rotation: 0,
            rotationSpeed: Math.random() * 0.1 + 0.05,
            type: "fruit"
        };
        fruit.image.src = fruitImage;
        fruits.push(fruit);
    }

    setTimeout(spawnFruit, Math.random() * 2000 + 500);
}

function spawnBomb() {
    if (gamePaused) return
    if (bombs.length < 5) {
        const bomb = {
            x: Math.random() * (canvas.width - 200) + 100,
            y: canvas.height,
            radius: 50,
            speedX: (Math.random() - 0.5) * 4,
            speedY: -10 - Math.random() * 5,
            gravity: 0.3,
            maxHeight: Math.random() * canvas.height * 0.7 + 100,
            image: new Image(),
            rotation: 0,
            rotationSpeed: Math.random() * 0.1 + 0.05,
            type: "bomb"
        };
        bomb.image.src = "assets/bomb.png"
        bombs.push(bomb);
    }

    setTimeout(spawnBomb, Math.random() * 3000 + 1000);
}

function gameLoop() {
    if (gameEnded || gamePaused) return

    context.clearRect(0, 0, canvas.width, canvas.height);


    fruits.forEach((fruit, index) => {
        fruit.x += fruit.speedX;

        if (fruit.y > fruit.maxHeight) {
            fruit.y += fruit.speedY;
            fruit.speedY += fruit.gravity;
        } else {
            fruit.speedY += fruit.gravity;
            fruit.y += fruit.speedY;
        }

        fruit.rotation += fruit.rotationSpeed;

        context.save()
        context.translate(fruit.x, fruit.y)
        context.rotate(fruit.rotation)
        context.drawImage(fruit.image, -fruit.radius, -fruit.radius, fruit.radius * 2, fruit.radius * 2)
        context.restore()

    
        if (fruit.y > canvas.height) {
            fruits.splice(index, 1);
            missedFruits++;
            document.getElementById("missedFruitsDisplay").innerText = `Missed Fruits: ${missedFruits}`;
            if (missedFruits >= 3) {
                endGame();
            }
        }
    });

    slicedFruits.forEach((sliced, index) => {

        const slicedFruitRadius = 37;

        sliced.x += sliced.speedX;
        sliced.y += sliced.speedY;
        sliced.speedY += sliced.gravity;

        sliced.rotation += sliced.rotationSpeed;

        context.save();
        context.translate(sliced.x, sliced.y);
        context.rotate(sliced.rotation);
        const scaledRadius = slicedFruitRadius;
        context.drawImage(sliced.image, -scaledRadius, -scaledRadius, scaledRadius * 2, scaledRadius * 2);
        context.restore();

    
        if (sliced.y > canvas.height) {
            slicedFruits.splice(index, 1);
        }
    });


    bombs.forEach((bomb, index) => {
        bomb.x += bomb.speedX;

        if (bomb.y > bomb.maxHeight) {
            bomb.y += bomb.speedY;
            bomb.speedY += bomb.gravity;
        } else {
            bomb.speedY += bomb.gravity;
            bomb.y += bomb.speedY;
        }


        bomb.rotation += bomb.rotationSpeed;

        context.save();
        context.translate(bomb.x, bomb.y)
        context.rotate(bomb.rotation)
        context.drawImage(bomb.image, -bomb.radius, -bomb.radius, bomb.radius * 2, bomb.radius * 2);
        context.restore()

    
        if (bomb.y > canvas.height) {
            bombs.splice(index, 1);
        }
    });

    requestAnimationFrame(gameLoop);
}


canvas.addEventListener("mousedown", () => {
    isMouseDown = true;
});

canvas.addEventListener("mouseup", () => {
    isMouseDown = false;
});

canvas.addEventListener("mousemove", (event) => {
    if (isMouseDown) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        
        fruits.forEach((fruit, index) => {
            if (gamePaused) return;
            const dist = Math.sqrt((mouseX - fruit.x) ** 2 + (mouseY - fruit.y) ** 2);
            if (dist < fruit.radius) {

                const FruitSliceSound = new Audio("assets/splatter.mp3");
                FruitSliceSound.play();

                const slicedLeft = {
                    x: fruit.x,
                    y: fruit.y,
                    radius: fruit.radius,
                    speedX: -4,
                    speedY: fruit.speedY,
                    gravity: 0.3,
                    image: new Image(),
                    rotation: fruit.rotation,
                    rotationSpeed: fruit.rotationSpeed,
                    type: "sliced"
                };
                slicedLeft.image.src = `assets/${fruit.image.src.split("/").pop().split(".")[0]}_left.png`;

                const slicedRight = {
                    x: fruit.x,
                    y: fruit.y,
                    radius: fruit.radius,
                    speedX: 4,
                    speedY: fruit.speedY,
                    gravity: 0.3,
                    image: new Image(),
                    rotation: fruit.rotation,
                    rotationSpeed: fruit.rotationSpeed,
                    type: "sliced"
                };
                slicedRight.image.src = `assets/${fruit.image.src.split("/").pop().split(".")[0]}_right.png`;

                
                slicedFruits.push(slicedLeft);
                slicedFruits.push(slicedRight);

                fruits.splice(index, 1);
                score++;
                document.getElementById("score").innerText = `Score: ${score}`;
            }
        });

        
        bombs.forEach((bomb, index) => {
            if (gamePaused) return; 
            const dist = Math.sqrt((mouseX - bomb.x) ** 2 + (mouseY - bomb.y) ** 2);
            if (dist < bomb.radius) {
                bombs.splice(index, 1);
                const BombSliceSound = new Audio("assets/boom.mp3");
                BombSliceSound.play();
                handle_bomb_slice();
            }
        });
    }
});

function endGame() {
    clearInterval(timerInterval);
    gameEnded = true;

    sessionStorage.setItem("score", score);
    sessionStorage.setItem("timePlayed", timeElapsed);
    sessionStorage.setItem("missedFruits", missedFruits);

    window.location.href = "game_over.html";
}

window.onload = startGame;