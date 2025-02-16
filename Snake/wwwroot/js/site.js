

let snakeSegments = []
let food = [];
let foodHeight = 37;
let foodWidth = 26;
let appHeight = window.innerHeight - 25;
let appWidth = window.innerWidth - 25
let snakeSegmentHeight = 50;
let snakeSegmentWidth = 50;
let directionMoving = { left: false, right: false, up: false, down: false }
let lastDirection_vert = null;
let lastDirection_horz = null
let firstSnakeSegmentPos = null;
let snakeHeadPositions = [];
let speed = 4;

let fontSyle = { fontSize: 16 }

const app = new PIXI.Application({
    background: '#1099bb',
    width: appWidth,
    height: appHeight
});


document.body.appendChild(app.view);


var bTemp = new PIXI.Graphics();
bTemp.beginFill(0x66CCFF);
bTemp.drawRect(0, 0, 50, 50);
bTemp.x = appWidth - (snakeSegmentWidth * 2)
bTemp.y = appHeight - (snakeSegmentHeight * 2)
bTemp.endFill();
bTemp.turnPositions = [];
bTemp.moves = []

snakeSegments.push(bTemp)
app.stage.addChild(bTemp)
addFood();

const txtSnake = new PIXI.Text(`${snakeSegments[0].x} - ${snakeSegments[0].y}`, fontSyle);

txtSnake.x = 50;
txtSnake.y = 100;
app.stage.addChild(txtSnake);


const txtScore = new PIXI.Text('Score: ', fontSyle);

txtScore.x = 0;
txtScore.y = 0;
app.stage.addChild(txtScore);



app.ticker.add((delta) =>
{

    // delta is 1 if running at 100% performance
    // creates frame-independent transformation
    //bunny.rotation += 0.01 * delta;
    gameLoop()
});

function gameLoop()
{
    moveSnake();
    //logSnakeMoves();
    //moveSnake2();
    checkIfAtFood();
    checkBounds()

    txtSnake.text = `${snakeSegments[0].x} - ${snakeSegments[0].y}`;

}


