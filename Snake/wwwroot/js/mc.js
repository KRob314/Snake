


let appHeight = window.innerHeight - 25;
let appWidth = window.innerWidth - 25
let obj1SegmentHeight = 25;
let obj1SegmentWidth = 25;
let directionMoving = { left: false, right: false, up: false, down: false }
let speed = 2;
let backgrounds = [];
let projectiles = []
let enemies = [];
let debugMode = false;
let roadY = appHeight - 150;

let projectileConfigs = {
    bullet: { type: 'bullet', enabled: true, width: 20, height: 10, xSpeed: 6, ySpeed: 0, rotationSpeed: 0, fireOffsetX: 115, fireOffsetY: 45, damage: 10, splashDamage: 0, splashDamageRadius: 0, lastTimeFired: performance.now(), fireCooldown: 100, ammoStart: 200, fireOffsetXModifier: 0, fireOffsetYModifier: 0, XRotationModifier: 0, YRotationModifier: 0 },
    missile: {
        type: 'missile', enabled: true, width: 50, height: 15, xSpeed: 8, ySpeed: 0, rotationSpeed: 0, fireOffsetX: 50, fireOffsetY: 45, damage: 30, splashDamage: 0, splashDamageRadius: 0, lastTimeFired: performance.now(), fireCooldown: 500, ammoStart: 25, fireOffsetXModifier: 0, fireOffsetYModifier: 0, XRotationModifier: 0, YRotationModifier: 0, startSequences: [{ x: 0, y: 1.25, untilX: 0, untilY: 20 }, { x: 2, y: -.3, untilX: 150, untilY: -70 }]
    },
    bomb: { type: 'bomb', enabled: true, width: 10, height: 15, xSpeed: 1.5, ySpeed: 6, rotationSpeed: 0, fireOffsetX: 80, fireOffsetY: 45, damage: 100, splashDamage: 20, splashDamageRadius: 500, lastTimeFired: performance.now(), fireCooldown: 500, ammoStart: 12, fireOffsetXModifier: 0, fireOffsetYModifier: 0, XRotationModifier: 0, YRotationModifier: 0 },
    glideBomb: { type: 'glideBomb', enabled: true, width: 50, height: 50, xSpeed: 3.5, ySpeed: 3.5, rotationSpeed: -.003, fireOffsetX: 80, fireOffsetY: 45, damage: 40, splashDamage: 10, splashDamageRadius: 250, lastTimeFired: performance.now(), fireCooldown: 600, ammoStart: 5, fireOffsetXModifier: 0, fireOffsetYModifier: 0, XRotationModifier: 0, YRotationModifier: 0 }
}


let projectileRotationModifier = 0;
let projectileXRotationModifier = 0;
let projectileYRotationModifier = 0
let projectileFireOffsetXModifier = 0
let projectileFireOffsetYModifier = 0

let enemyType = { AIR: 'air', GROUND: 'ground' }
let enemyConfigs = [{ EnemyType: enemyType.AIR, xSpeed: 2, armor: 0, damageDelt: 15, hitPoints: 25 },
{ EnemyType: enemyType.GROUND, xSpeed: 1, armor: 0, damageDelt: 10, hitPoints: 50 }
]
let playerPitch = 0;
let points = 0;
let level = -3;
let fontStyle = { fontSize: 24, wordWrap: false };
let windSpeed = 0;
let gameSpeed = 1;
let ammo = { bullets: projectileConfigs.bullet.ammoStart, missiles: projectileConfigs.missile.ammoStart, bombs: projectileConfigs.bomb.ammoStart, glideBombs: projectileConfigs.glideBomb.ammoStart }
let fireCooldown = 0;
let lastTimeFired = performance.now();
let debugStuffInterval = null;
let gameStartTimer = setTimeout(startGame, 5000)

let playerStats = {
    shots: {
        bullets: { shots: 0, hits: 0, misses: 0, accuracyRate: 0 },
        missles: { shots: 0, hits: 0, misses: 0, accuracyRate: 0 },
        bombs: { shots: 0, hits: 0, misses: 0, accuracyRate: 0 },
        glideBombs: { shots: 0, hits: 0, misses: 0, accuracyRate: 0 }
    },
    totalShots: 0,
    totalHits: 0,
    totalMisses: 0,
    totalAccuracyRate: 0,
}


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

const txtAmmo = new PIXI.Text(`25mm: ${ammo.bullets}  AIM-7: ${ammo.missiles}  JSOW: ${ammo.glideBombs}  MARK-84: ${ammo.bombs}`, { fontSize: 20, fill: '#FFF' });

txtAmmo.x = appWidth * .40
txtAmmo.y = appHeight - 25
app.stage.addChild(txtAmmo);

const txtGameInfo = new PIXI.Text('Level: 1', { fontSize: 20, fill: '#FFF' });

txtGameInfo.x = 50
txtGameInfo.y = appHeight - 25
app.stage.addChild(txtGameInfo);

const txtPoints = new PIXI.Text('Points: 1', { fontSize: 20, fill: '#FFF' });

txtPoints.x = txtGameInfo.x + txtGameInfo.width + 50;
txtPoints.y = appHeight - 25
app.stage.addChild(txtPoints);

const txtHelpInfo = new PIXI.Text('Use Up Arrow to fire your 25 mm cannon. Game will start in 5 seconds', { fontSize: 30, fill: '#000' });

txtHelpInfo.x = appWidth * .20;
txtHelpInfo.y = appHeight * .5;
app.stage.addChild(txtHelpInfo);

//const fontPromise =  PIXI.Assets.load('https://pixijs.com/assets/bitmap-font/desyrel.xml');

