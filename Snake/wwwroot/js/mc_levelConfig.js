let levelConfigs = [
    { level: -3, jet: 1, tank: 0, heli: 0, maxRandomEnemies: 0 },
    { level: -2, jet: 0, tank: 1, heli: 0, maxRandomEnemies: 0 },
    { level: -1, jet: 0, tank: 2, heli: 0, maxRandomEnemies: 0 },
    { level: 0, jet: 1, tank: 0, heli: 0, maxRandomEnemies: 0 },
    {
        level: 1, jet: 0, tank: 0, heli: 0, maxRandomEnemies: 5, spawnConfigs:
            [
                { seconds: 1000, tanks: { count: 3, xSpaceBetween: 75 }, jets: { count: 0, xSpaceBetween: 5 }, helis: { count: 0, xSpaceBetween: 50 } },
                { seconds: 2500, tanks: { count: 0, xSpaceBetween: 150 }, jets: { count: 3, xSpaceBetween: 100 }, helis: { count: 0, xSpaceBetween: 50 } }
            ]
    },
    { level: 2, jet: 0, tank: 0, heli: 0, maxRandomEnemies: 0, spawnConfigs: [{ seconds: 2000, tanks: { count: 3, xSpaceBetween: 50 }, jets: { count: 2, xSpaceBetween: 25 }, helis: { count: 1, xSpaceBetween: 50 } }] },
    {
        level: 3, jet: 0, tank: 0, heli: 0, maxRandomEnemies: 0, spawnConfigs: [
            { seconds: 2000, tanks: { count: 3, xSpaceBetween: 50 }, jets: { count: 0, xSpaceBetween: 50 }, helis: { count: 0, xSpaceBetween: 50 } },
            { seconds: 10000, tanks: { count: 5, xSpaceBetween: 25 }, jets: { count: 2, xSpaceBetween: 50 }, helis: { count: 0, xSpaceBetween: 50 } }]
    },
    {
        level: 4, jet: 0, tank: 0, heli: 0, maxRandomEnemies: 0, spawnConfigs: [
            { seconds: 2000, tanks: { count: 3, xSpaceBetween: 50 }, jets: { count: 2, xSpaceBetween: 50 }, helis: { count: 1, xSpaceBetween: 50 } },
            { seconds: 2000, tanks: { count: 3, xSpaceBetween: 50, spawnAfterDeath: { type: 'ground', count: 1 } }, jets: { count: 2, xSpaceBetween: 50 }, helis: { count: 0, xSpaceBetween: 50 } }]
    },
    {
        level: 5, jet: 0, tank: 0, heli: 0, maxRandomEnemies: 3, spawnConfigs: [
            { seconds: 2000, tanks: { count: 3, xSpaceBetween: 25, spawnAfterDeath: { type: 'air', count: 1 } }, jets: { count: 2, xSpaceBetween: 50 }, helis: { count: 0, xSpaceBetween: 50 } },
            { seconds: 5000, tanks: { count: 3, xSpaceBetween: 50, spawnAfterDeath: { type: 'air', count: 1 } }, jets: { count: 2, xSpaceBetween: 50 }, helis: { count: 0, xSpaceBetween: 50 } }
        ]
    },
    {
        level: 6, jet: 0, tank: 0, heli: 0, maxRandomEnemies: 2, spawnConfigs: [
            { seconds: 2000, tanks: { count: 5, xSpaceBetween: 25, }, jets: { count: 2, xSpaceBetween: 25 }, helis: { count: 0, xSpaceBetween: 50 } },
            { seconds: 5000, tanks: { count: 2, xSpaceBetween: 25, }, jets: { count: 5, xSpaceBetween: 25 }, helis: { count: 0, xSpaceBetween: 50 } }
        ]
    },
        {
        level: 7, jet: 0, tank: 0, heli: 0, maxRandomEnemies: 20, spawnConfigs: [
            { seconds: 2000, tanks: { count: 0, xSpaceBetween: 25, }, jets: { count: 0, xSpaceBetween: 25 }, helis: { count: 0, xSpaceBetween: 50 } },
            { seconds: 5000, tanks: { count: 0, xSpaceBetween: 25, }, jets: { count: 0, xSpaceBetween: 25 }, helis: { count: 0, xSpaceBetween: 50 } }
        ]
    },
]