function moveSnake()
{


    if (directionMoving.left)
    {
        for (const [index, segment] of snakeSegments.entries())
        {
            if (index == 0)
            {
                moveLeft(segment)
                continue;
            }

            let parentSnakePos = getParentSnakePosition(index);
            segment.snakeLabel.text = `${segment.x} - ${segment.y}`
            segment.snakeLabel.x = segment.x;
            segment.snakeLabel.y = segment.y;

            if (parentSnakePos == null)
            {
                moveLeft(segment);
                continue;
            }

            if (lastDirection_vert == "up")
            {
                if (index > 0 && segment.y >= parentSnakePos.y)
                {
                    moveUp(segment)
                }
                else if (index > 0 && segment.y <= parentSnakePos.y)
                {
                    moveLeft(segment)
                    removeParentSnakePosition(index);

                }
            }
            else if (lastDirection_vert == "down")
            {
                if (index > 0 && segment.y <= parentSnakePos.y)
                {
                    moveDown(segment)
                }
                else if (index > 0 && segment.y >= parentSnakePos.y)
                {
                    moveLeft(segment)
                    removeParentSnakePosition(index);
                }
            }
            else if (lastDirection_horz == null)
            {
                moveLeft(segment)
            }

        }
    }
    else if (directionMoving.right)
    {
        for (const [index, segment] of snakeSegments.entries())
        {
            if (index == 0)
            {
                moveRight(segment)
                continue;
            }

            let parentSnakePos = getParentSnakePosition(index);
            segment.snakeLabel.text = `${segment.x} - ${segment.y}`
            segment.snakeLabel.x = segment.x;
            segment.snakeLabel.y = segment.y;


            if (parentSnakePos == null)
            {
                moveRight(segment)
                continue;
            }

            if (lastDirection_vert == "up")
            {
                if (index > 0 && segment.y >= parentSnakePos.y)
                {
                    moveUp(segment)
                }
                else if (index > 0 && segment.y <= parentSnakePos.y)
                {
                    moveRight(segment)
                    removeParentSnakePosition(index);
                }
            }
            else if (lastDirection_vert == "down")
            {
                if (index > 0 && segment.y <= parentSnakePos.y)
                {
                    moveDown(segment)
                }
                else if (index > 0 && segment.y >= parentSnakePos.y)
                {
                    moveRight(segment)
                    removeParentSnakePosition(index);
                }
            }
            else if (lastDirection_horz == null)
            {
                moveLeft(segment)
            }
        }
    }
    else if (directionMoving.up)
    {
        for (const [index, segment] of snakeSegments.entries())
        {

            if (index == 0)
            {
                moveUp(segment)
                continue;
            }

            let parentSnakePos = getParentSnakePosition(index);
            segment.snakeLabel.text = `${segment.x} - ${segment.y}`
            segment.snakeLabel.x = segment.x;
            segment.snakeLabel.y = segment.y;

            if (parentSnakePos == null)
            {

                moveUp(segment)
                continue;
            }

            if (lastDirection_horz == "left")
            {

                if (index > 0 && segment.x >= parentSnakePos.x)
                {
                    moveLeft(segment)

                }
                else if (index > 0 && segment.x <= parentSnakePos.x)
                {
                    moveUp(segment)
                    removeParentSnakePosition(index)
                }
            }
            if (lastDirection_horz == "right")
            {
                if (index > 0 && segment.x <= parentSnakePos.x)
                {
                    moveRight(segment)

                }
                else if (index > 0 && segment.x >= parentSnakePos.x)
                {
                    moveUp(segment)
                    removeParentSnakePosition(index)
                }
            }

            else if (lastDirection_horz == null)
            {
                moveUp(segment)
            }
        }
    }

    else if (directionMoving.down)
    {
        for (const [index, segment] of snakeSegments.entries())
        {
            if (index == 0)
            {
                moveDown(segment)
                continue;
            }

            let parentSnakePos = getParentSnakePosition(index);
            segment.snakeLabel.text = `${segment.x} - ${segment.y}`
            segment.snakeLabel.x = segment.x;
            segment.snakeLabel.y = segment.y;

            if (parentSnakePos == null)
            {
                moveDown(segment)
                continue;
            }

            if (lastDirection_horz == "left")
            {
                if (index > 0 && segment.x >= parentSnakePos.x)
                {
                    moveLeft(segment)

                }
                else if (index > 0 && segment.x <= parentSnakePos.x)
                {
                    moveUp(segment)
                    removeParentSnakePosition(index)
                }
            }
            if (lastDirection_horz == "right")
            {
                if (index > 0 && segment.x <= parentSnakePos.x)
                {
                    moveRight(segment)

                }
                else if (index > 0 && segment.x >= parentSnakePos.x)
                {
                    moveDown(segment)
                    removeParentSnakePosition(index)
                }
            }

            else if (lastDirection_horz == null)
            {
                moveUp(segment)
            }
        }
    }


    function moveLeft(segment)
    {
        segment.x -= 1 * speed;
    }

    function moveRight(segment)
    {
        segment.x += 1 * speed
    }

    function moveUp(segment)
    {
        segment.y -= 1 * speed
    }

    function moveDown(segment)
    {
        segment.y += 1 * speed
    }
}

function areNear(num1, num2)
{
    return Math.abs(num1 - num2) < 4
}
function moveSnake2()
{
    let snakeHeadPos = { x: snakeSegments[0].x, y: snakeSegments[0].y };
    snakeHeadPositions.push(snakeHeadPos);

    for (const [index, segment] of snakeSegments.entries())
    {


        if (index == 0)
        {
            if (directionMoving.left)
            {
                segment.x -= 1
            }
            else if (directionMoving.right)
            {
                segment.x += 1
            }
            else if (directionMoving.up)
            {
                segment.y -= 1
            }
            else if (directionMoving.down)
            {
                segment.y += 1
            }
        }
        else
        {
            if (directionMoving.left)
            {
                segment.x = snakeHeadPositions[0].x - (snakeSegmentWidth * index)
                segment.y = snakeHeadPositions[0].y
            }
            else if (directionMoving.right)
            {
                segment.x = snakeHeadPositions[0].x + (snakeSegmentWidth * index)
                segment.y = snakeHeadPositions[0].y
            }
            else if (directionMoving.up)
            {
                segment.x = snakeHeadPositions[0].x;
                segment.y = snakeHeadPositions[0].y + (snakeSegmentHeight * index)
            }
            else if (directionMoving.down)
            {
                segment.x = snakeHeadPositions[0].x;
                segment.y = snakeHeadPositions[0].y - (snakeSegmentHeight * index)
            }



            segment.moves.shift();
        }
    }

    snakeHeadPositions.shift();

}