//   fontPromise.then((resolvedFont) =>
//   {
//   txtAmmo = new PIXI.BitmapText(`25mm: ${ammo.bullets}  AIM-7: ${ammo.missiles}  JSOW: ${ammo.glideBombs}  MARK-84: ${ammo.bombs}`,
//       {
//           fontName: 'Desyrel',
//           fontSize: 55,
//           align: 'left',
//       });

//   txtAmmo.x = appWidth * .40
//   txtAmmo.y = appHeight - 100
//   app.stage.addChild(txtAmmo);

//   });





//PIXI.Assets.load('/js/galindo.fnt').then(() =>
//{
//    const bitmapFontText = new PIXI.BitmapText('bitmap fonts are supported!\nWoo yay!', {
//        fontName: 'Desyrel',
//        fontSize: 55,
//        align: 'left',
//    });

//    bitmapFontText.x = 50;
//    bitmapFontText.y = 200;

//    app.stage.addChild(bitmapFontText);
//});




app.stage.addChild(player)

if (debugMode)
{
    const grid = new PixiJSGrid(appWidth).drawGrid();
    app.stage.addChild(grid);

    debugStuffInterval = setInterval(runDebugStuff, 3000);

    level = 1
    projectileConfigs.missile.enabled = true;
    projectileConfigs.bomb.enabled = true;
    projectileConfigs.glideBomb.enabled = true;

    //setupNextLevel(1);
    //startGame();

    //player.rotation = .61

    let tank1 = addEnemyTank();
    addSmoke(tank1);

    let jet1 = addEnemyJet();
    addSmoke(jet1);

    startGame();

    var line = new PIXI.Graphics();

    line.lineStyle(5, '#fff', 1);
    line.beginFill();
    line.moveTo(player.x, player.y + 50)
    line.lineTo(appWidth - player.x, player.y + 50)
    line.endFill();
    line.rotation = player.rotation;

    app.stage.addChild(line);


    var line745 = new PIXI.Graphics();

    line745.lineStyle(4, '#000', 1);
    line745.beginFill();
    line745.moveTo(0, 745)
    line745.lineTo(appWidth, 745)
    line745.endFill();

    app.stage.addChild(line745);
}


addEnemyJet();
addEnemyTank();
addEnemyTank();
addEnemyTank();

//const cnt = new PIXI.ParticleContainer();
//app.stage.addChild(cnt);

//const emitter = new PIXI.particles.Emitter(cnt, {
//    lifetime: { min: 0.1, max: 5 },
//    emit: true,
//    frequency: 1,
//    spawnChance: 1,
//    particlesPerWave: 15,
//    emitterLifetime: 5,
//    maxParticles: 500,
//    pos: { x: 300, y: 300 },
//    autoUpdate: true,
//    addAtBack: true,
//    behaviors: [
//        /* {type: 'spawnPoint',config: {}},*/
//        { type: 'spawnShape', config: { type: 'rect', data: { x: 0, y: 0, w: 100, h: 0 } }, },
//        /*  { type: 'moveSpeedStatic', config: { min: 50, max: 100 } },*/
//        //{ type: 'spawnBurst', config: { start: 0, spacing: 10, distance: 50, } },
//        { type: 'textureSingle', config: { texture: PIXI.Texture.WHITE  /*PIXI.Texture.from("/images/mc/flame.jpg")*/ } },
//        /*{ type: 'spawnBurst', config: { start: 0, spacing: 45, distance: 30, } },*/
//        { type: 'color', config: { isStepped: true, color: { list: [{ value: '#000000', time: 0 }, { value: '#3f3f3f', time: 0.2 }, { value: '#949494', time: 0.4 }, { value: '#d4d4d4', time: .6 }, { value: '#000', time: 1 }] } }, },

//        /*   { type: 'alphaStatic', config: { alpha: 0.75 }, },*/
//        { type: 'alpha', config: { alpha: { list: [{ value: 0, time: 0 }, { value: .5, time: 0.3 }, { value: 1, time: 0.5 }, { value: .2, time: 1 },], }, }, },
//        { type: 'scale', config: { scale: { list: [{ value: 0.2, time: 0 }, { value: 1, time: 0.3 }, { value: 0.1, time: 1 }] } } },
//        //{ type: "movePath", config: { path: "cos(x/100) * 30.0 + 10.0 * random()", speed: { list: [{ value: 10, time: 0 }, { value: 50, time: 0.25 }, { value: 100, time: 1 }], }, minMult: 0.1 }, },
//        //{type: "movePath",config: { path: "cos(x/100) * 30.0 + 10.0 * random()", speed: { list: [{value: 10, time: 0}, {value: 100, time: 0.25}, {value: 450, time: 1}],   },   minMult: 0.1  },},
//        {
//            type: 'moveAcceleration', config: { accel: { x: 0, y: 0, }, minStart: 10, maxStart: 20, rotate: true },

//        },
//    ],

//});




//addEnemyJet();

function gameLoop()
{

    drawPlayer();
    drawProjectiles();
    checkProjectileHit();
    drawEnemies();
    drawBackground()
    updateGameText();


}


