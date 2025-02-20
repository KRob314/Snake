


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
    bullet: { width: 20, height: 10, xSpeed: 6, ySpeed: 0, rotationSpeed: 0, fireOffsetX: 115, fireOffsetY: 45, damage: 10 },
    missile: { width: 50, height: 15, xSpeed: 6, ySpeed: 3, rotationSpeed: .003, fireOffsetX: 80, fireOffsetY: 45, damage: 25 },
    bomb: { width: 10, height: 15, xSpeed: 0, ySpeed: 6, rotationSpeed: .003, fireOffsetX: 80, fireOffsetY: 45, damage: 30 },
    glideBomb: { width: 50, height: 50, xSpeed: 3.5, ySpeed: 3.5, rotationSpeed: -.003, fireOffsetX: 80, fireOffsetY: 45, damage: 40 }
}
let projectileXRotationModifier = 0;
let projectileYRotationModifier = 0
let projectileFireOffsetXModifier = 0
let projectileFireOffsetYModifier = 0

let enemyType = { AIR: 'air', GROUND: 'ground' }
let enemyConfigs = { SPEED: 1 }
let playerPitch = 0;

let fontStyle = { fontSize: 24, wordWrap: false };
let windSpeed = 0;
let gameSpeed = 2;

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

let player = PIXI.Sprite.from('/images/mc/jet-sm.png');
//jet.anchor.set(0.5);
player.x = 50
player.height = 75
player.width = 150
player.y = 50
player.health = 100;
addHealthbar(player, enemyType.AIR);
player.healthbar.y = 55;
player.healthbar.x = 40;

if (debugMode)
{
    const txtPlayerLabel = new PIXI.Text(`${player.x} - ${player.y}`, { fontSize: 16, fill: '#FFF' });

    txtPlayerLabel.x = player.x;
    txtPlayerLabel.y = player.y;
    txtPlayerLabel.text = `${player.x} - ${player.y}`;
    player.label = txtPlayerLabel
    app.stage.addChild(txtPlayerLabel);
}

app.stage.addChild(player)

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
    drawPlayer();
    drawProjectiles();
    checkProjectileHit();
    drawEnemies();

    drawBackground()

}

function drawPlayer()
{
    player.rotation += playerPitch;

    if (player.rotation <= 0)
    {
        playerPitch = 0;
        player.rotation = 0
    }

    if (player.rotation > .5)
    {
        playerPitch = 0
    }

    if (debugMode)
    {
        if (player.rotation > 0)
        {
            if (player.rotation > 0 && player.rotation < .1)
            {
                player.label.text = `${player.x} - ${player.y}, < .1`
            }
            else if (player.rotation >= .1 && player.rotation < .2)
            {
                player.label.text = `${player.x} - ${player.y}, .1`
            }
            else if (player.rotation >= .2 && player.rotation < .3)
            {
                player.label.text = `${player.x} - ${player.y}, .2`
            }
            else if (player.rotation >= .3 && player.rotation < .4)
            {
                player.label.text = `${player.x} - ${player.y}, .3`
            }
            else if (player.rotation >= .4 && player.rotation < .5)
            {
                player.label.text = `${player.x} - ${player.y}, .4`
            }
        }

    }


    updateHealthbar(player);

}

function drawEnemies()
{
    for (const enemy of enemies.filter(function (eny) { return eny.visible }))
    {
        enemy.x -= enemyConfigs.SPEED * gameSpeed;

        if (enemy.label)
        {
            enemy.label.text = `${enemy.x} - ${enemy.x2()}, ${enemy.y} - ${enemy.y2()}`;
            enemy.label.x = enemy.x;
            enemy.label.y = enemy.y;
        }

        enemy.healthbar.x = enemy.x;


        updateHealthbar(enemy);
        //else if (enemy.health < 50 )
        //{

        //}


        //made it to player
        if (enemy.x <= player.x)
        {
            enemy.visible = false;
            enemy.healthbar.visible = false
            player.health -= enemy.damage;

            showParticlesSM(player.x + 50, player.y);
        }
    }
}

function drawBackground()
{
    background.x -= 1 * speed * gameSpeed;
    background2.x -= 1 * speed * gameSpeed;

    if (background.x <= -appWidth)
        background.x = appWidth;

    if (background2.x <= -appWidth)
        background2.x = appWidth;

}