function checkBounds()
{
    let snakePos = { x: snakeSegments[0].x, y: snakeSegments[0].y }
    //right side
    if (snakePos.x + snakeSegmentWidth >= appWidth)
    {
        for (const [index, segment] of snakeSegments.entries())
        {
            segment.x = 1 - (snakeSegmentWidth * index) - speed;
        }
    }

    //left side
    if (snakePos.x <= 0)
    {
        for (const [index, segment] of snakeSegments.entries())
        {
            segment.x = appWidth - 100 + (snakeSegmentWidth * index) + speed;
        }
    }


    //top
    if (snakePos.y <= 0)
    {
        for (const [index, segment] of snakeSegments.entries())
        {
            segment.y = appHeight - (snakeSegmentWidth * index) - speed;
        }
    }

    //bottom
    if (snakePos.y + snakeSegmentHeight >= appHeight)
    {
        //for (const [index, segment] of snakeSegments.entries())
        //{
        //    segment.x = appWidth - 100  + (snakeSegmentWidth * index) + speed;
        //}
    }
}

function checkIfAtFood()
{
    let snake = snakeSegments[0];
    let bunniesToRemove = [];

    for (const bunny of food)
    {
        if (bunny.visible && doesIntersect(snake, bunny))
        {
            bunny.visible = false;
            growSnake();
            showParticles(snake.x, snake.y);

            console.log('food')
            console.log(food);

            //bunniesToRemove.push(bunny);
        }
    }

    //for (const bunny of bunniesToRemove)
    //{

    //}

    let visibleFood = food.filter(function (f) { return f.visible });

    if (visibleFood.length == 1)
        addFood();
}

function doesIntersect(snake, bunny)
{
    return doesIntersectX(snake, bunny) && doesIntersectY(snake, bunny);

    function doesIntersectX(snake, food)
    {
        //console.log('doesIntersectX()')

        if (snake.x >= food.x1 && snake.x <= food.x2)
        {
            //console.log('true')
            return true;
        }

    }

    function doesIntersectY(snake, food) 
    {
        //console.log('doesIntersectY()')

        if (snake.y <= food.y2 && snake.y >= food.y1)
        {
            /* console.log('true')*/
            return true;
        }
    }
}

function growSnake()
{

    console.log('growSnake()')
    let snakeLength = snakeSegments.length;
    let lastSegment = snakeSegments[snakeLength - 1]
    var snakeX = lastSegment.x
    var snakeY = lastSegment.y

    if (directionMoving.up)
    {
        snakeY += snakeSegmentHeight
    }
    else if (directionMoving.down)
    {
        snakeY -= snakeSegmentHeight
    }
    else if (directionMoving.left)
    {
        snakeX += snakeSegmentWidth
    }
    else if (directionMoving.right)
    {
        snakeX -= snakeSegmentWidth
    }

    var bTemp = new PIXI.Graphics();

    bTemp.beginFill(0x66CCFF);
    bTemp.drawRect(0, 0, 50, 50);
    bTemp.x = snakeX;
    bTemp.y = snakeY;
    bTemp.endFill();
    bTemp.turnPositions = [];
    bTemp.moves = [];

    const txtSnakeLabel = new PIXI.Text(`${bTemp.x} - ${bTemp.y}`, { fontSize: 12, wordWrap: true, wordWrapWidth: 25 });

    txtSnakeLabel.x = bTemp.x;
    txtSnakeLabel.y = bTemp.y;

    bTemp.snakeLabel = txtSnakeLabel;

    snakeSegments.push(bTemp);
    app.stage.addChild(bTemp);
    app.stage.addChild(txtSnakeLabel);
}