function drawPlayer()
{
    player.rotation += playerPitch;


    if (player.rotation <= 0)
    {
        playerPitch = 0;
        player.rotation = 0
    }

    if (player.rotation > .7)
    {
        playerPitch = 0
    }

    if (debugMode)
    {
        if (player.rotation > 0)
        {
            player.label.text = `${player.x} - ${player.y}, ${player.rotation}`

            //if (player.rotation > 0 && player.rotation < .1)
            //{
            //    player.label.text = `${player.x} - ${player.y}, < .1`
            //}
            //else if (player.rotation >= .1 && player.rotation < .2)
            //{
            //    player.label.text = `${player.x} - ${player.y}, .1`
            //}
            //else if (player.rotation >= .2 && player.rotation < .3)
            //{
            //    player.label.text = `${player.x} - ${player.y}, .2`
            //}
            //else if (player.rotation >= .3 && player.rotation < .4)
            //{
            //    player.label.text = `${player.x} - ${player.y}, .3`
            //}
            //else if (player.rotation >= .4 && player.rotation < .5)
            //{
            //    player.label.text = `${player.x} - ${player.y}, .4`
            //}
            //else if (player.rotation >= .5 && player.rotation < .6)
            //{
            //    player.label.text = `${player.x} - ${player.y}, .5`
            //}
            //else if (player.rotation >= .6)
            //{
            //    player.label.text = `${player.x} - ${player.y}, .6`
            //}
        }

    }


    updateHealthbar(player);

    if (txtPoints.text.toString().indexOf(points) == -1)
    {
        txtPoints.text = `Points: ${points}`
    }

}

