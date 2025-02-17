


let appHeight = window.innerHeight - 25;
let appWidth = window.innerWidth - 25
let snakeSegmentHeight = 25;
let snakeSegmentWidth = 25;
let directionMoving = { left: false, right: false, up: false, down: false }
let speed = 2;
let backgrounds = [];
let projectiles = []



let fontSyle = { fontSize: 16 }

const app = new PIXI.Application({
    background: '#1099bb',
    width: appWidth,
    height: appHeight
});


document.body.appendChild(app.view);

let background = PIXI.Sprite.from('/images/mc/background4.jpg');
//bunny.anchor.set(0.5);
background.x = 0
background.x2 = background.x + appWidth;
background.y = 0
background.height = appHeight;
background.width = appWidth + 10;
app.stage.addChild(background)
//backgrounds.push(background);

let background2 = PIXI.Sprite.from('/images/mc/background4.jpg');
//bunny.anchor.set(0.5);
background2.x = appWidth
background2.x2 = background2.x + appWidth;
background2.height = appHeight;
background2.y = 0
background2.width = appWidth + 10;
app.stage.addChild(background2)
//backgrounds.push(background2);

let jet = PIXI.Sprite.from('/images/mc/jet-sm.png');
//bunny.anchor.set(0.5);
jet.x = 50
//jet.height = 50
jet.y = 50
jet.width = 300
app.stage.addChild(jet)





app.ticker.add((delta) =>
{

    // delta is 1 if running at 100% performance
    // creates frame-independent transformation
    //bunny.rotation += 0.01 * delta;
    gameLoop()
});

function gameLoop()
{
    drawBackground()
    drawProjectiles();
}

function drawBackground()
{
    background.x -= 1 * speed;
    background2.x -= 1 * speed;

    if (background.x <= -appWidth)
        background.x = appWidth;

    if (background2.x <= -appWidth)
        background2.x = appWidth;

}

function drawProjectiles()
{
    for (const projectile of projectiles)
    {
        projectile.x += projectile.xSpeed;
        projectile.y += projectile.ySpeed;
        projectile.rotation += projectile.rotationSpeed;

        if (projectile.y >= appHeight - projectile.height)
        {
            projectile.visible = false;
            showParticles(projectile.x, projectile.y);
            projectiles.shift();
        }
    }
}

function checkProjectileHit()
{

}

function addBackground()
{

}

function dropMissile()
{
    var projectile = new PIXI.Graphics();

    projectile.beginFill('#000');
    projectile.drawRoundedRect(0, 0, 50, 15)
    projectile.drawRect(0, -5, 15, 25)
    projectile.x = jet.x + 80
    projectile.y = jet.y + 85
    projectile.endFill();
    projectile.xSpeed = 3;
    projectile.ySpeed = 2;
    projectile.rotationSpeed = .001;

   projectiles.push(projectile);
    app.stage.addChild(projectile);
}

function dropBomb()
{
    var projectile = new PIXI.Graphics();

    projectile.beginFill('#000');
    projectile.drawRoundedRect(0, 0, 20, 75, 50)
    projectile.drawRect(-10, 0, 40, 15)
    projectile.x = jet.x + 85
    projectile.y = jet.y + 85
    projectile.endFill();
    projectile.xSpeed = .5;
    projectile.ySpeed = 3;
    projectile.rotationSpeed = 0;

    projectiles.push(projectile);
    app.stage.addChild(projectile);
}
function dropGlideBomb()
{
    var projectile = new PIXI.Graphics();

    projectile.beginFill('#000');
    projectile.drawRect(0, 0, 25, 100)
    projectile.x = jet.x + 80
    projectile.y = jet.y + 85
    projectile.endFill();
    projectile.xSpeed = 1;
    projectile.ySpeed = 1;
    projectile.rotationSpeed = 0;

    projectiles.push(projectile);
    app.stage.addChild(projectile);
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
        emitter.emit = false;
        emitter.cleanup();
        emitter.destroy();
    }, 3000)
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
    dropMissile();
};

down.press = () =>
{
    dropGlideBomb();
};

left.press = () =>
{
    dropBomb();
};