function addFood()
{

    //const bunny = PIXI.Sprite.from('https://pixijs.com/assets/bunny.png');


    ////bunny.anchor.set(0.5);
    //bunny.x = snakeSegments[0].x
    //bunny.y = snakeSegments[0].y - 200
    //bunny.x2 = bunny.x + foodWidth;
    //bunny.y2 = bunny.y + foodHeight;

    //const txtBunny = new PIXI.Text(`${bunny.x} - ${bunny.x2}, ${bunny.y} - ${bunny.y2}`, fontSyle);
    //txtBunny.x = 50;
    //txtBunny.y = 200;
    //app.stage.addChild(txtBunny);

    //food.push(bunny)
    //app.stage.addChild(bunny)


    //const bunny2 = PIXI.Sprite.from('https://pixijs.com/assets/bunny.png');


    ////bunny.anchor.set(0.5);
    //bunny2.x = snakeSegments[0].x
    //bunny2.y = snakeSegments[0].y - 100
    //bunny2.x2 = bunny2.x + foodWidth;
    //bunny2.y2 = bunny2.y + foodHeight;

    //const txtBunny2 = new PIXI.Text(`${bunny2.x} - ${bunny2.x2}, ${bunny2.y} - ${bunny2.y2}`, fontSyle);
    //txtBunny2.x = 50;
    //txtBunny2.y = 300;
    //app.stage.addChild(txtBunny2);

    //food.push(bunny2)
    //app.stage.addChild(bunny2)

    //const bunny3 = PIXI.Sprite.from('https://pixijs.com/assets/bunny.png');


    ////bunny.anchor.set(0.5);
    //bunny3.x = snakeSegments[0].x
    //bunny3.y = snakeSegments[0].y - 300
    //bunny3.x2 = bunny2.x + foodWidth;
    //bunny3.y2 = bunny2.y + foodHeight;

    //const txtBunny3 = new PIXI.Text(`${bunny2.x} - ${bunny2.x2}, ${bunny2.y} - ${bunny2.y2}`, fontSyle);
    //txtBunny3.x = 50;
    //txtBunny3.y = 300;
    //app.stage.addChild(txtBunny3);

    //food.push(bunny3)
    //app.stage.addChild(bunny3)



    for (let i = 0; i < 4; i++)
    {
        const bunny = PIXI.Sprite.from('https://pixijs.com/assets/bunny.png');


        //bunny.anchor.set(0.5);
        bunny.x = getRandomInt(appWidth)
        bunny.y = getRandomInt(appHeight)
        ensureIsNotOverSnake(bunny);

        bunny.x1 = bunny.x - (foodWidth / 2)
        bunny.x2 = bunny.x + (foodWidth / 2);
        bunny.y1 = bunny.y - (foodHeight / 2)
        bunny.y2 = bunny.y + (foodHeight / 2)

        const txtBunny = new PIXI.Text(`${bunny.x1} - ${bunny.x2}, ${bunny.y1} - ${bunny.y2}`, fontSyle);
        txtBunny.x = bunny.x1
        txtBunny.y = bunny.y1;
        app.stage.addChild(txtBunny);

        food.push(bunny)
        app.stage.addChild(bunny)

    }

    function ensureIsNotOverSnake(bunny)
    {
        for (const snake of snakeSegments)
        {
            if (doesIntersect(snake, bunny))
            {
                console.log('bunny was over snake, getting new position')
                bunny.x = getRandomInt(appWidth)
                bunny.y = getRandomInt(appHeight)
                ensureIsNotOverSnake(bunny)
                break;
            }
        }
    }
}

function getRandomInt(max)
{
    return Math.floor(Math.random() * max);
}

function stopGame()
{
    app.ticker.destroy();
}


function setParentSnakePositions(direction)
{

    let snakePos = { x: snakeSegments[0].x, y: snakeSegments[0].y, direction: direction }

    for (const [index, segment] of snakeSegments.entries())
    {
        if (index != 0)
        {
            segment.turnPositions.push(snakePos)
        }
    }

}

function removeParentSnakePosition(index, resetSnakePosition = false)
{

    snakeSegments[index].turnPositions.shift();
    resetSnakeBody(index, resetSnakePosition);
}

function getParentSnakePosition(index)
{

    let parent = snakeSegments[index];

    return parent.turnPositions[0]
}

function resetSnakeBody(index, forceReset = false)
{
    if (snakeSegments[index].turnPositions.length > 0 && !forceReset)
        return;

    let snakeHeadPos = { x: snakeSegments[0].x, y: snakeSegments[0].y }


    if (directionMoving.left)
    {
        snakeSegments[index].x = snakeHeadPos.x + (snakeSegmentWidth * index) - speed;
        snakeSegments[index].y = snakeHeadPos.y;

    }
    else if (directionMoving.right)
    {
        snakeSegments[index].x = snakeHeadPos.x - (snakeSegmentWidth * index) + speed;
        snakeSegments[index].y = snakeHeadPos.y;
    }
    else if (directionMoving.up)
    {
        snakeSegments[index].y = snakeHeadPos.y + (snakeSegmentHeight * index) - speed;
        snakeSegments[index].x = snakeHeadPos.x;
    }
    else if (directionMoving.down)
    {
        snakeSegments[index].y = snakeHeadPos.y - (snakeSegmentHeight * index) + speed
        snakeSegments[index].x = snakeHeadPos.x;
    }
}

function notMovingOtherDirection()
{
    return !directionMoving.left && !directionMoving.right && !directionMoving.up && !directionMoving.down
}

//snake head must be outside of the area it was in when it last turned
function canTurn()
{
    if (snakeSegments.length == 1)
        return true;

    let parentPos = snakeSegments[1].turnPositions[0]

    if (parentPos == null)
        return true;


    parentPos.x2 = parentPos.x + snakeSegmentWidth;
    parentPos.y2 = parentPos.y + snakeSegmentHeight;


    if (directionMoving.up)
    {
        if (lastDirection_horz == "left")
        {
            return snakeSegments[0].x < parentPos.x
        }
    }



    return true;
}