function drawEnemies()
{
    for (const enemy of enemies.filter(function (eny) { return eny.visible }))
    {
        enemy.x -= enemy.xSpeed * gameSpeed;

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

        if (enemy.smoke && enemy.smoke.visible)
        {
            enemy.smoke.x -= enemy.xSpeed;
            /*  enemy.smoke.y = enemy.y;*/
        }

        //made it to player
        if (enemy.x <= player.x)
        {
            enemy.visible = false;
            enemy.healthbar.visible = false
            player.health -= enemy.damage;

            if (enemy.smoke)
            {
                enemy.smoke.destroy();
                enemy.smoke = null;
            }

            showParticlesSM(player.x + 50, player.y);
            checkNextLevel();
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
        if (projectile.hasFinishedStartSequence)
        {
            projectile.x += projectile.xSpeed + windSpeed * gameSpeed
            projectile.y += projectile.ySpeed * gameSpeed
            projectile.rotation += projectile.rotationSpeed * gameSpeed;

            if (projectile.flame)
            {
                projectile.flame.x = projectile.x
                projectile.flame.y = projectile.y
                projectile.flame.rotation = projectile.rotation;
            }

        }
        else
        {
            if (!projectile.startSequences || projectile.startSequences == null || !projectile.startSequences[0])
            {
                projectile.hasFinishedStartSequence = true;

                if (projectile.flame)
                {
                    projectile.flame.visible = true;
                }

                continue;
            }

            let nextMove = projectile.startSequences[0];
            projectile.x += nextMove.x; // projectile.xSpeed + windSpeed * gameSpeed
            // projectile.ySpeed * gameSpeed
            //projectile.rotation += projectile.rotationSpeed * gameSpeed;
            let hasReachedX = false;
            let hasReachedY = false;

            if (projectile.y < projectile.yStart + nextMove.untilY)
                projectile.y += nextMove.y
            else
                hasReachedY = true;

            if (projectile.x < projectile.xStart + nextMove.untilX)
                projectile.y += nextMove.y
            else
                hasReachedX = true;

            if (hasReachedX && hasReachedY)
            {
                projectile.startSequences.shift();
            }



        }



        if (debugMode)
        {
            projectile.label.text = `${projectile.x} - ${projectile.x2()}, ${projectile.y} - ${projectile.y2()}`
            projectile.label.x = projectile.x;
            projectile.label.y = projectile.y - 50
        }




        //out of bounds
        if (projectile.y >= appHeight - (projectile.height) || projectile.x >= appWidth + 200)
        {
            if (projectile.flame)
            {
                projectile.flame.destroy();
            }
            updatePlayerStats(projectile.type, false)
            projectile.visible = false;
            projectile.destroy();
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
        projectileRotationModifier = 0;

        projectileConfigs.missile.YRotationModifier = 0;
        projectileConfigs.missile.XRotationModifier = 0;
        projectileConfigs.missile.fireOffsetXModifier = 0;
        projectileConfigs.missile.fireOffsetYModifier = 0;

        return;
    }

    if (player.rotation < .3)
    {
        if (player.rotation > 0 && player.rotation < .1)
        {
            projectileYRotationModifier = .6;
            projectileXRotationModifier = 0;
            projectileFireOffsetYModifier = 10;
            projectileFireOffsetXModifier = 0;

            projectileConfigs.missile.YRotationModifier = .6;
            projectileConfigs.missile.XRotationModifier = 0;
            projectileConfigs.missile.fireOffsetXModifier = -10;
            projectileConfigs.missile.fireOffsetYModifier = 30;
        }

        else if (player.rotation >= .1 && player.rotation < .15)
        {
            projectileYRotationModifier = .75;
            projectileXRotationModifier = 0;
            projectileFireOffsetYModifier = 20;
            projectileFireOffsetXModifier = 0;

            projectileConfigs.missile.YRotationModifier = 1;
            projectileConfigs.missile.XRotationModifier = .0;
            projectileConfigs.missile.fireOffsetXModifier = 0;
            projectileConfigs.missile.fireOffsetYModifier = 10;

        }
        else if (player.rotation >= .15 && player.rotation < .2)
        {
            projectileYRotationModifier = 1.2;
            projectileXRotationModifier = .25;
            projectileFireOffsetYModifier = 20;
            projectileFireOffsetXModifier = 0;

            projectileConfigs.missile.YRotationModifier = 1.4;
            projectileConfigs.missile.XRotationModifier = .25;
            projectileConfigs.missile.fireOffsetXModifier = -10;
            projectileConfigs.missile.fireOffsetYModifier = 30;
        }
        else if (player.rotation >= .2 && player.rotation < .25)
        {
            projectileYRotationModifier = 1.4;
            projectileXRotationModifier = .25;
            projectileFireOffsetYModifier = 20;
            projectileFireOffsetXModifier = 0;

            projectileConfigs.missile.YRotationModifier = 1.8;
            projectileConfigs.missile.XRotationModifier = .25;
            projectileConfigs.missile.fireOffsetXModifier = -10;
            projectileConfigs.missile.fireOffsetYModifier = 45;
        }
        else if (player.rotation >= .25 && player.rotation < .3)
        {
            projectileYRotationModifier = 1.6;
            projectileXRotationModifier = .25;
            projectileFireOffsetYModifier = 25;
            projectileFireOffsetXModifier = 0;

            projectileConfigs.missile.YRotationModifier = 2.1;
            projectileConfigs.missile.XRotationModifier = .25;
            projectileConfigs.missile.fireOffsetXModifier = -10;
            projectileConfigs.missile.fireOffsetYModifier = 45;
        }
        return;
    }

    if (player.rotation >= .3)
    {
        if (player.rotation >= .3 && player.rotation < .35)
        {
            projectileYRotationModifier = 2.4;
            projectileXRotationModifier = 1;
            projectileFireOffsetYModifier = 33;
            projectileFireOffsetXModifier = 0;

            projectileConfigs.missile.YRotationModifier = 3;
            projectileConfigs.missile.XRotationModifier = 1;
            projectileConfigs.missile.fireOffsetXModifier = -10;
            projectileConfigs.missile.fireOffsetYModifier = 45;
        }
        else if (player.rotation >= .35 && player.rotation < .4)
        {
            projectileYRotationModifier = 3.2;
            projectileXRotationModifier = 2;
            projectileFireOffsetYModifier = 40;
            projectileFireOffsetXModifier = 0;

            projectileConfigs.missile.YRotationModifier = 4.2;
            projectileConfigs.missile.XRotationModifier = 2;
            projectileConfigs.missile.fireOffsetXModifier = -10;
            projectileConfigs.missile.fireOffsetYModifier = 45;
        }
        else if (player.rotation >= .4 && player.rotation < .45)
        {
            projectileYRotationModifier = 3.6;
            projectileXRotationModifier = 2;
            projectileFireOffsetYModifier = 50;
            projectileFireOffsetXModifier = 0;

            projectileConfigs.missile.YRotationModifier = 4.5;
            projectileConfigs.missile.XRotationModifier = 2;
            projectileConfigs.missile.fireOffsetXModifier = -10;
            projectileConfigs.missile.fireOffsetYModifier = 45;

        }
        else if (player.rotation >= .45 && player.rotation < .47)
        {
            projectileYRotationModifier = 4;
            projectileXRotationModifier = 2;
            projectileFireOffsetYModifier = 60;
            projectileFireOffsetXModifier = 0;

            projectileConfigs.missile.YRotationModifier = 5.2;
            projectileConfigs.missile.XRotationModifier = 2;
            projectileConfigs.missile.fireOffsetXModifier = -5;
            projectileConfigs.missile.fireOffsetYModifier = 45;

        }
        else if (player.rotation >= .47 && player.rotation < .5)
        {
            projectileYRotationModifier = 4.3;
            projectileXRotationModifier = 2;
            projectileFireOffsetYModifier = 60;
            projectileFireOffsetXModifier = 0;

            projectileConfigs.missile.YRotationModifier = 5.5;
            projectileConfigs.missile.XRotationModifier = 2;
            projectileConfigs.missile.fireOffsetXModifier = -10;
            projectileConfigs.missile.fireOffsetYModifier = 45;

        }
        else if (player.rotation >= .5 && player.rotation < .54)
        {
            projectileYRotationModifier = 4.5;
            projectileXRotationModifier = 2;
            projectileFireOffsetYModifier = 65;
            projectileFireOffsetXModifier = 0;


            projectileConfigs.missile.YRotationModifier = 6;
            projectileConfigs.missile.XRotationModifier = 2;
            projectileConfigs.missile.fireOffsetXModifier = -10;
            projectileConfigs.missile.fireOffsetYModifier = 45;

        }
        else if (player.rotation >= .54 && player.rotation < .57)
        {
            projectileYRotationModifier = 4.9;
            projectileXRotationModifier = 2;
            projectileFireOffsetYModifier = 65;
            projectileFireOffsetXModifier = -20;

            projectileConfigs.missile.YRotationModifier = 6.5;
            projectileConfigs.missile.XRotationModifier = 2;
            projectileConfigs.missile.fireOffsetXModifier = -15;
            projectileConfigs.missile.fireOffsetYModifier = 50;
        }
        else if (player.rotation >= .57 && player.rotation < .6)
        {
            projectileYRotationModifier = 5.3;
            projectileXRotationModifier = 2;
            projectileFireOffsetYModifier = 65;
            projectileFireOffsetXModifier = -20;

            projectileConfigs.missile.YRotationModifier = 7;
            projectileConfigs.missile.XRotationModifier = 2;
            projectileConfigs.missile.fireOffsetXModifier = -15;
            projectileConfigs.missile.fireOffsetYModifier = 50;
        }
        else if (player.rotation >= .6 && player.rotation < .65)
        {
            projectileYRotationModifier = 6;
            projectileXRotationModifier = 2;
            projectileFireOffsetYModifier = 65;
            projectileFireOffsetXModifier = -25;

            projectileConfigs.missile.YRotationModifier = 8;
            projectileConfigs.missile.XRotationModifier = 2;
            projectileConfigs.missile.fireOffsetXModifier = -45;
            projectileConfigs.missile.fireOffsetYModifier = 40;

        }
        else if (player.rotation >= .65)
        {
            projectileYRotationModifier = 6;
            projectileXRotationModifier = 2;
            projectileFireOffsetYModifier = 75;
            projectileFireOffsetXModifier = -30;

            projectileConfigs.missile.YRotationModifier = 9;
            projectileConfigs.missile.XRotationModifier = 2;
            projectileConfigs.missile.fireOffsetXModifier = -45;
            projectileConfigs.missile.fireOffsetYModifier = 60;

            projectileRotationModifier = .01;
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
                enemy.health -= projectile.damage;

                if (projectile.flame)
                {
                    projectile.flame.destroy();
                }

                //splah damage only applies if there was a direct hit
                if (projectile.splashDamageRadius && projectile.splashDamageRadius != 0)
                {
                    getEnemiesWithinSplashRadius(projectile, enemy);
                }


                updatePlayerStats(projectile.type, true)
                setTimeout(function () { projectile.destroy(); }, 500)

                checkIfEnemyIsDead(enemy);


            }


        }
    }

    function getEnemiesWithinSplashRadius(projectile, enemyToSkip)
    {
        let minX = projectile.x - projectile.splashDamageRadius;
        let maxX = projectile.x2() + projectile.splashDamageRadius
        let enemiesWithinRange = enemies.filter(function (eny)
        {
            return eny.visible &&
                eny.x >= minX &&
                eny.x2() <= maxX &&
                eny != enemyToSkip 
               /* doesIntersectY(projectile, eny, eny.enemyType)*/
        })

        for (const enemy of enemiesWithinRange)
        {
            enemy.health -= projectile.splashDamage;
            showParticlesSplash(enemy.x, enemy.y)
            checkIfEnemyIsDead(enemy);
        }
    }
}

function checkIfEnemyIsDead(enemy)
{
    if (enemy.health < 1)
    {
        points += enemy.awardsPoints;
        enemy.visible = false;
        enemy.healthbar.destroy();

        if (enemy.smoke)
        {
            enemy.smoke.destroy();
            enemy.smoke = null;
        }

        showParticlesLG(enemy.x, enemy.y);


        if (enemy.enemyToSpawnAfterDeath != null)
        {
            if (enemy.enemyToSpawnAfterDeath.type == enemyType.AIR)
                addEnemyJet();
            else if (enemy.enemyToSpawnAfterDeath.type == enemyType.GROUND)
                addEnemyTank();
        }

        if (debugMode && enemy.label)
        {
            enemy.label.destroy();

        }

        setTimeout(function ()
        {
            enemy.destroy();
            checkNextLevel();
        }, 500)
    }
}

function checkNextLevel()
{
    cleanUp();
    if (enemies.length == 0)
    {
        setTimeout(function ()
        {
            setupNextLevel();
        }, 2000)
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
    if ((performance.now() - projectileConfigs.bullet.lastTimeFired) < projectileConfigs.bullet.fireCooldown)
        return;
    else
        projectileConfigs.bullet.lastTimeFired = performance.now();


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
    projectile.type = projectileConfigs.bullet.type;
    projectile.rotation = player.rotation
    projectile.hasFinishedStartSequence = true;
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

    ammo.bullets -= 1;
}

function dropMissile()
{
    if (!projectileConfigs.missile.enabled || (performance.now() - projectileConfigs.missile.lastTimeFired) < projectileConfigs.missile.fireCooldown)
        return;
    else
        projectileConfigs.missile.lastTimeFired = performance.now();

    var projectile = new PIXI.Graphics();

    projectile.beginFill('#000');
    projectile.drawRoundedRect(0, 0, projectileConfigs.missile.width, projectileConfigs.missile.height)
    projectile.drawRect(0, -5, 15, 25)
    projectile.x = player.x + projectileConfigs.missile.fireOffsetX + projectileConfigs.missile.fireOffsetXModifier;
    projectile.y = player.y + projectileConfigs.missile.fireOffsetY + projectileConfigs.missile.fireOffsetYModifier;
    projectile.x2 = () => projectile.x + projectileConfigs.missile.width
    projectile.y2 = () => projectile.y + projectileConfigs.missile.height
    projectile.endFill();
    projectile.xSpeed = projectileConfigs.missile.xSpeed + projectileConfigs.missile.XRotationModifier;
    projectile.ySpeed = projectileConfigs.missile.ySpeed + projectileConfigs.missile.YRotationModifier;
    projectile.rotationSpeed = projectileConfigs.missile.rotationSpeed //+ projectileRotationModifier;
    projectile.damage = projectileConfigs.missile.damage;
    projectile.rotation = player.rotation;
    projectile.type = projectileConfigs.missile.type;
    projectile.hasFinishedStartSequence = false;
    projectile.startSequences = Array.from(projectileConfigs.missile.startSequences)
    projectile.xStart = player.x + projectileConfigs.missile.fireOffsetX + projectileConfigs.missile.fireOffsetXModifier;
    projectile.yStart = player.y + projectileConfigs.missile.fireOffsetY + projectileConfigs.missile.fireOffsetYModifier;
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

    ammo.missiles -= 1;

    //addMissileParticles(projectile);
}

function dropBomb()
{
    if (!projectileConfigs.bomb.enabled || (performance.now() - projectileConfigs.bomb.lastTimeFired) < projectileConfigs.bomb.fireCooldown)
        return;
    else
        projectileConfigs.bomb.lastTimeFired = performance.now();

    var projectile = new PIXI.Graphics();

    projectile.beginFill('#000');
    projectile.drawRoundedRect(0, 0, 20, 75, 50)
    projectile.drawRect(-10, 0, 40, 15)
    projectile.x = player.x + 85
    projectile.y = player.y + 85
    projectile.endFill();
    projectile.xSpeed = projectileConfigs.bomb.xSpeed + projectileConfigs.bomb.XRotationModifier;
    projectile.ySpeed = projectileConfigs.bomb.ySpeed + projectileConfigs.bomb.XRotationModifier;
    projectile.rotationSpeed = projectileConfigs.bomb.rotationSpeed;
    projectile.damage = projectileConfigs.bomb.damage;
    projectile.x2 = () => projectile.x + projectileConfigs.bomb.width
    projectile.y2 = () => projectile.y + projectileConfigs.bomb.height
    projectile.type = projectileConfigs.bomb.type;
    projectile.hasFinishedStartSequence = true;
    projectile.splashDamage = projectileConfigs.bomb.splashDamage;
    projectile.splashDamageRadius = projectileConfigs.bomb.splashDamageRadius;
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

    ammo.bombs -= 1;
}
function dropGlideBomb()
{
    if (!projectileConfigs.glideBomb.enabled || (performance.now() - projectileConfigs.glideBomb.lastTimeFired) < projectileConfigs.glideBomb.fireCooldown)
        return;
    else
        projectileConfigs.glideBomb.lastTimeFired = performance.now();

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
    projectile.rotation = -1;
    projectile.type = projectileConfigs.glideBomb.type;
    projectile.hasFinishedStartSequence = true;
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

    ammo.glideBombs -= 1;
}

function addEnemyJet(xSpaceToadd = 0, enemyToSpawnAfterDeath = null)
{
    let jetConfig = enemyConfigs.find(function (x) { return x.EnemyType == enemyType.AIR })

    let currentJets = enemies.filter(function (eny) { return eny.enemyType == enemyType.AIR })
    let spawnX = appWidth;

    if (currentJets.length > 0)
    {
        let lastJet = currentJets[currentJets.length - 1];
        spawnX = lastJet.x2() + xSpaceToadd;
    }

    let jet = PIXI.Sprite.from('/images/mc/jet2.png');
    //bunny.anchor.set(0.5);
    jet.height = 50
    jet.width = 100
    jet.height = 50
    jet.x = spawnX + xSpaceToadd;
    jet.x2 = () => jet.x + jet.width;
    jet.y = 80
    jet.y1 = () => jet.y
    jet.y2 = () => jet.y + jet.height;
    jet.enemyType = enemyType.AIR
    jet.hitPoints = jetConfig.hitPoints;
    jet.health = 100
    jet.enemyId = getEnemyId();
    jet.dealDamage = (dmg) => health = health - dmg;
    jet.isDead = () => hitPoints > 0;
    jet.damage = 50;
    jet.awardsPoints = 10;
    jet.xSpeed = jetConfig.xSpeed;
    jet.enemyToSpawnAfterDeath = enemyToSpawnAfterDeath;
    enemies.push(jet);
    app.stage.addChild(jet)

    addHealthbar(jet, enemyType.AIR, -30)

    if (debugMode)
    {
        //const txtProjectileLabel = new PIXI.Text(`${jet.x} - ${jet.x2}, ${jet.y} - ${jet.y2}`, fontStyle);

        //txtProjectileLabel.x = jet.x;
        //txtProjectileLabel.y = jet.y;
        //jet.label = txtProjectileLabel
        //app.stage.addChild(txtProjectileLabel);
    }

    return jet;
}



function addEnemyTank(xSpaceToadd = 0, enemyToSpawnAfterDeath = null)
{
    let tankConfig = enemyConfigs.find(function (x) { return x.EnemyType == enemyType.GROUND })

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
    tank.x = spawnX + xSpaceToadd
    tank.x2 = () => tank.x + tank.width;
    tank.y = roadY;
    tank.y1 = () => tank.y + 75
    tank.y2 = () => tank.y + tank.height;
    tank.enemyType = enemyType.GROUND
    tank.hitPoints = tankConfig.hitPoints;
    tank.health = 100
    tank.enemyId = getEnemyId();
    tank.dealDamage = (dmg) => health = health - dmg;
    tank.damage = 25;
    tank.isDead = () => hitPoints > 0;
    tank.awardsPoints = 10;
    tank.xSpeed = tankConfig.xSpeed;
    tank.enemyToSpawnAfterDeath = enemyToSpawnAfterDeath;

    addHealthbar(tank, enemyType.GROUND);


    if (debugMode)
    {
        const txtProjectileLabel = new PIXI.Text(`${tank.x} - ${tank.y}`, { fontSize: 20, wordWrap: true, wordWrapWidth: tank.width });

        txtProjectileLabel.x = tank.x;
        txtProjectileLabel.y = tank.y;
        txtProjectileLabel.text = `${tank.x} - ${tank.y}`;
        tank.label = txtProjectileLabel
        app.stage.addChild(txtProjectileLabel);
    }

    app.stage.addChild(tank)
    enemies.push(tank);

    return tank;
}

function addHealthbar(enemy, typeOfEnemy, xOffset = 0)
{
    const healthbarContainer = new PIXI.Container();

    if (typeOfEnemy == enemyType.GROUND)
    {
        healthbarContainer.x = enemy.x + enemy.width + xOffset
        healthbarContainer.y = enemy.y + (enemy.height * .80)
    }
    else
    {
        healthbarContainer.x = enemy.x + xOffset
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
    if (player.health < 100 && player.health > 75)
    {
        player.healthbar.children[3].visible = false;
    }
    else if (player.health <= 75 && player.health > 50)
    {
        if (player.healthbar.children[3] && player.healthbar.children[3].visible)
            player.healthbar.children[3].visible = false;

        player.healthbar.children[2].visible = false;
    }
    else if (player.health <= 50)
    {
        if (player.healthbar.children[3] && player.healthbar.children[3].visible)
            player.healthbar.children[3].visible = false;

        if (player.healthbar.children[2] && player.healthbar.children[2].visible)
            player.healthbar.children[2].visible = false;

        player.healthbar.children[1].visible = false;

        if (player.enemyType && !player.smoke)
        {
            addSmoke(player);
        }

    }


}

function addSmoke(enemy)
{
    let smoke = PIXI.Sprite.from('/images/mc/smoke2.png');
    //bunny.anchor.set(0.5);

    smoke.height = 100
    smoke.width = 100
    smoke.alpha = .6

    if (enemy.enemyType == enemyType.GROUND)
    {
        smoke.x = enemy.x + 40
        smoke.y = enemy.y - 25
    }
    else
    {
        smoke.x = enemy.x
        smoke.y = enemy.y - 50
    }

    app.stage.addChild(smoke)

    enemy.smoke = smoke;
    //enemy.mask = smoke;
}

function doesIntersect(projectile, enemy)
{
    return doesIntersectX(projectile, enemy, enemy.enemyType) && doesIntersectY(projectile, enemy, enemy.enemyType);
}
function doesIntersectX(projectile, enemy, typeOfEnemy)
{
    //console.log('doesIntersectX()')
    if (typeOfEnemy == enemyType.AIR)
    {
        if (projectile.x >= enemy.x)
        {
            return true;
        }
    }
    else
    {
        if (isWithIn(projectile.x, enemy.x, enemy.x2()))
        {

            return true;
        }
    }

    return false;
}

function doesIntersectY(projectile, enemy, typeOfEnemy) 
{
    //console.log('doesIntersectY()')
    if (typeOfEnemy == enemyType.AIR)
    {
        if (isWithinDistance(projectile.y, enemy.y, 20))
        {
            return true;
        }
    }
    else
    {
        if (projectile.type == 'bomb')
        {
            if (isWithIn(projectile.y, enemy.y, enemy.y2()))
            {
                return true;
            }
        }
        else
        {
            if (isWithIn(projectile.y, enemy.y1(), enemy.y2()))
            {
                return true;
            }
        }

    }

    return false;

}
function isWithinDistance(point1, point2, distance)
{
    return Math.abs(point1 - point2) < distance;
}

function isWithIn(pointToTest, pointMin, pointMax)
{
    return pointToTest >= pointMin && pointToTest <= pointMax
}

//showParticlesSplash(500, 500);

function showParticlesSplash(x, y)
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
            { type: 'colorStatic', config: { color: "#f0ffff" }, },
            { type: 'alphaStatic', config: { alpha: 0.75 }, },
            { type: 'scale', config: { scale: { list: [{ value: 0.1, time: 0 }, { value: .3, time: 0.3 }, { value: 0.1, time: 1 }] } } }
        ],

    });
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

