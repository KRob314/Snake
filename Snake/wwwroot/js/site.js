let snakeSegments = []
let food = [];
let foodHeight = 37;
let foodWidth = 26;
let appHeight = window.innerHeight;
let appWidth = window.innerWidth
let snakeSegmentHeight = 50;
let snakeSegmentWidth = 50;
let directionMoving = { left: false, right: false, up: false, down: false }
let lastDirection_vert = null;
let lastDirection_horz = null
let firstSnakeSegmentPos = null;
let snakeHeadPositions = [];

let fontSyle = { fontSize: 20 }

const app = new PIXI.Application({
    background: '#1099bb',
    resizeTo: window,
});


document.body.appendChild(app.view);


var bTemp = new PIXI.Graphics();
bTemp.beginFill(0x66CCFF);
bTemp.drawRect(0, 0, 50, 50);
bTemp.x = appWidth - (snakeSegmentWidth * 2)
bTemp.y = appHeight - (snakeSegmentHeight * 2)
bTemp.endFill();
bTemp.turnPositions = [];


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
    //moveSnake2();
    checkBounds()
    checkIfAtFood();
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
                segment.x -= 1
                continue;
            }

            let parentSnakePos = getParentSnakePosition(index);
            segment.snakeLabel.text = `${segment.x} - ${segment.y}`
            segment.snakeLabel.x = segment.x;
            segment.snakeLabel.y = segment.y;

            if (parentSnakePos == null)
            {
                segment.x -= 1;
                console.log('a')
                continue;
            }

            if (lastDirection_vert == "up")
            {
                if (index > 0 && segment.y >= parentSnakePos.y)
                {
                    console.log('b')
                    segment.y -= 1
                }
                else if (index > 0 && segment.y <= parentSnakePos.y)
                {
                    console.log('c')
                    segment.x -= 1
                    removeParentSnakePosition(index);
                   
                }
            }
            else if (lastDirection_vert == "down")
            {
                if (index > 0 && segment.y <= parentSnakePos.y)
                {
                    segment.y += 1
                }
                else if (index > 0 && segment.y >= parentSnakePos.y)
                {
                    segment.x -= 1
                    removeParentSnakePosition(index);
                }
            }
            else if (lastDirection_horz == null)
            {
                segment.x -= 1
            }

        }
    }
    else if (directionMoving.right)
    {
        for (const [index, segment] of snakeSegments.entries())
        {
            if (index == 0)
            {
                segment.x += 1
                continue;
            }

            let parentSnakePos = getParentSnakePosition(index);
                        segment.snakeLabel.text = `${segment.x} - ${segment.y}`
            segment.snakeLabel.x = segment.x;
            segment.snakeLabel.y = segment.y;


            if (parentSnakePos == null)
            {
                segment.x += 1
                continue;
            }

            if (lastDirection_vert == "up")
            {
                if (index > 0 && segment.y >= parentSnakePos.y)
                {
                    segment.y -= 1
                }
                else if (index > 0 && segment.y <= parentSnakePos.y)
                {
                    segment.x += 1
                    removeParentSnakePosition(index);
                }
            }
            else if (lastDirection_vert == "down")
            {
                if (index > 0 && segment.y <= parentSnakePos.y)
                {
                    segment.y += 1
                }
                else if (index > 0 && segment.y >= parentSnakePos.y)
                {
                    segment.x += 1
                    removeParentSnakePosition(index);
                }
            }
            else if (lastDirection_horz == null)
            {
                segment.x -= 1
            }
        }
    }
    else if (directionMoving.up)
    {
        for (const [index, segment] of snakeSegments.entries())
        {

            if (index == 0)
            {
                segment.y -= 1
                continue;
            }

            let parentSnakePos = getParentSnakePosition(index);
                        segment.snakeLabel.text = `${segment.x} - ${segment.y}`
            segment.snakeLabel.x = segment.x;
            segment.snakeLabel.y = segment.y;

            if (parentSnakePos == null)
            {

                segment.y -= 1
                continue;
            }

            if (lastDirection_horz == "left")
            {

                if (index > 0 && segment.x >= parentSnakePos.x)
                {
                    segment.x -= 1

                }
                else if (index > 0 && segment.x <= parentSnakePos.x)
                {
                    segment.y -= 1
                    removeParentSnakePosition(index)
                }
            }
            if (lastDirection_horz == "right")
            {
                if (index > 0 && segment.x <= parentSnakePos.x)
                {
                    segment.x += 1

                }
                else if (index > 0 && segment.x >= parentSnakePos.x)
                {
                    segment.y -= 1
                    removeParentSnakePosition(index)
                }
            }

            else if (lastDirection_horz == null)
            {
                segment.y -= 1
            }
        }
    }

    else if (directionMoving.down)
    {
        for (const [index, segment] of snakeSegments.entries())
        {
            if (index == 0)
            {
                segment.y += 1
                continue;
            }

            let parentSnakePos = getParentSnakePosition(index);
                        segment.snakeLabel.text = `${segment.x} - ${segment.y}`
            segment.snakeLabel.x = segment.x;
            segment.snakeLabel.y = segment.y;

            if (parentSnakePos == null)
            {
                segment.y += 1
                continue;
            }

            if (lastDirection_horz == "left")
            {
                if (index > 0 && segment.x >= parentSnakePos.x)
                {
                    segment.x -= 1

                }
                else if (index > 0 && segment.x <= parentSnakePos.x)
                {
                    segment.y -= 1
                    removeParentSnakePosition(index)
                }
            }
            if (lastDirection_horz == "right")
            {
                if (index > 0 && segment.x <= parentSnakePos.x)
                {
                    segment.x += 1

                }
                else if (index > 0 && segment.x >= parentSnakePos.x)
                {
                    segment.y += 1
                    removeParentSnakePosition(index)
                }
            }

            else if (lastDirection_horz == null)
            {
                segment.y -= 1
            }
        }
    }


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
    //right side
    if (snakeSegments[0].x + snakeSegmentWidth >= appWidth)
    {
        console.log('out')
    }

    //left side
    if (snakeSegments[0].x <= 0)
    {
        console.log('out')
    }


    //top
    if (snakeSegments[0].y <= 0)
    {
        console.log('out')
    }

    //bottom
    if (snakeSegments[0].y + snakeSegmentHeight >= appHeight)
    {
        console.log('out')
    }
}

