var canvas = /** @type {HTMLCanvasElement} */(null);
var ctx = /** @type {CanvasRenderingContext2D} */(null);

var time = 0,
    fps = 0,
    framesAcum = 0,
    acumDelta = 0;
var targetDT = 1/60; // 60 fps
var globalDT;
var changeFrame=false;

/*
 Todos los imagenes y sus rutas donde estan almacenadas
 */
var assets = {
    ships: {
        img: null,
        path: "./assets/simpleSpace_sheet.png"
    },
    crosshair: {
        img: null,
        path: "./assets/crosshair060.png"
    },
    laser: {
        img: null,
        path: "./assets/laser.png"
    },
    Charapter: {
        img: null,
        path: "./assets/Lucario.png"
    },
    BackGound: {
        img: null,
        path: "./assets/FondoPlano.png"
    },
    Ruins: {
        img: null,
        path: "./assets/Isla.png"
    },
    Enemies: {
        img: null,
        path: "./assets/Enemies.png"
    },
    Heart: {
        img: null,
        path: "./assets/Heart.png"
    },
    Cloud: {
        img: null,
        path: "./assets/Cloud.png"
    },
    Rocks: {
        img: null,
        path: "./assets/Rocas.png"
    }
    
}
        let puntuaciones = localStorage.getItem('myArray');

        // Si no hay un array guardado, inicializar uno nuevo
        if (puntuaciones === null) {
            puntuaciones = [];
        } else {
            // Convertir la cadena JSON a un array
            puntuaciones = JSON.parse(puntuaciones);
        }

        // Agregar un nuevo elemento al array


       

        // Mostrar el array en la consola
        console.log('El array es:', puntuaciones);
/*
 Todos los sonidos y sus rutas donde estan almacenadas
 Aqui utilizo una libreria js para reproducir mas sencillamente los audios
 con esta libreria puedes poner ajustes de los en su propia implementacion así facilita su manejo
 el ejemplo es que puedo loopear un audio con una sola linea.
 */
var sfx = {
    maintheme: new Howl({
       src: [
          './assets/DialgaTheme.mp3',
       ],       
       loop: true
    }),
    lucario: new Howl({
        src: [
           './assets/LucarioCry.mp3',
        ],       
     }),
     arbok: new Howl({
        src: [
           './assets/ArbokCry.mp3',
        ],       
     }),
     nidoking: new Howl({
        src: [
           './assets/NidokingCry.mp3',
        ], 
              
     }),
     magneton: new Howl({
        src: [
           './assets/MagnetonCry.mp3',
        ], 
              
     }),
     magnemite: new Howl({
        src: [
           './assets/MagnemiteCry.mp3',
        ], 
              
     }),
     wind: new Howl({
        src: [
           './assets/Wind.mp3',
        ], 
        loop: true     
     }),

}
const maxY = 7;
const minY = -7;
var player = null;
var posicionY =0;
var direction =-1;
var enemies = [];
var camera = null;

var playerMoveLimits = {
    x: 360-55,
    y: 600,
    width: 310,
    height: 300
}
var enemySpawn = {
    x: 540-80,
    y: 200,
    width: 80,
    height: 20
}
var enemiesSpawnPoints = [
    new Vector2(enemySpawn.x, enemySpawn.y),
    new Vector2(enemySpawn.x - enemySpawn.width , enemySpawn.y),
    new Vector2(enemySpawn.x + enemySpawn.width , enemySpawn.y),
    new Vector2(enemySpawn.x , enemySpawn.y + enemySpawn.height ),
    new Vector2(enemySpawn.x + enemySpawn.width , enemySpawn.y + enemySpawn.height ),
    new Vector2(enemySpawn.x - enemySpawn.width , enemySpawn.y + enemySpawn.height ),
];
var timeToSpawnEnemy = 5;
var timeToSpawnEnemyAux = timeToSpawnEnemy;
let enemiesKilled = 0;
// esto deberia almacenar la puntuacion de las partidas que juegos pero no lo hace 

//localStorage.setItem("puntuaciones", puntuaciones);
var gameOver = false;
//nodconst mejson = require("./data.json");
//import TAnimationEnemies from './data.json' assert {type:'json'};

