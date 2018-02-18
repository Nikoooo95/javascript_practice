/*
 * Player
 * Copyright © 2018+ Nicolás Tapia Sanz
 *
 * Distributed under the Boost Software License, version  1.0
 * See documents/LICENSE.TXT or www.boost.org/LICENSE_1_0.txt
 *
 * nic.tap95@gmail.com
 */

function NewPlayer(options) {
    return {
        //PROPIEDADES DEL JUGADOR
        type: options.type,
        position:{x: options.x, y: options.y},
        width: 0.37,
        height: 0.27,
        img: options.img,
        
        //Potencia y Puntuación
        power: 0,
        score: 0,
        
        //movement Attributes
        maxHorizontalVel: 4,
        maxVerticalVel: 6,
        jumpForce: 4,

        //Direccion
        moveLeft: false,
        moveRight: false,
        moveUp: false,

        //Posibilidad de movimientos
        canJump: false,
        isPowered: false,
        isGoingLeft: false,
        
        bodyInit: null,
       
        //ANIMACIÓN DE SPRITE Y DIBUJADO
        animation:{

            timePerFrame: 1/24,
            currentFrametime: 0,
            frameWidth: 317,
            frameHeight: 214,
            actualX: 0,
            actualY: 0,

            //ACTUALIZACIÓN DEL SPRITE
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

            //DIBUJADO DE LOS SPRITES
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

        //FÍSICAS DEL JUGADOR
        physicsInfo: {
            density: 1,
            fixedRotation: true,
            linearDamping: 1,
            user_data: player1,
            type: b2Body.b2_dynamicBody,
            restitution: 0.0
        },

        body: null,

        //INICIALIZACIÓN DEL CUERPO FÍSICO DEL PLAYER
        Start: function(){
            this.body = CreateBox(world, 
                this.position.x / scale, this.position.y / scale,
                this.width, this.height, this.physicsInfo);
            bodyInit = this.body;
        },

        //UPDATE DEL PERSONAJE
        Update: function(deltaTime){
            
            //Actualización del sprite del player
            this.animation.Update(deltaTime);
            
            //Si no tiene potencia...
            if(this.isPowered == false){
                
                //Movimiento hacia la derecha sin potencia
                if(this.moveRight){
                    this.ApplyVelocity(new b2Vec2(1, 0));
                    this.moveRight = false;
                    this.isGoingLeft = false;
                }

                //Movimiento hacia la izquierda sin potencia
                if(this.moveLeft){
                    this.ApplyVelocity(new b2Vec2(-1, 0));
                    this.moveLeft = false;
                    this.isGoingLeft = true;
                }

                //Salto sin potencia
                if(this.moveUp){
                    this.ApplyVelocity(new b2Vec2(0, this.jumpForce));
                    this.moveUp = false;
                }
                
            }else{
                
                //Movimiento en caso de tener potencia
                this.Power();
            }
        },

        //Dibujado de los sprites
        Draw: function(ctx){
            
                var bodyPosition = this.body.GetPosition();
                var posX = bodyPosition.x * scale;
                var posY = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);
                ctx.save();
                ctx.translate(posX, posY);
            
                //En caso de que vaya hacia la izquierda, se voltea el canvas
                if(this.isGoingLeft){
                    ctx.scale(-1, 1);
                }
                
                //Llamada al dibujado
                this.animation.Draw(ctx);
                ctx.restore();
        },

        //VELOCIDADES DEL PLAYER
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

        //SALTO DEL PLAYER
        Jump: function(){
            if(Math.abs(this.body.GetLinearVelocity().y) > 0){
                return false;
            }
            this.moveUp = true;
        },

        //REINICIO DEL PLAYER TRAS MARCARSE UN GOL
        Restart: function(){
            
            //Potencia igual a 0 y regeneración de la caja de físicas
            this.power = 0;
            this.body.GetWorld().DestroyBody(this.body);
            this.body = CreateBox(world, 
                this.position.x / scale, this.position.y / scale,
                this.width, this.height, this.physicsInfo);
            
            //RESITUACIÓN DE LA DIRECCION DEL SPRITE
            if(this.type == 'player1'){
                this.isGoingLeft = false;
            }
            if(this.type == 'player2'){
                this.isGoingLeft = true;
            }
            ctx.restore();
        },
        
        //MOVIMIENTO EN CASO DE USAR EL POWER
        Power: function(){
            this.isPowered = true;
            
            //MOVIMIENTO HACIA LA DERECHA CON POTENCIA
            if(this.moveRight){
                this.ApplyVelocity(new b2Vec2(4, 0));
                this.moveRight = false;
                this.isGoingLeft = false;
            }
                
            //MOVIMIENTO HACIA LA IZQUIERDA CON POTENCIA
            if(this.moveLeft){
                this.ApplyVelocity(new b2Vec2(-4, 0));
                this.moveLeft = false;
                this.isGoingLeft = true;
            }

            //SALTO CON POTENCIA
            if(this.moveUp){
                this.ApplyVelocity(new b2Vec2(0, this.jumpForce*3));
                this.moveUp = false;
            }
            
            //DISMINUCIÓN DE LA POTENCIA EN CADA FRAME
            this.power--;
            
            //REINICIO DEL POWER EN CASO DE QUE SE ACABE
            if(this.power <= 0){
                this.isPowered = false;
                this.power = 0;
            }
             
        }
    }
}