function addMissileParticles(projectile)
{
    //const cnt = new PIXI.ParticleContainer();
    //app.stage.addChild(cnt);

    //const emitter = new PIXI.particles.Emitter(cnt, {
    //    lifetime: { min: 0.1, max: 5 },
    //    emit: true,
    //    frequency: 1,
    //    spawnChance: 1,
    //    particlesPerWave: 50,
    //    emitterLifetime: 5,
    //    maxParticles: 15,
    //    pos: { x: projectile.x, y: projectile.y },
    //    autoUpdate: true,
    //    addAtBack: true,
    //    behaviors: [
    //        /* {type: 'spawnPoint',config: {}},*/
    //        { type: 'spawnShape', config: { type: 'rect', data: { x: 0, y: 0, w: 100, h: 10 } }, },
    //        /*  { type: 'moveSpeedStatic', config: { min: 50, max: 100 } },*/
    //        /* { type: 'spawnBurst', config: { start: 0, spacing: 0, distance: 5, } },*/
    //        { type: 'textureSingle', config: { texture: PIXI.Texture.WHITE  /*PIXI.Texture.from("/images/mc/flame.jpg")*/ } },
    //        /*{ type: 'spawnBurst', config: { start: 0, spacing: 45, distance: 30, } },*/
    //        { type: 'color', config: { isStepped: true, color: { list: [{ value: '#e34234', time: 0 }, { value: '#db4823', time: 0.2 }, { value: '#d05209', time: 0.4 }, { value: '#e6a200', time: .6 }, { value: '#f7d500', time: 1 }] } }, },

    //        /*   { type: 'alphaStatic', config: { alpha: 0.75 }, },*/
    //        { type: 'scale', config: { scale: { list: [{ value: 0.2, time: 0 }, { value: .5, time: 0.3 }, { value: 0.1, time: 1 }] } } },
    //        { type: "movePath", config: { path: "1", speed: { list: [{ value: 10, time: 0 }, { value: 50, time: 0.25 }, { value: 100, time: 1 }], }, minMult: 0.1 }, },
    //        //{type: "movePath",config: { path: "cos(x/100) * 30.0 + 10.0 * random()", speed: { list: [{value: 10, time: 0}, {value: 100, time: 0.25}, {value: 450, time: 1}],   },   minMult: 0.1  },},
    //        {
    //            type: 'moveAcceleration', config: { accel: { x: 0, y: 200, }, minStart: 10, maxStart: 20, rotate: true },

    //        },
    //    ],

    //});


    let flame = PIXI.Sprite.from('/images/mc/jetFlame1_trans.png');
    //bunny.anchor.set(0.5);
    flame.x = projectile.x - 65
    flame.y = projectile.y;
    flame.visible = false;
    //flame.width = 12
    /* flame.height = 20;*/
    projectile.flame = flame;


    app.stage.addChild(flame)

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

function setupNextLevel(forceLevel = null)
{
    cleanUp()
    level += 1;

    if (forceLevel != null)
        level = forceLevel;

    if (level < 1)
    {
        if (level == -2)
        {
            txtHelpInfo.text = 'Decrease your pitch with D to shoot your 25 mm gun at tanks.';
            setTimeout(function ()
            {
                txtHelpInfo.text = '';
                addEnemyTank();
            }, 4000)
            return;
        }
        else if (level == -1)
        {
            txtHelpInfo.text = 'AIM-7 missiles have been unlocked. Use them with Right Arrow >. You have a limited supply.';
            projectileConfigs.missile.enabled = true;

            setTimeout(function ()
            {
                txtHelpInfo.text = '';
                addEnemyJet();
            }, 4000);

            return;
        }
        else if (level == 0)
        {
            txtHelpInfo.text = "JSOW's & MARK-84's have been unlocked, and can be used with Down Arrow & Left Arrow. ";
            projectileConfigs.missile.enabled = true;
            projectileConfigs.bomb.enabled = true;
            projectileConfigs.glideBomb.enabled = true;

            setTimeout(function ()
            {
                txtHelpInfo.text = '';
                addEnemyTank();
            }, 4000);

            return;
        }
    }

    //if (level == 1)
    //{
    //    projectileConfigs.bomb.enabled = false;
    //    projectileConfigs.glideBomb.enabled = false;
    //}



    let levelConfig = levelConfigs.find(function (x) { return x.level == level });
    if (levelConfig.spawnConfigs)
    {
        for (const spawnConfig of levelConfig.spawnConfigs)
        {
            let tankConfig = spawnConfig.tanks;
            let jetConfig = spawnConfig.jets;
            let tanksToSpawn = tankConfig.count;
            let jetsToSpawn = jetConfig.count;


            setTimeout(function ()
            {
                for (let i = 0; i < tanksToSpawn; i++)
                {
                    addEnemyTank(tankConfig.xSpaceBetween, tankConfig.spawnAfterDeath ?? null)
                }

                for (let i = 0; i < jetsToSpawn; i++)
                {
                    addEnemyJet(jetConfig.xSpaceBetween, jetConfig.spawnAfterDeath ?? null)
                }

            }, spawnConfig.seconds)
        }




    }


    //let tanksToSpawn = getRandomInt(level, level * level + 5)


    resupply();

    function resupply()
    {
        ammo.bullets = Math.ceil(projectileConfigs.bullet.ammoStart * level * .52);
        ammo.missiles = Math.ceil(projectileConfigs.missile.ammoStart * level * .52);
        ammo.bombs = Math.ceil(projectileConfigs.bomb.ammoStart * level * .52);
        ammo.glideBombs = Math.ceil(projectileConfigs.glideBomb.ammoStart * level * .52);

    }

    //for (let i = 1; i < tanksToSpawn; i++)
    //{
    //    let spaceToAddBetweenTanks = getRandomInt(0, 100);
    //    addEnemyTank(spaceToAddBetweenTanks)
    //}

}


function updateGameText()
{
    let ammoText = `25mm: ${ammo.bullets}`;

    if (projectileConfigs.missile.enabled)
    {
        ammoText += ` AIM-7: ${ammo.missiles}`;
    }
    if (projectileConfigs.bomb.enabled)
    {
        ammoText += ` JSOW: ${ammo.glideBombs}`
    }
    if (projectileConfigs.glideBomb.enabled)
    {
        ammoText += ` MARK-84: ${ammo.bombs}`
    }
    txtAmmo.text = ammoText;


    txtGameInfo.text = `Level: ${level}`
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
    if (ammo.missiles <= 0)
        return;

    dropMissile();
};

down.press = () =>
{
    if (ammo.glideBombs <= 0)
        return;

    dropGlideBomb();
};

left.press = () =>
{
    if (ammo.bombs <= 0)
        return;

    dropBomb();
};

up.press = () =>
{
    if (ammo.bullets <= 0)
        return;

    fireBullets()
    playerStats.totalShots += 1;
};

function stopGame()
{
    app.ticker.destroy();

    if (debugMode)
    {
        clearInterval(debugStuffInterval);
    }

    runDebugStuff();
}

function startGame()
{
    clearTimeout(gameStartTimer);
    txtHelpInfo.text = '';

    app.ticker.add((delta) =>
    {

        // delta is 1 if running at 100% performance
        // creates frame-independent transformation
        //bunny.rotation += 0.01 * delta;
        gameLoop()
    });
}

function skipIntro()
{
    console.log('skipping intro')
    level = 0;
    projectileConfigs.missile.enabled = true;
    projectileConfigs.bomb.enabled = true;
    projectileConfigs.glideBomb.enabled = true;
    setupNextLevel();

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

function cleanUp(hardClean = false)
{
    projectiles = projectiles.filter(function (p) { return p.visible });
    enemies = enemies.filter(function (eny) { return eny.visible });

    if (hardClean)
    {
        projectiles = [];
        enemies = [];
    }
}

function runDebugStuff()
{

    console.log(`Current FPS: ${app.ticker.FPS.toFixed(2)}`);
    console.log('enemies')
    console.log(enemies);
    console.log('projectiles')
    console.log(projectiles);
    console.log(playerStats);
}

function updatePlayerStats(projectileType, hitTarget)
{
    let statType = null;

    switch (projectileType)
    {
        case 'bullet':
            statType = playerStats.shots.bullets;
            break;
        case 'missile':
            statType = playerStats.shots.missles;
            break;
        case 'bomb':
            statType = playerStats.shots.bombs;
            break;
        case 'glideBomb':
            statType = playerStats.shots.glideBombs;
            break;
    }

    statType.shots += 1;
    playerStats.totalShots += 1;

    if (hitTarget)
    {
        statType.hits += 1;
        playerStats.totalHits += 1;
    }
    else
    {
        statType.misses += 1;
        playerStats.totalMisses += 1;
    }

    statType.accuracyRate = (statType.hits / statType.shots).toFixed(2)
    playerStats.totalAccuracyRate = (playerStats.totalHits / playerStats.totalShots).toFixed(2)



}