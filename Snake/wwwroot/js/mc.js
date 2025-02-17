


let appHeight = window.innerHeight - 25;
let appWidth = window.innerWidth - 25
let obj1SegmentHeight = 25;
let obj1SegmentWidth = 25;
let directionMoving = { left: false, right: false, up: false, down: false }
let speed = 2;
let backgrounds = [];
let projectiles = []
let enemies = [];
let debugMode = true;
let roadY = appHeight - 150;
let projectileConfigs = {
    bullet: { width: 30, height: 15, xSpeed: 6, ySpeed: 0, rotationSpeed: 0, fireOffsetX: 115, fireOffsetY: 45, damage: 10 },
    missile: { width: 50, height: 15, xSpeed: 6, ySpeed: 3, rotationSpeed: .003, fireOffsetX: 80, fireOffsetY: 45, damage: 15 }
}
let enemyType = { AIR: 'air', GROUND: 'ground' }
let enemyConfigs = { SPEED: 1 }

let fontStyle = { fontSize: 24, wordWrap: false };

const app = new PIXI.Application({
    background: '#1099bb',
    width: appWidth,
    height: appHeight
});
let enemyId = 0;

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
//jet.anchor.set(0.5);
jet.x = 50
jet.height = 75
jet.width = 150
jet.y = 50

app.stage.addChild(jet)

if (debugMode)
{
    const grid = new PixiJSGrid(appWidth).drawGrid();
    app.stage.addChild(grid);
}




//addEnemyJet()

addEnemyTank();
addEnemyTank();
addEnemyTank();
addEnemyTank();
//showInstructions();
startGame();

function gameLoop()
{

    drawProjectiles();
    drawEnemies();
    checkProjectileHit();
    //drawBackground()

}

function drawEnemies()
{
    for (const enemy of enemies.filter(function (eny) { return eny.visible }))
    {
        enemy.x -= enemyConfigs.SPEED

        if (enemy.label)
        {
            enemy.label.text = `${enemy.x} - ${enemy.x2()}, ${enemy.y} - ${enemy.y2()}`;
            enemy.label.x = enemy.x;
            enemy.label.y = enemy.y;
        }
    }
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
    for (const projectile of projectiles.filter(function (p) { return p.visible }))
    {
        projectile.x += projectile.xSpeed;
        projectile.y += projectile.ySpeed;
        projectile.rotation += projectile.rotationSpeed;


        projectile.label.text = `${projectile.x} - ${projectile.x2()}, ${projectile.y} - ${projectile.y2()}`
        projectile.label.x = projectile.x;
        projectile.label.y = projectile.y

        if (projectile.y >= appHeight - (projectile.height) || projectile.x >= appWidth)
        {
            projectile.visible = false;
            projectiles.shift();
        }
    }
}

function checkProjectileHit()
{
    for (const projectile of projectiles.filter(function (p) { return p.visible }))
    {

        for (const enemy of enemies.filter(function (eny) { return eny.visible }))
        {
            if (doesIntersect(projectile, enemy))
            {
                projectile.visible = false;
                showParticlesSM(projectile.x, projectile.y);
                enemy.hitPoints -= projectile.damage;

                setTimeout(function () {  projectile.destroy();},500)

                if (enemy.hitPoints < 1)
                {
                    enemy.visible = false;
                    showParticlesLG(enemy.x, enemy.y);

                    setTimeout(function ()
                    {
                        enemy.destroy();     
                        cleanUp();
                    }, 500)
                }


            }
        }
    }

    console.log(projectiles)
    console.log(enemies)

}

function addBackground()
{

}