function drawProjectiles()
{
    adjustProjectilesForPlayerRotation();

    for (const projectile of projectiles.filter(function (p) { return p.visible }))
    {
        projectile.x += projectile.xSpeed + windSpeed * gameSpeed
        projectile.y += projectile.ySpeed * gameSpeed
        projectile.rotation += projectile.rotationSpeed * gameSpeed;


        if (debugMode)
        {
            projectile.label.text = `${projectile.x} - ${projectile.x2()}, ${projectile.y} - ${projectile.y2()}`
            projectile.label.x = projectile.x;
            projectile.label.y = projectile.y
        }

        if (projectile.y >= appHeight - (projectile.height) || projectile.x >= appWidth)
        {
            projectile.visible = false;
            projectiles.shift();
        }
    }
}

function adjustProjectilesForPlayerRotation()
{
    if (player.rotation == 0)
    {
        projectileYRotationModifier = 0;
        projectileXRotationModifier = 0;
        projectileFireOffsetYModifier = 0;
        projectileFireOffsetXModifier = 0;
    }

    if (player.rotation > 0 && player.rotation < .1)
    {
        projectileYRotationModifier = 0;
        projectileXRotationModifier = 0;
        projectileFireOffsetYModifier = 0;
        projectileFireOffsetXModifier = 0;
    }
    else if (player.rotation >= .1 && player.rotation < .2)
    {
        projectileYRotationModifier = 0;
        projectileXRotationModifier = 0;
        projectileFireOffsetYModifier = 0;
        projectileFireOffsetXModifier = 0;
    }
    else if (player.rotation >= .2 && player.rotation < .3)
    {
        projectileYRotationModifier = 0;
        projectileXRotationModifier = 0;
        projectileFireOffsetYModifier = 0;
        projectileFireOffsetXModifier = 0;
    }
    else if (player.rotation >= .3 && player.rotation < .4)
    {
        projectileYRotationModifier = 0;
        projectileXRotationModifier = 0;
        projectileFireOffsetYModifier = 0;
        projectileFireOffsetXModifier = 0;
    }
    else if (player.rotation >= .4)
    {
        projectileYRotationModifier = 5;
        projectileXRotationModifier = 0;
        projectileFireOffsetYModifier = 45;
        projectileFireOffsetXModifier = 0;
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
                enemy.health -= projectile.damage;

                setTimeout(function () { projectile.destroy(); }, 500)

                if (enemy.health < 1)
                {
                    enemy.visible = false;
                    enemy.healthbar.destroy();
                    showParticlesLG(enemy.x, enemy.y);
                    addEnemyJet();

                    setTimeout(function ()
                    {
                        enemy.destroy();
                        cleanUp();
                    }, 500)
                }


            }
        }
    }
}

