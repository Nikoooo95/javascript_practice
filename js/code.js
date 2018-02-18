/*
 * MAIN CODE
 * Copyright © 2018+ Nicolás Tapia Sanz
 *
 * Cada jugador controla un vehículo. Uno controla el coche rojo con WASD y ESPACIO para el turbo,
 * el otro controla el azul con las flechas de dirección e INTRO para el turbo.
 *
 * El objetivo es marcar en la portería contraria.
 * El juego concluye cuando hayan pasado 4 minutos o alguno de los jugadores haya marcado 5 goles.
 *
 *
 * Distributed under the Boost Software License, version  1.0
 * See documents/LICENSE.TXT or www.boost.org/LICENSE_1_0.txt
 *
 * nic.tap95@gmail.com
 */
var canvas;
var ctx;

var pi_2 = Math.PI * 2;

var fixedDeltaTime = 0.01666666; // 60fps: 1 frame each 16.66666ms
var deltaTime = fixedDeltaTime;

var time = 0,
    FPS  = 0,
    frames    = 0,
    acumDelta = 0;

//Referencia a las imagenes
var player1Img, player2Img, floorImg, background1Img, background2Img, goalImg, ballImg, gameOverImg;

//Referencia a los objetos
var player1, player2, floor, background1, background2, goalL, goalR, ball;

//Sonidos del juego
var sounds={
    crowd: null,
    goal: null,
    hit: null
}

//Valores para el Temporizador
var timer;
var compareDate;

//TIEMPO QUE DURA EL PARTIDO
var matchDurationInMinutes = 4;
var seconds;
var minutes;

//TRUE cuando el juego acaba, FALSE mientra se juega el partido
var gameOver = false;

function Init (){
    
    window.requestAnimationFrame = (function (evt) {
        return window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, fixedDeltaTime * 1000);
            };
    }) ();

    canvas = document.getElementById("my_canvas");
    
    if (canvas.getContext)
    {
        ctx = canvas.getContext('2d');

        //Carga de fondos
        background1Img = new Image();
        background1Img.src = "./media/background1.png";
        background2Img = new Image();
        background2Img.src = "./media/background2.png";
        
        //Carga de la pantalla de Game Over
        gameOverImg = new Image();
        gameOverImg.src = "./media/gameover.png";
        
        //Carga de las porterias
        goalImg = new Image();
        goalImg.src = "./media/goal.png";
        
        //Carga de la pelota
        ballImg = new Image();
        ballImg.src = "./media/ball.png";

        //Carga del suelo
        floorImg = new Image();
        floorImg.src = "./media/grass.png";

        //Carga de los jugadores
        player1Img = new Image();
        player1Img.src = "./media/car.png";
        player2Img = new Image();
        player2Img.src = "./media/car2.png";
        
        //Asignaciones de sonidos
        sounds.crowd = document.getElementById('crowd');
        sounds.goal = document.getElementById('goal');
        sounds.hit = document.getElementById('hit');
        
        //Una vez que se haya cargado la ultima imagen, se inicia el juego
        player2Img.onload = Start();
    }
}

function Start(){
    
    // setup keyboard events
    SetupKeyboardEvents();
    // setup mouse events
    SetupMouseEvents();

    PreparePhysics(ctx);
    
    //Creación de los fondos
    this.background1 = NewBackground({x: 0, y:0, width:900, height:900, img: background1Img, type: 'background1'});
    this.background2 = NewBackground({x: 0, y: 0, width:800, height:450, img: background2Img, type: 'background2'});
    
    //Creación de las porterias
    this.goalL = NewGoal({x: 670, y: 200, width: 167, height: 306, img: goalImg, type: 'goalL'});
    this.goalL.Start();
    this.goalR = NewGoal({x: -130, y: 200, width: 167, height: 306, img: goalImg, type: 'goalR'});
    this.goalR.Start();
    
    //Creación del suelo
    this.floor = NewFloor({x: 300, y: 20, width: 5.0, height: 0.2})
    this.floor.Start();

    //Creación de la pelota
    this.ball = NewBall({x: 400, y: 200, score: 1, img: ballImg, type: 'ball'});
    ball.Start();

    //Creación de los jugadores
    this.player1 = NewPlayer({x: 200, y: 200, img: player1Img, type: 'player1'});
    this.player2 = NewPlayer({x: 645, y: 200, img: player2Img, type: 'player2'});
    this.player2.moveLeft = true;
    this.player1.Start();
    this.player2.Start();
    
    //Arranque del temporizador
    compareDate = new Date();
    compareDate.setDate(compareDate.getDate() + (matchDurationInMinutes/1440));
    
    //Sonido de fondo del juego
    sounds.crowd.play();
    
    //Primera llamada al Loop -------
    Loop();
}

function Loop (){
    
    requestAnimationFrame(Loop);

    var now = Date.now();
    deltaTime = now - time;
    if (deltaTime > 1000) // si el tiempo es mayor a 1 seg: se descarta
        deltaTime = 0;
    time = now;

    frames++;
    acumDelta += deltaTime;

    if (acumDelta > 1000){
        FPS = frames;
        frames = 0;
        acumDelta -= 1000;
    }
    
    // transform the deltaTime from miliseconds to seconds
    deltaTime /= 1000;

    // Game logic -------------------
    Update();

    // Draw the game ----------------
    Draw();
}