/*fetch('./data.json')
    .then(res=>res.json())
    .then(data => {
        var mejson = data;
    })

*/
/*var mejson ;
var xhr = new XMLHttpRequest();
xhr.open('GET', './data.json', true);
xhr.responseType = 'json';
xhr.onload = function() {
    
      mejson = JSON.parse(xhr.responseText);
    
  };
  xhr.send();
*/


function LoadImages(assets, onloaded) {
    let imagesToLoad = 0;
    if (Object.keys(assets).length === 0)
        onloaded();

    const onload = () => --imagesToLoad === 0 && onloaded();

    /*const onload = function() {
        --imagesToLoad;
        if (imagesToLoad === 0) {
            onloaded();
        }
    }*/
    
    // iterate through the object of assets and load every image
    for (let asset in assets) {
        if (assets.hasOwnProperty(asset)) {
            imagesToLoad++; // one more image to load

            // create the new image and set its path and onload event
            const img = assets[asset].img = new Image;
            img.src = assets[asset].path;
            img.onload = onload;
        }
     }
    return assets;
}


function Init() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    // input setup
    SetupKeyboardEvents();
    SetupMouseEvents();
    



    // assets loading
    LoadImages(assets, () => {
        MainMenuSetup(() => {
            Start();
            Loop();
        }); 
    });
   
   
}

function Start() {
    time = performance.now();  
    
    // el sonido hambiente y el tema principal enpiezan a sonar
    sfx.maintheme.play();
    sfx.wind.play();
    // initialize the player
    player = new Player(new Vector2(canvas.width / 2, canvas.height / 2), 5, assets.Charapter.img);
    particleSystem = new ParticleSystem(assets.Cloud.img);
    camera = new Camera(player);
    camera.Start();
    
    // one enemy
   /* let enemy = new EnemyKamikaze(assets.ships.img, new Vector2 (100, 100), 1);
    enemies.push(enemy);*/
}

function Loop() {
    requestAnimationFrame(Loop);

    let now = performance.now();

    let deltaTime = (now - time) / 1000;
    globalDT = deltaTime;
    
    time = now;

    framesAcum++;
    acumDelta +=2* deltaTime;
    changeFrame=false;
    if (acumDelta >= 1) {
        //fps = framesAcum;
        framesAcum = 0;
        acumDelta -= 1;
        changeFrame=true;
    }
   
    if (deltaTime > 1)
        return;


    // Update the games logic
    Update(deltaTime);

    // Draw the game elements
    Draw();
}