function fireBullets()
{
    var projectile = new PIXI.Graphics();


    projectile.beginFill('#000');
    projectile.drawRoundedRect(0, 0, projectileConfigs.bullet.width, projectileConfigs.bullet.height)
    projectile.drawRect(0, 0, projectileConfigs.bullet.height, projectileConfigs.bullet.height)
    projectile.x = jet.x + projectileConfigs.bullet.fireOffsetX
    projectile.y = jet.y + projectileConfigs.bullet.fireOffsetY
    projectile.endFill();
    projectile.xSpeed = projectileConfigs.bullet.xSpeed;
    projectile.ySpeed = projectileConfigs.bullet.ySpeed;
    projectile.rotationSpeed = projectileConfigs.bullet.rotationSpeed;
    projectile.x2 = () => projectile.x + projectileConfigs.bullet.width
    projectile.y2 = () => projectile.y + projectileConfigs.bullet.height
    projectile.damage = projectileConfigs.bullet.damage;

    app.stage.addChild(projectile);

    var border = new PIXI.Graphics();

    border.beginFill('#FF2D2E');
    border.drawRect(0, 0, 30, 15)
    border.x = projectile.x
    border.y = projectile.y
    border.endFill();

    projectiles.push(projectile);
    app.stage.addChild(border);

    if (debugMode)
    {
        const txtProjectileLabel = new PIXI.Text(`${projectile.x} - ${projectile.y}`, fontStyle);

        txtProjectileLabel.x = projectile.x;
        txtProjectileLabel.y = projectile.y;
        txtProjectileLabel.text = `${projectile.x} - ${projectile.y}`;
        projectile.label = txtProjectileLabel
        app.stage.addChild(txtProjectileLabel);


    }
}

function dropMissile()
{
    var projectile = new PIXI.Graphics();

    projectile.beginFill('#000');
    projectile.drawRoundedRect(0, 0, projectileConfigs.missile.width, projectileConfigs.missile.height)
    projectile.drawRect(0, -5, 15, 25)
    projectile.x = jet.x + 80
    projectile.y = jet.y + 85
    projectile.x2 = () => projectile.x + projectileConfigs.missile.width
    projectile.y2 = () => projectile.y + projectileConfigs.missile.height
    projectile.endFill();
    projectile.xSpeed = projectileConfigs.missile.xSpeed;
    projectile.ySpeed = projectileConfigs.missile.ySpeed;
    projectile.rotationSpeed = projectileConfigs.missile.rotationSpeed;
    projectile.damage = projectileConfigs.missile.damage;

    projectiles.push(projectile);
    app.stage.addChild(projectile);

    if (debugMode)
    {
        const txtProjectileLabel = new PIXI.Text(`${projectile.x} - ${projectile.y}`, { fontSize: 16, fill: '#FFF' });

        txtProjectileLabel.x = projectile.x;
        txtProjectileLabel.y = projectile.y;
        txtProjectileLabel.text = `${projectile.x} - ${projectile.y}`;
        projectile.label = txtProjectileLabel
        app.stage.addChild(txtProjectileLabel);
    }
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
    projectile.x2 = () => projectile.x + projectileConfigs.missile.width
    projectile.y2 = () => projectile.y + projectileConfigs.missile.height

    projectiles.push(projectile);
    app.stage.addChild(projectile);

    if (debugMode)
    {
        const txtProjectileLabel = new PIXI.Text(`${projectile.x} - ${projectile.y}`, fontStyle);

        txtProjectileLabel.x = projectile.x;
        txtProjectileLabel.y = projectile.y;
        txtProjectileLabel.text = `${projectile.x} - ${projectile.y}`;
        projectile.label = txtProjectileLabel
        app.stage.addChild(txtProjectileLabel);
    }


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
    projectile.x2 = () => projectile.x + projectileConfigs.missile.width
    projectile.y2 = () => projectile.y + projectileConfigs.missile.height

    projectiles.push(projectile);
    app.stage.addChild(projectile);

    if (debugMode)
    {
        const txtProjectileLabel = new PIXI.Text(`${projectile.x} - ${projectile.y}`, fontStyle);

        txtProjectileLabel.x = projectile.x;
        txtProjectileLabel.y = projectile.y;
        txtProjectileLabel.text = `${projectile.x} - ${projectile.y}`;
        projectile.label = txtProjectileLabel
        app.stage.addChild(txtProjectileLabel);
    }
}

