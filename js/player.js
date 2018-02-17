
function NewPlayer(options) {
    return {
        type: options.type,
        position:{x: options.x, y: options.y},
        width: 0.37,
        height: 0.27,


        isGoingLeft: false,

        //movement Attributes
        maxHorizontalVel: 4,
        maxVerticalVel: 6,
        jumpForce: 4,

        moveLeft: false,
        moveRight: false,
        moveUp: false,

        canJump: false,
        bodyInit: null,
        power: 0,
        isPowered: false,
        score: 0,
    img: options.img,
        animation:{

            timePerFrame: 1/24,
            currentFrametime: 0,
            frameWidth: 317,
            frameHeight: 214,
            actualX: 0,
            actualY: 0,

            Update: function(deltaTime){
                this.currentFrametime += deltaTime;
                if(this.currentFrametime >= this.timePerFrame){
                    this.actualX+=this.frameWidth;
                    if(this.actualX > 634){
                        this.actualX = 0;
                    }
                    this.currentFrametime = 0.0;
                }
            },

            Draw: function(ctx){
                ctx.save();
                ctx.restore();
                ctx.drawImage(options.img, this.actualX, this.actualY, 
                    this.frameWidth, this.frameHeight, 
                    -this.frameWidth/8, -this.frameHeight/8,
                    this.frameWidth/4, this.frameHeight/4);
                ctx.restore();

            }
        },

        physicsInfo: {
            density: 1,
            fixedRotation: true,
            linearDamping: 1,
            user_data: player1,
            type: b2Body.b2_dynamicBody,
            restitution: 0.0
        },

        body: null,

        Start: function(){
            this.animation.img = options.image;

            this.body = CreateBox(world, 
                this.position.x / scale, this.position.y / scale,
                this.width, this.height, this.physicsInfo);
            bodyInit = this.body;

        },

        Update: function(deltaTime){
            this.animation.Update(deltaTime);
            if(this.isPowered == false){
                    if(this.moveRight){
                    this.ApplyVelocity(new b2Vec2(1, 0));
                    this.moveRight = false;
                    this.isGoingLeft = false;

                }

                if(this.moveLeft){
                    this.ApplyVelocity(new b2Vec2(-1, 0));
                    this.moveLeft = false;
                    this.isGoingLeft = true;

                }

                if(this.moveUp){
                    this.ApplyVelocity(new b2Vec2(0, this.jumpForce));
                    this.moveUp = false;

                }
            }else{
                this.Power();
            }

            
        },

        Draw: function(ctx){
                var bodyPosition = this.body.GetPosition();
                var posX = bodyPosition.x * scale;
                var posY = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);
                ctx.save();
                ctx.translate(posX, posY);
                if(this.isGoingLeft){
                    ctx.scale(-1, 1);
                }
                this.animation.Draw(ctx);
                ctx.restore();
        },

        ApplyVelocity: function(vel){
            var bodyVel = this.body.GetLinearVelocity();
            bodyVel.Add(vel);

            //Horizontal Movement
            if(Math.abs(bodyVel.x)>this.maxHorizontalVel){
                bodyVel.x = this.maxHorizontalVel * bodyVel.x / Math.abs(bodyVel.x);
            }

            //Vertical Movement
            if(Math.abs(bodyVel.y)>this.maxVerticalVel){
                bodyVel.y = this.maxVerticalVel * bodyVel.y / Math.abs(bodyVel.y);
            }


            this.body.SetLinearVelocity(bodyVel);
        },

        Jump: function(){
            if(Math.abs(this.body.GetLinearVelocity().y) > 0){
                return false;
            }
            this.moveUp = true;
        },

        Restart: function(){
            moveLeft: false;
            moveRight: false;
            moveUp: false;
            canJump: false; 
            this.power = 0;
            this.body.GetWorld().DestroyBody(this.body);
            this.body = CreateBox(world, 
                this.position.x / scale, this.position.y / scale,
                this.width, this.height, this.physicsInfo);
            if(this.type == 'player1'){
                this.isGoingLeft = false;
            }
            if(this.type == 'player2'){
                this.isGoingLeft = true;
            }
            ctx.restore();
        },
        
        Power: function(){
            this.isPowered = true;
                if(this.moveRight){
                    this.ApplyVelocity(new b2Vec2(4, 0));
                    this.moveRight = false;
                    this.isGoingLeft = false;
                }

                if(this.moveLeft){
                    this.ApplyVelocity(new b2Vec2(-4, 0));
                    this.moveLeft = false;
                    this.isGoingLeft = true;

                }

                if(this.moveUp){
                    this.ApplyVelocity(new b2Vec2(0, this.jumpForce*3));
                    this.moveUp = false;
                }
                this.power--;
            if(this.power <= 0){
                this.isPowered = false;
                this.power = 0;
            }
             
        }
    }
}