function Update(deltaTime) {
    if (gameOver)
        return;
    // update the enemies
    enemies.forEach(enemy => enemy.Update(deltaTime));
    if (Input.IsKeyDown(KEY_ESCAPE)){
        puntuaciones =[];
        localStorage.setItem('myArray', JSON.stringify(puntuaciones));
    }
       

    // update the player
    player.Update(deltaTime);
   
    
    if(posicionY>=maxY || posicionY<=minY)
    {
        direction *= -1
    }
     posicionY += 0.07*direction;
    // update the camera
    camera.Update(deltaTime);

   // player bullets vs enemies collisions
    for (let i = player.bullets.bullets.length - 1; i >= 0; i--) {
        const bullet = player.bullets.bullets[i];
        if (bullet.active) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                if (bullet.active && CheckCollisionCircle(bullet.position, enemies[j].position, enemies[j].boundingRadius2)) {
                    const enemyKilled = enemies[j].Damage(bullet.damage);

                    player.bullets.Deactivate(bullet);

                    camera.Shake(0.1, 100, 3);

                    if (enemyKilled) {
                        enemies.splice(j, 1);
                        enemiesKilled++;
                    }
                }
            }
        }
    }
    

    
    // check for enemies out of bounds && enemies-player collision
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemyPos = enemies[i].position;

        // enemies-player collision
        const dist2 = Vector2.SqrMagnitude(enemyPos, player.position);
        
        if (dist2 < enemies[i].boundingRadius2 + player.boundingRadius2) {
            

            
             player.Damage();
            
            if (player.life <=0)
                {
                    gameOver = true;
                   puntuaciones.push(enemiesKilled);
           
                   puntuaciones.sort(function(a, b){return b - a});
                     // Convertir el array a una cadena JSON y guardarlo en localStorage
                    localStorage.setItem('myArray', JSON.stringify(puntuaciones));
                }
                enemies.splice(i, 1);
        }
        
        // cuando un enemigo sale de la pantalla significa que ha podido cruzar y pierdes automaticamente
        if (enemyPos.x < 0 - 100 ||
            enemyPos.x > canvas.width + 100 ||
            enemyPos.y < 0 - 100 ||
            enemyPos.y > canvas.height + 100) {
          
                gameOver = true;
               puntuaciones.push(enemiesKilled);
       
               puntuaciones.sort(function(a, b){return b - a});
               localStorage.setItem('myArray', JSON.stringify(puntuaciones));
        }
    }
    particleSystem.Update(deltaTime);
    // enemies spawning
    timeToSpawnEnemyAux -= deltaTime;
    if (timeToSpawnEnemyAux <= 0) {
        // spawn an enemy!
        const randomPosition = enemiesSpawnPoints[RandomBetweenInt(0, enemiesSpawnPoints.length - 1)];

        let enemy = null;
       
                
        const random = RandomBetweenInt(0, 2);
        switch(random) {
            case 0:
                enemy = new Enemy(assets.Enemies.img, randomPosition, 1);
                sfx.nidoking.play();
                break;
            case 1:
             
               enemy = new EnemyArbok(assets.Enemies.img, randomPosition, 1, false);
                sfx.arbok.play();
                break;
            case 2:            
                enemy = new enemyMagneton(assets.Enemies.img, randomPosition, 1, false);
                sfx.magneton.play();
                break;
        }

        //console.log("randomPosition", randomPosition)
        enemies.push(enemy);

        // reset the timer
        timeToSpawnEnemyAux = timeToSpawnEnemy;
        if (timeToSpawnEnemy > 0.33)
            timeToSpawnEnemy *= 0.98;
    }
    
}

function Draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    camera.PreDraw(ctx);
    
  
    ctx.drawImage(assets.BackGound.img,0,0, 549, 744, 0, 0, 1.6*574, 1.6*744);
    particleSystem.Draw(ctx);
    ctx.drawImage(assets.Ruins.img,0,30, 549, 744, 0, 0, 1.6*574, 1.6*744);
    ctx.drawImage(assets.Rocks.img,-5,0 + posicionY, 500, 744, 0, 0, 1.6*574, 1.6*744);
    // draw the enemies
    enemies.forEach(enemy => enemy.Draw(ctx));;
    
    // draw the player
    player.Draw(ctx);
  
    camera.PostDraw(ctx);

    if (gameOver) {
        if (puntuaciones.length<5)
        for (let i = 0 ; i < puntuaciones.length; i++) {
            ctx.fillText((i+1)+" .Lugar  puntucacion:  " + puntuaciones[i],canvas.width / 2-100, i*50+300);
         }
         if (puntuaciones.length>=5) 
         for (let i = 0 ; i < 5; i++) {
            ctx.fillText((i+1)+" .Lugar  puntucacion:  " + puntuaciones[i],canvas.width / 2-100, i*50+300);
         } 
      //  ctx.fillText(" puntuación:  " + enemiesKilled ,canvas.width / 2-100, 50+300);
        DrawGameOverScreen();
    }
    else {
        DrawKillsCount();
    }

  
    DrawLive(ctx)
 
}
// funcion que dibuja los corazones que tiene el personaje
function DrawLive(ctx) {

    for (let i = 0; i < this.player.life; i++) {
            ctx.drawImage(assets.Heart.img,10 + 40*i,60,40,40);  
    }
}
// fincion que pinta la puntuacion actual
function DrawKillsCount() {
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "36px Comic Sans MS regular";

    ctx.fillText(enemiesKilled, (canvas.width / 2)+300, 60);
}
// dibuja el game over
function DrawGameOverScreen() {
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "60px Comic Sans MS regular";

    ctx.fillText("GAME OVER", canvas.width / 2-100, 220);
    ctx.font = "32px Comic Sans MS regular";
   
    
   
}


window.onload = Init;
