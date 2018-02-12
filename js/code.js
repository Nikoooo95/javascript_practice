
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
var playerImg, coinImg, floorImg;

var coins = [];
var floors = [];

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

        coinImg = new Image();
        coinImg.src = "./media/coin.png";

        floorImg = new Image();
        floorImg.src = "./media/floor.png";

        playerImg = new Image();
        playerImg.src = "./media/car.png";
        playerImg.onload = Start();

        
    }
}

function Start(){
    // setup keyboard events
    SetupKeyboardEvents();

    // setup mouse events
    SetupMouseEvents();


    PreparePhysics(ctx);


    var floor1 = NewFloor({x: 120, y: 100, width: 1.0, height: 0.2})
    floor1.Start();
    floors.push(floor1);

    player.Start();

    var coin = NewCoin({x: 300, y: 160, score: 50});
    coin.Start();
    coins.push(coin);

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

    // player logic
    if(input.isKeyPressed(KEY_LEFT)){
        player.moveLeft = true;
    }

    if(input.isKeyPressed(KEY_RIGHT)){
        player.moveRight = true;
    }

    if(input.isKeyPressed(KEY_UP)){
        player.Jump();
    }

    player.Update(deltaTime);


    //Update Coins
    for(var i = 0; i<coins.length; i++){
        coins[i].Update(deltaTime);
        if(coins[i].toDelete){
            world.DestroyBody(coins[i].body);
            coins.splice(i, 1);
        }
    }


    
}

function Draw ()
{
    // clean the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the background
    DrawBackground();

    // draw the world
    DrawWorld(world);

    for(var i = 0; i<floors.length; i++){
        floors[i].Draw(ctx);
    }

    //Draw the player
    player.Draw(ctx);

    //Draw coins
    for(var i = 0; i<coins.length; i++){
        coins[i].Draw(ctx);
    }
    
    //Draw Score
    ctx.fillStyle = "black";
    ctx.font = "20px Comic Sans MS";
    ctx.fillText('Score: ' + player.score, 680, 24);


    // draw the FPS
    ctx.fillStyle = "black";
    ctx.font = "10px Arial";
    ctx.fillText('FPS: ' + FPS, 10, 10);
    ctx.fillText('deltaTime: ' + Math.round(1 / deltaTime), 10, 20);
    ctx.fillText('total bodys: ' + world.GetBodyCount(), 10, 30);
}

function DrawBackground ()
{
    // background
}

function DrawWorld (world)
{
    // Transform the canvas coordinates to cartesias coordinates
    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    world.DrawDebugData();
    ctx.restore();
}

function DeleteCoin(coin){

    var found = false;
    while(!found && i<coins.length){
        if(coins[i] == coin){
            found = true;
            coins.splice(i, 1);
        }else{
            i++;
        }

    }
}