function Update (){
    
    input.update();

    world.Step(deltaTime, 8, 3);
    world.ClearForces();
    
    //Si el juego no ha acabado...
    if(gameOver == false){
        // player logic
        
        //MOVIMIENTO DEL JUGADOR 1
        if(input.isKeyPressed(KEY_D)){
            player1.moveRight = true;
            Powerized(player1);
        }
        if(input.isKeyPressed(KEY_A)){
            player1.moveLeft = true;
            Powerized(player1);
        }
        if(input.isKeyPressed(KEY_W)){
            player1.Jump();
            Powerized(player1);
        }
        
        //MOVIMIENTO DEL JUGADOR 2
        if(input.isKeyPressed(KEY_LEFT)){
            player2.moveLeft = true;
            Powerized(player2);
        }
        if(input.isKeyPressed(KEY_RIGHT)){
            player2.moveRight = true;
            Powerized(player2);
        }
        if(input.isKeyPressed(KEY_UP)){
            player2.Jump();
                Powerized(player2);
        }

        //TURBO DEL JUGADOR 1
        if(input.isKeyPressed(KEY_SPACE) && player1.power>=300){
            player1.Power();
        }
        //TURBO DEL JUGADOR 2
        if(input.isKeyPressed(KEY_INTRO) && player2.power>=300){
            player2.Power();
        }

        //Actualización del fondo 1
        background1.Update(deltaTime);
        
        //Actualización de los jugadores
        player1.Update(deltaTime);
        player2.Update(deltaTime);
        
        //Actualización de la pelota
        ball.Update(deltaTime);

        //En caso de que se haya marcado gol, se reinicia la partida
        if(ball.isGoal){
            RestartGoal();
        }
        
        //Si el balón se ha golpeado, se reproduce un sonido
        if(ball.hitted){
            ball.hitted=false;
            sounds.hit.play();
        }

        //Actualización del temporizador
        Clock(compareDate);

        //Comprobación del fin de juego
        if(player1.score >= 10 || player2.score >= 10 || (minutes <= 0 && seconds <= 0) ){
            gameOver=true;
        }

    }
}

//Si el jugador muve su vehiculo, este se recarga de potencia
function Powerized(player){
    if(player.power<300 && player.isPowered == false){
        player.power+=0.5;
    }
}

//MÉTODO DE DIBUJADO -------
function Draw (){
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    DrawWorld(world);
    
    //DIBUJADO DE FONDOS
    DrawBackground();    
    ctx.restore();

    //DIBUJADO DE PORTERIAS Y SUELO
    goalL.Draw(ctx);
    goalR.Draw(ctx);
    floor.Draw(ctx);
    ctx.save();
    ctx.restore();
    
    //DIBUJADO DE VEHICULOS
    player1.Draw(ctx);
    player2.Draw(ctx);
    ctx.save();
    ctx.restore();
    
    //DIBUJADO DE LA PELOTA
    ball.Draw(ctx);
    
    //DIBUJADO DE LA PUNTUACIÓN
    ctx.fillStyle = "white";
    ctx.font = "30px Comic Sans MS";
    ctx.fillText(player1.score, 340, 210);
    ctx.fillText(player2.score, 440, 210);
    
    //DIBUJADO DEL CRONOMETRO
    ctx.fillStyle = "white";
    ctx.font = "25px Arial";
    ctx.fillText(minutes + '  :  ' + seconds, 365, 132);
    ctx.restore();
    ctx.save();
    
    //DIBUJADO DE LAS BARRAS DE POTENCIA
    ctx.fillStyle = "green";
    ctx.fillRect(40, 20, player1.power, 25);
    ctx.scale(-1, 1);
    ctx.fillRect(-760, 20, player2.power, 25);
    ctx.restore();
    
    //DIBUJADO DE LA PANTALLA DE GAMEOVER
    if(gameOver){
        ctx.drawImage(gameOverImg, 0, 0, 599, 480, 100, 0, 599, 450);
        ctx.fillStyle = "black";
        ctx.font = "55px Comic Sans MS";
        ctx.fillText(player1.score + "             " + player2.score, 260, 250);
        if(input.isKeyPressed(KEY_SPACE)){
            window.location.reload();
        }
    }
    
    //DIBUJADO DE LOS FPS, DELTATIME Y BODYS
    ctx.fillStyle = "black";
    ctx.font = "10px Arial";
    ctx.fillText('FPS: ' + FPS, 10, 10);
    ctx.fillText('deltaTime: ' + Math.round(1 / deltaTime), 10, 20);
    ctx.fillText('total bodys: ' + world.GetBodyCount(), 10, 30);
    
}

//DIBUJADO DE LOS FONDOS
function DrawBackground (){
    background1.Draw(ctx);
    ctx.drawImage(background2.img, 0, 0, background2.width, background2.height);
}

//PREPARACIÓN DEL CANVAS Y EL MUNDO
function DrawWorld (world){
    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    world.DrawDebugData();
    ctx.restore();
}

//REINICIO TRAS UN GOL
function RestartGoal(){
    //Reproducción del sonido de Gol
    sounds.goal.play();
    ball.isGoal = false;
    
    //Recolocación de objetos
    player1.Restart();
    player2.Restart();
    ball.Restart();
}

//CONTROLADOR DEL TEMPORIZADOR
function Clock(toDate){
    var dataEntered = toDate;
    var now = new Date();
    var difference = dataEntered.getTime() - now.getTime();

    seconds = Math.floor(difference/1000);
    minutes = Math.floor(seconds/60);
    seconds %= 60;
    minutes %=60;

    ctx.save();
    ctx.restore();
}