function clearParentPositions()
{
    for (const [index, segment] of snakeSegments.entries())
    {
        segment.turnPositions = [];
    }
}

function keyboard(value)
{
    const key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = (event) =>
    {
        if (event.key === key.value)
        {
            if (key.isUp && key.press)
            {
                key.press();
            }
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = (event) =>
    {
        if (event.key === key.value)
        {
            if (key.isDown && key.release)
            {
                key.release();
            }
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener("keydown", downListener, false);
    window.addEventListener("keyup", upListener, false);

    // Detach event listeners
    key.unsubscribe = () =>
    {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };

    return key;
}

const right = keyboard("ArrowRight");
const left = keyboard("ArrowLeft");
const up = keyboard("ArrowUp");
const down = keyboard("ArrowDown");

right.press = () =>
{
    //if(notMovingOtherDirection())
    directionMoving.right = true;

    //if (lastDirection_horz == "right")
    //    clearParentPositions();
};

left.press = () =>
{

    //if(notMovingOtherDirection())
    directionMoving.left = true;

    //if (lastDirection_horz == "left")
    //    clearParentPositions();
}

up.press = () =>
{
    //if(notMovingOtherDirection())
    directionMoving.up = true;

    //if (lastDirection_vert == "up")
    //    clearParentPositions();
};

down.press = () =>
{
    //if(notMovingOtherDirection())
    directionMoving.down = true;

    //if (lastDirection_vert == "down")
    //    clearParentPositions();
}

right.release = () =>
{
    directionMoving.right = false;
    lastDirection_horz = 'right'
    setParentSnakePositions('right')


};
left.release = () =>
{
    lastDirection_horz = 'left'
    directionMoving.left = false;
    setParentSnakePositions('left')


};



up.release = () =>
{
    directionMoving.up = false;
    lastDirection_vert = 'up'
    setParentSnakePositions('up')


};

down.release = () =>
{
    directionMoving.down = false;
    lastDirection_vert = 'down'
    setParentSnakePositions('down')


};

function showDebugInfo()
{
    let turnPositions = snakeSegments.map(function (s) { return s.turnPositions })
    console.log(turnPositions)
    //console.log(snakeHeadPositions);
    //canTurn();

    let snakeMoves = snakeSegments.map(function (s) { return s.moves })
    console.log('snake moves')
    console.log(snakeMoves);
}

function showParticles(x, y)
{

    const cnt = new PIXI.ParticleContainer();
    app.stage.addChild(cnt);

    const emitter = new PIXI.particles.Emitter(cnt, {
        lifetime: { min: 0.1, max: 2 },
        emit: true,
        frequency: 1,
        spawnChance: .5,
        particlesPerWave: 15,
        emitterLifetime: 1.5,
        maxParticles: 50,
        pos: { x: x, y: y },
        autoUpdate: true,
        addAtBack: true,
        behaviors: [
            {
                type: 'spawnPoint',
                config: {}
            },
            //{
            //    type: 'spawnShape',
            //    config: { type: 'torus', data: { radius: 42, innerRadius: 20, affectRotation: true } },
            //},
            { type: 'moveSpeedStatic', config: { min: 50, max: 500 } },
            { type: 'spawnBurst', config: { start: 0, spacing: 45, distance: 30, } },
            { type: 'textureSingle', config: { texture: PIXI.Texture.WHITE } },
            /*  { type: 'spawnBurst', config: { start: 0, spacing: 45, distance: 30, } }*/
            {
                type: 'colorStatic',
                config: {
                    color: "#ff0000"
                },
            },
            {
                type: 'alphaStatic',
                config: {
                    alpha: 0.75
                },
            },
        ],

    });


    setTimeout(function ()
    {
        emitter.cleanup();
        emitter.destroy();
    }, 3000)
}

function logSnakeMoves()
{
    let direction = null;
    if (directionMoving.left)
        direction = 'L'
    else if (directionMoving.right)
        direction = 'R'
    else if (directionMoving.up)
        direction = 'U'
    else if (directionMoving.down)
        direction = 'D'

    if (direction == null)
        return;

    for (const [index, segment] of snakeSegments.entries())
    {

        segment.moves.push({ x: segment.x, y: segment.y, direction: direction })
    }
}

function clearMoves()
{
    for (const [index, segment] of snakeSegments.entries())
    {
        segment.moves = []
    }
}