function checkIfAtFood()
{
    for (const segment of snakeSegments)
    {
        for (const bunny of food)
        {
            if (bunny.visible && doesIntersectX(segment, bunny) && doesIntersectY(segment, bunny))
            {
                bunny.visible = false;
                growSnake();
            }
        }
    }

    function doesIntersectX(snake, food)
    {
        if (snake.x >= food.x && snake.x <= food.x2)
        {
            return true;
        }

    }

    function doesIntersectY(snake, food) 
    {
        if (snake.y <= food.y2 && snake.y >= food.y)
        {
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

    if (lastDirection_vert == 'up' || directionMoving.up)
    {
        snakeY += snakeSegmentHeight
    }
    else if (lastDirection_vert == 'down' || directionMoving.down)
    {
        snakeY -= snakeSegmentHeight
    }

    var bTemp = new PIXI.Graphics();

    bTemp.beginFill(0x66CCFF);
    bTemp.drawRect(0, 0, 50, 50);
    bTemp.x = snakeX;
    bTemp.y = snakeY;
    bTemp.endFill();
    bTemp.turnPositions = [];
    bTemp.moves = [];

    const txtSnakeLabel = new PIXI.Text(`${bTemp.x} - ${bTemp.y}`, { fontSize:12, wordWrap:true, wordWrapWidth: 25 });

    txtSnakeLabel.x = bTemp.x;
    txtSnakeLabel.y = bTemp.y;
   
    bTemp.snakeLabel = txtSnakeLabel;

    snakeSegments.push(bTemp);
    app.stage.addChild(bTemp);
     app.stage.addChild(txtSnakeLabel);
}





function addFood()
{

    const bunny = PIXI.Sprite.from('https://pixijs.com/assets/bunny.png');


    //bunny.anchor.set(0.5);
    bunny.x = snakeSegments[0].x
    bunny.y = snakeSegments[0].y - 200
    bunny.x2 = bunny.x + foodWidth;
    bunny.y2 = bunny.y + foodHeight;

    const txtBunny = new PIXI.Text(`${bunny.x} - ${bunny.x2}, ${bunny.y} - ${bunny.y2}`, fontSyle);
    txtBunny.x = 50;
    txtBunny.y = 200;
    app.stage.addChild(txtBunny);

    food.push(bunny)
    app.stage.addChild(bunny)


    const bunny2 = PIXI.Sprite.from('https://pixijs.com/assets/bunny.png');


    //bunny.anchor.set(0.5);
    bunny2.x = snakeSegments[0].x
    bunny2.y = snakeSegments[0].y - 100
    bunny2.x2 = bunny2.x + foodWidth;
    bunny2.y2 = bunny2.y + foodHeight;

    const txtBunny2 = new PIXI.Text(`${bunny2.x} - ${bunny2.x2}, ${bunny2.y} - ${bunny2.y2}`, fontSyle);
    txtBunny2.x = 50;
    txtBunny2.y = 300;
    app.stage.addChild(txtBunny2);

    food.push(bunny2)
    app.stage.addChild(bunny2)

    return

    for (let i = 0; i < 15; i++)
    {
        const bunny = PIXI.Sprite.from('https://pixijs.com/assets/bunny.png');


        bunny.anchor.set(0.5);
        bunny.x = getRandomInt(appHeight)
        bunny.y = getRandomInt(appWidth)

        food.push(bunny)
        app.stage.addChild(bunny)

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


function setParentSnakePositions()
{

    let snakePos = { x: snakeSegments[0].x, y: snakeSegments[0].y }

    for (const [index, segment] of snakeSegments.entries())
    {
        if (index != 0)
        {
            segment.turnPositions.push(snakePos)
        }
    }

}

function removeParentSnakePosition(index)
{

    snakeSegments[index].turnPositions.shift();
    resetSnakeBody(index);
}

function getParentSnakePosition(index)
{

    let parent = snakeSegments[index];

    return parent.turnPositions[0]
}

function resetSnakeBody(index)
{
    if (snakeSegments[0].turnPositions.length > 0)
        return;

    let snakeHeadPos = { x: snakeSegments[0].x, y: snakeSegments[0].y }


    if (directionMoving.left)
    {
        snakeSegments[index].x = snakeHeadPos.x + (snakeSegmentWidth * index);
        snakeSegments[index].y = snakeHeadPos.y;

    }
    else if (directionMoving.right)
    {
        snakeSegments[index].x = snakeHeadPos.x - (snakeSegmentWidth * index);
        snakeSegments[index].y = snakeHeadPos.y;
    }
    else if (directionMoving.up)
    {
        snakeSegments[index].y = snakeHeadPos.y + (snakeSegmentHeight * index);
        snakeSegments[index].x = snakeHeadPos.x;
    }
    else if (directionMoving.down)
    {
        snakeSegments[index].y = snakeHeadPos.y - (snakeSegmentHeight * index)
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
    setParentSnakePositions()


};
left.release = () =>
{
    lastDirection_horz = 'left'
    directionMoving.left = false;
    setParentSnakePositions()


};



up.release = () =>
{
    directionMoving.up = false;
    lastDirection_vert = 'up'
    setParentSnakePositions()


};

down.release = () =>
{
    directionMoving.down = false;
    lastDirection_vert = 'down'
    setParentSnakePositions()


};

function showDebugInfo()
{
    let turnPositions = snakeSegments.map(function (s) { return s.turnPositions })
    console.log(turnPositions)
    console.log(snakeHeadPositions);
    canTurn();
}