function increaseWindSpeed()
{
    windSpeed += .1
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
    projectile.x = player.x + projectileConfigs.bullet.fireOffsetX + projectileFireOffsetXModifier;
    projectile.y = player.y + projectileConfigs.bullet.fireOffsetY + projectileFireOffsetYModifier;
    projectile.endFill();
    projectile.xSpeed = projectileConfigs.bullet.xSpeed + projectileXRotationModifier
    projectile.ySpeed = projectileConfigs.bullet.ySpeed + projectileYRotationModifier
    projectile.rotationSpeed = projectileConfigs.bullet.rotationSpeed;
    projectile.x2 = () => projectile.x + projectileConfigs.bullet.width
    projectile.y2 = () => projectile.y + projectileConfigs.bullet.height
    projectile.damage = projectileConfigs.bullet.damage;

    projectile.rotation = player.rotation
    app.stage.addChild(projectile);

    projectiles.push(projectile);

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
    projectile.x = player.x + 80
    projectile.y = player.y + 85
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
    projectile.x = player.x + 85
    projectile.y = player.y + 85
    projectile.endFill();
    projectile.xSpeed = projectileConfigs.bomb.xSpeed;
    projectile.ySpeed = projectileConfigs.bomb.ySpeed;
    projectile.rotationSpeed = projectileConfigs.bomb.rotationSpeed;
    projectile.damage = projectileConfigs.bomb.damage;
    projectile.x2 = () => projectile.x + projectileConfigs.bomb.width
    projectile.y2 = () => projectile.y + projectileConfigs.bomb.height

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
    let projectile = PIXI.Sprite.from('/images/mc/bomb.png');

    //var projectile = new PIXI.Graphics();

    //projectile.beginFill('#000');
    // projectile.drawRect(0, 0, 25, 100)
    projectile.x = player.x + 80
    projectile.y = player.y + 85
    //projectile.endFill();
    projectile.width = projectileConfigs.glideBomb.width;
    projectile.height = projectileConfigs.glideBomb.height;
    projectile.xSpeed = projectileConfigs.glideBomb.xSpeed;
    projectile.ySpeed = projectileConfigs.glideBomb.ySpeed;
    projectile.rotationSpeed = projectileConfigs.glideBomb.rotationSpeed;
    projectile.damage = projectileConfigs.glideBomb.damage;
    projectile.x2 = () => projectile.x + projectileConfigs.glideBomb.width
    projectile.y2 = () => projectile.y + projectileConfigs.glideBomb.height
    projectile.rotation = -1
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
    jet.health = 100
    jet.enemyId = getEnemyId();
    jet.dealDamage = (dmg) => health = health - dmg;
    jet.isDead = () => hitPoints > 0;
    jet.damage = 50;
    enemies.push(jet);
    app.stage.addChild(jet)

    addHealthbar(jet, enemyType.AIR)

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
    tank.health = 100
    tank.enemyId = getEnemyId();
    tank.dealDamage = (dmg) => health = health - dmg;
    tank.damage = 25;
    tank.isDead = () => hitPoints > 0;

    addHealthbar(tank, enemyType.GROUND);


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

function addHealthbar(enemy, typeOfEnemy)
{
    const healthbarContainer = new PIXI.Container();

    if (typeOfEnemy == enemyType.GROUND)
    {
        healthbarContainer.x = enemy.x + enemy.width
        healthbarContainer.y = enemy.y + (enemy.height * .80)
    }
    else
    {
        healthbarContainer.x = enemy.x
        healthbarContainer.y = enemy.y
    }

    var healthbar_green = new PIXI.Graphics();
    healthbar_green.beginFill('#006b3c');
    healthbar_green.drawRect(0, 0, enemy.width * .6, 8)
    healthbar_green.x = 50
    healthbar_green.y = 0
    healthbar_green.endFill();
    healthbar_green.visible = true;

    var healthbar_yellow = new PIXI.Graphics();
    healthbar_yellow.beginFill('#e4d00a');
    healthbar_yellow.drawRect(0, 0, healthbar_green.width * .75, 8)
    healthbar_yellow.x = healthbar_green.x
    healthbar_yellow.y = healthbar_green.y
    healthbar_yellow.endFill();
    healthbar_yellow.visible = true;

    var healthbar_orange = new PIXI.Graphics();
    healthbar_orange.beginFill('#ed872d');
    healthbar_orange.drawRect(0, 0, healthbar_yellow.width * .75, 8)
    healthbar_orange.x = healthbar_green.x
    healthbar_orange.y = healthbar_green.y
    healthbar_orange.endFill();
    healthbar_orange.visible = true;

    var healthbar_red = new PIXI.Graphics();
    healthbar_red.beginFill('#e03c31');
    healthbar_red.drawRect(0, 0, healthbar_orange.width * .75, 8)
    healthbar_red.x = healthbar_green.x
    healthbar_red.y = healthbar_green.y
    healthbar_red.endFill();
    healthbar_red.visible = true;


    healthbarContainer.addChild(healthbar_red)
    healthbarContainer.addChild(healthbar_orange)
    healthbarContainer.addChild(healthbar_yellow)
    healthbarContainer.addChild(healthbar_green)

    enemy.healthbar = healthbarContainer;

    app.stage.addChild(healthbarContainer);

}

function updateHealthbar(player)
{
    if (player.health < 100 && player.healthbar.children[3].visible)
    {
        player.healthbar.children[3].visible = false;
    }
    else if (player.health < 75 && player.healthbar.children[2].visible)
    {
        player.healthbar.children[2].visible = false;
    }
    else if (player.health < 50 && player.healthbar.children[1].visible)
    {
        player.healthbar.children[1].visible = false;
    }
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
        //let enemyToSpawn = getRandomInt(1, 5);

        addEnemyJet();
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
const d = keyboard("d");

d.press = () => playerPitch = .004;


d.release = () => playerPitch = -.004

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
    console.log(player.rotation)
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