function addEnemyJet()
{
    let jet = PIXI.Sprite.from('/images/mc/jet2.png');
    //bunny.anchor.set(0.5);
    jet.height = 50
    jet.width = 100
    jet.height = 50
    jet.x = appWidth - 500;
    jet.x2 = jet.x + jet.width;
    jet.y = 80
    jet.y1 = () => jet.y
    jet.y2 = () => jet.y + jet.height;
    jet.enemyType = enemyType.AIR
    jet.hitPoints = 50;
    jet.enemyId = getEnemyId();
    jet.dealDamage = (dmg) => hitPoints = hitPoints - dmg;
    jet.isDead = () => hitPoints > 0;
    enemies.push(jet);
    app.stage.addChild(jet)

    if (debugMode)
    {
        //const txtProjectileLabel = new PIXI.Text(`${jet.x} - ${jet.x2}, ${jet.y} - ${jet.y2}`, fontStyle);

        //txtProjectileLabel.x = jet.x;
        //txtProjectileLabel.y = jet.y;
        //jet.label = txtProjectileLabel
        //app.stage.addChild(txtProjectileLabel);
    }
}

function addEnemyTank()
{
    let currentTanks = enemies.filter(function (eny) { return eny.enemyType == enemyType.GROUND })
    let spawnX = appWidth;

    if (currentTanks.length > 0)
    {
        let lastTank = currentTanks[currentTanks.length - 1];
        spawnX = lastTank.x2()
    }

    let tank = PIXI.Sprite.from('/images/mc/tank2.png');
    //bunny.anchor.set(0.5);
    //jet.height = 50
    tank.width = 200
    tank.height = 120
    tank.x = spawnX;
    tank.x2 = () => tank.x + tank.width;
    tank.y = roadY;
    tank.y1 = () => tank.y + 75
    tank.y2 = () => tank.y + tank.height;
    tank.enemyType = enemyType.GROUND
    tank.hitPoints = 50;
    tank.enemyId = getEnemyId();
    tank.dealDamage = (dmg) => hitPoints = hitPoints - dmg;
    tank.isDead = () => hitPoints > 0;

    if (debugMode)
    {
        const txtProjectileLabel = new PIXI.Text(`${tank.x} - ${tank.y}`, { fontSize: 16, wordWrap: true, wordWrapWidth: tank.width });

        txtProjectileLabel.x = tank.x;
        txtProjectileLabel.y = tank.y;
        txtProjectileLabel.text = `${tank.x} - ${tank.y}`;
        tank.label = txtProjectileLabel
        app.stage.addChild(txtProjectileLabel);
    }

    app.stage.addChild(tank)
    enemies.push(tank);
}

function doesIntersect(projectile, enemy)
{
    return doesIntersectX(projectile, enemy, enemy.enemyType) && doesIntersectY(projectile, enemy, enemy.enemyType);

    function doesIntersectX(obj1, obj2, typeOfEnemy)
    {
        //console.log('doesIntersectX()')
        if (typeOfEnemy == enemyType.AIR)
        {
            if (obj1.x >= obj2.x)
            {
                return true;
            }
        }
        else
        {
            if (isWithIn(obj1.x, obj2.x, obj2.x2()))
            {

                return true;
            }
        }

        return false;
    }

    function doesIntersectY(obj1, obj2, typeOfEnemy) 
    {
        //console.log('doesIntersectY()')
        if (typeOfEnemy == enemyType.AIR)
        {
            if (isWithinDistance(obj1.y, obj2.y, 20))
            {
                console.log('true 2')
                return true;
            }
        }
        else
        {
            if (isWithIn(obj1.y, obj2.y1(), obj2.y2()))
            {
                /* console.log('true')*/
                //debugger;
                return true;
            }
        }

        return false;

    }
}

function isWithinDistance(point1, point2, distance)
{
    console.log(Math.abs(point1 - point2))
    return Math.abs(point1 - point2) < distance;
}

