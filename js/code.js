
var canvas;
var ctx;

var pi_2 = Math.PI * 2;

var fixedDeltaTime = 0.01666666; // 60fps: 1 frame each 16.66666ms
var deltaTime = fixedDeltaTime;

var time = 0,
    FPS  = 0,
    frames    = 0,
    acumDelta = 0;

//images references
var player1Img, player2Img, coinImg, floorImg, background1Img, background2Img, goalImg, ballImg, gameOverImg;

var player1, player2, floor, background1, background2, goalL, goalR, ball;

var power1, power2;

var coins = [];
var sounds={
    crowd: null,
    goal: null,
    hit: null
}
//var floors = [];

var timer;
var compareDate;
var matchDurationInMinutes = 1;
var seconds;
var minutes;
var gameOver = false;

function Init ()
{
    // preparamos la variable para el refresco de la pantalla
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

        background1Img = new Image();
        background1Img.src = "./media/background1.png";
        background2Img = new Image();
        background2Img.src = "./media/background2.png";
        
        gameOverImg = new Image();
        gameOverImg.src = "./media/gameover.png";
        
        goalImg = new Image();
        goalImg.src = "./media/goal.png";
        
        ballImg = new Image();
        ballImg.src = "./media/ball.png";

        floorImg = new Image();
        floorImg.src = "./media/grass.png";

        player1Img = new Image();
        player1Img.src = "./media/car.png";
        
        player2Img = new Image();
        player2Img.src = "./media/car2.png";
        
        
        
        sounds.crowd = document.getElementById('crowd');
        sounds.goal = document.getElementById('goal');
        sounds.hit = document.getElementById('hit');
        
        player2Img.onload = Start();
        
    }
    
    
}

function Start(){
    // setup keyboard events
    SetupKeyboardEvents();

    // setup mouse events
    SetupMouseEvents();


    PreparePhysics(ctx);
    
    this.background1 = NewBackground({x: 0, y:0, width:900, height:900, img: background1Img, type: 'background1'});
    
    this.background2 = NewBackground({x: 0, y: 0, width:800, height:450, img: background2Img, type: 'background2'});
    
    this.goalL = NewGoal({x: 670, y: 200, width: 167, height: 306, img: goalImg, type: 'goalL'});
    this.goalL.Start();
    
     this.goalR = NewGoal({x: -130, y: 200, width: 167, height: 306, img: goalImg, type: 'goalR'});
    this.goalR.Start();
    
//this.background1.Start();
    
    this.floor = NewFloor({x: 300, y: 20, width: 5.0, height: 0.2})
    this.floor.Start();
    //floors.push(floor1);

    //player.Start();

    ball = NewCoin({x: 400, y: 200, score: 1, img: ballImg, type: 'ball'});
    ball.Start();

    
    
    this.player1 = NewPlayer({x: 200, y: 200, img: player1Img, type: 'player1'});
    
    
    this.player2 = NewPlayer({x: 645, y: 200, img: player2Img, type: 'player2'});
    this.player2.moveLeft = true;
    this.player1.Start();
    this.player2.Start();
    compareDate = new Date();
   
    compareDate.setDate(compareDate.getDate() + (matchDurationInMinutes/1440));
    sounds.crowd.play();
    power1 = 0;
    power = 0;
        // first call to the game loop
    Loop();

}

function Loop ()
{
    requestAnimationFrame(Loop);

    var now = Date.now();
    deltaTime = now - time;
    if (deltaTime > 1000) // si el tiempo es mayor a 1 seg: se descarta
        deltaTime = 0;
    time = now;

    frames++;
    acumDelta += deltaTime;

    if (acumDelta > 1000)
    {
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

function Update ()
{
    input.update();

    // update physics
    // Step(timestep , velocity iterations, position iterations)
    world.Step(deltaTime, 8, 3);
    world.ClearForces();
    
    
    if(gameOver == false){
        // player logic
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
    
    if(input.isKeyPressed(KEY_SPACE) && player1.power>=300){
        player1.Power();
    }
    
    if(input.isKeyPressed(KEY_INTRO) && player2.power>=300){
        player2.Power();
    }

    background1.Update(deltaTime);
    player1.Update(deltaTime);
    player2.Update(deltaTime);
    ball.Update(deltaTime);
    
    if(ball.isGoal == true){
        RestartGoal();
    }
    if(ball.hitted ==true){
        ball.hitted=false;
        //sounds.hit.currentTime = 0;
        sounds.hit.play();
    }

    Clock(compareDate);
    
    if(player1.socre >= 10 || player2.score >= 10 || (minutes <= 0 && seconds <= 0) ){
        gameOver=true;
    }

    }
}

function Powerized(player){
    if(player.power<300 && player.isPowered == false){
        player.power+=0.5;
    }
}


function Draw (){
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    DrawWorld(world);
    
    DrawBackground();
    
    ctx.restore();

    goalL.Draw(ctx);
    goalR.Draw(ctx);
    floor.Draw(ctx);

    ctx.save();
    ctx.restore();
    player1.Draw(ctx);
    player2.Draw(ctx);

    ctx.save();
    ctx.restore();
    ball.Draw(ctx);
    
    //Draw Score
    ctx.fillStyle = "white";
    ctx.font = "30px Comic Sans MS";
    ctx.fillText(player1.score, 340, 210);
    ctx.fillText(player2.score, 440, 210);

    // draw the FPS
    ctx.fillStyle = "black";
    ctx.font = "10px Arial";
    ctx.fillText('FPS: ' + FPS, 10, 10);
    ctx.fillText('deltaTime: ' + Math.round(1 / deltaTime), 10, 20);
    ctx.fillText('total bodys: ' + world.GetBodyCount(), 10, 30);
    
    ctx.fillStyle = "white";
    ctx.font = "25px Arial";
    ctx.fillText(minutes + '   : ' + seconds, 365, 132);
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "green";
    ctx.fillRect(40, 20, player1.power, 25);
    ctx.scale(-1, 1);
    ctx.fillRect(-760, 20, player2.power, 25);
    ctx.restore();
    
    if(gameOver){
        ctx.drawImage(gameOverImg, 0, 0, 599, 480, 100, 0, 599, 450);
        ctx.fillStyle = "black";
        ctx.font = "55px Comic Sans MS";
        ctx.fillText(player1.score + "             " + player2.score, 260, 250);
        //ctx.fillText(, 440, 210);
        if(input.isKeyPressed(KEY_SPACE)){
            window.location.reload();
        }
    }

}

function DrawBackground (){
    background1.Draw(ctx);
    ctx.drawImage(background2.img, 0, 0, background2.width, background2.height);
}

function DrawWorld (world){
    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    world.DrawDebugData();
    ctx.restore();
}


function RestartGoal(){
    //sounds.goal.Play();
    sounds.goal.play();
    ball.isGoal = false;
    player1.Restart();
    player2.Restart();
    ball.Restart();
}

function Clock(toDate){

    //console.log(toDate);
    var dataEntered = toDate;
    var now = new Date();
    var difference = dataEntered.getTime() - now.getTime();
   /* if(difference <= 0){
        //TO-DO
    }else{*/
        seconds = Math.floor(difference/1000);
        minutes = Math.floor(seconds/60);
        
        seconds %= 60;
        minutes %=60;

    ctx.save();
ctx.restore();
    
        
   // }
}