function isWithIn(pointToTest, pointMin, pointMax)
{
    return pointToTest >= pointMin && pointToTest <= pointMax
}

function showParticlesSM(x, y)
{

    const cnt = new PIXI.ParticleContainer();
    app.stage.addChild(cnt);

    const emitter = new PIXI.particles.Emitter(cnt, {
        lifetime: { min: 0.1, max: 2 },
        emit: true,
        frequency: 1,
        spawnChance: 1,
        particlesPerWave: 15,
        emitterLifetime: 1.5,
        maxParticles: 25,
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
            { type: 'spawnBurst', config: { start: 0, spacing: 45, distance: 10, } },
            { type: 'textureSingle', config: { texture: PIXI.Texture.WHITE } },
            /*  { type: 'spawnBurst', config: { start: 0, spacing: 45, distance: 30, } }*/
            { type: 'colorStatic', config: { color: "#fff600" }, },
            { type: 'alphaStatic', config: { alpha: 0.75 }, },
            { type: 'scale', config: { scale: { list: [{ value: 0.1, time: 0 }, { value: .4, time: 0.3 }, { value: 0.1, time: 1 }] } } }
        ],

    });


    setTimeout(function ()
    {
        emitter.emit = false;
        emitter.cleanup();
        emitter.destroy();
    }, 1500)
}

function showParticlesLG(x, y)
{

    const cnt = new PIXI.ParticleContainer();
    app.stage.addChild(cnt);

    const emitter = new PIXI.particles.Emitter(cnt, {
        lifetime: { min: 0.1, max: 2 },
        emit: true,
        frequency: 1,
        spawnChance: 1,
        particlesPerWave: 15,
        emitterLifetime: 1.5,
        maxParticles: 25,
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
            { type: 'spawnBurst', config: { start: 0, spacing: 45, distance: 10, } },
            { type: 'textureSingle', config: { texture: PIXI.Texture.WHITE } },
            /*  { type: 'spawnBurst', config: { start: 0, spacing: 45, distance: 30, } }*/
            { type: 'colorStatic', config: { color: "#ff0000" }, },
            { type: 'alphaStatic', config: { alpha: 0.75 }, },
            { type: 'scale', config: { scale: { list: [{ value: 0.1, time: 0 }, { value: 1, time: 0.9 }, { value: 0.5, time: 1.2 }] } } }
        ],

    });


    setTimeout(function ()
    {
        emitter.emit = false;
        emitter.cleanup();
        emitter.destroy();
    }, 1500)
}

function addEnemy()
{
    let currentEnemyCount = enemies.filter(function (eny) { return eny.visible });

    if (currentEnemyCount < 2)
    {
        let enemyToSpawn = getRandomInt(1, 5);


    }


}



function getRandomInt(min, max)
{
    return Math.round(Math.random() * (max - min)) + min;
}

function getRandomBool()
{
    return getRandomInt(0, 1) == 1
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

up.press = () =>
{
    fireBullets();
};

function stopGame()
{
    console.log(app.ticker);
    app.ticker.destroy();
}

function startGame()
{
    app.ticker.add((delta) =>
    {

        // delta is 1 if running at 100% performance
        // creates frame-independent transformation
        //bunny.rotation += 0.01 * delta;
        gameLoop()
    });
}

function showInstructions()
{
    let instructionText = ">: shoot "
    const txtInstructionsLabel = new PIXI.Text(instructionText, { fontFamily: ['Helvetica', 'Arial', 'sans-serif'], fontSize: 35, wordWrap: true, fill: '#000' });
    txtInstructionsLabel.x = 50
    txtInstructionsLabel.y = 50
    app.stage.addChild(txtInstructionsLabel)

}

function getEnemyId()
{
    enemyId += 1;
    return enemyId
}

function cleanUp()
{
    projectiles = projectiles.filter(function (p) { return p.visible });
    enemies = enemies.filter(function (eny) { return eny.visible });
}