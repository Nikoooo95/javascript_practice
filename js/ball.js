/*
 * Ball
 * Copyright © 2018+ Nicolás Tapia Sanz
 *
 * Distributed under the Boost Software License, version  1.0
 * See documents/LICENSE.TXT or www.boost.org/LICENSE_1_0.txt
 *
 * nic.tap95@gmail.com
 */

function NewBall(options) {
	return {
        
        //Propiedades de la PELOTA
		type: options.type,
		width: 0.2,
		height: 0.2,
		position: {x: options.x, y: options.y},
		imgScale: 0.5,
		score: options.score || 1,
        img: options.img,
        
        isGoal: false, //Si se ha marcado gol con ella
        hitted: false, //Si ha sido golpeada con algo
        
        //FÍSICAS
		physicsInfo: {
            density: 1,
            fixedRotation: true,
            linearDamping: 1,
            user_data: player1,
            type: b2Body.b2_dynamicBody,
            restitution: 0.0
	   },

		body: null,

        //Inicialización de las físicas de la pelota
		Start: function(){
			this.body = CreateBall(world, 
                        this.position.x/scale, this.position.y / scale,
                        this.width, this.height, this.physicsInfo);
            
			this.body.SetUserData(this);
		},

		Update: function(deltaTime){
		},

        //DIBUJADO DE LA PELOTA
		Draw: function(ctx){
            
            var bodyPosition = this.body.GetPosition();
			var posX = bodyPosition.x * scale;
			var posY = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);
			var bodyRotation = this.body.GetAngle();
            
			ctx.save();
			ctx.translate(posX, posY);
			ctx.scale(this.imgScale, this.imgScale);
			ctx.rotate(-bodyRotation);
            
			ctx.drawImage(this.img,
				-this.width * scale*2,
				-this.height * scale*2,
				this.width * scale * 4 , this.height * scale * 4 );
			ctx.restore();
		},
        
        //REINICIADO DE LA PELOTA
        Restart: function(){
            isGoal = false;
            this.body.GetWorld().DestroyBody(this.body); //Se borra su cuerpo físico para quitar cualquier física que pueda tener...
            this.body = CreateBall(world, this.position.x/scale, this.position.y / scale, 
				this.width, this.height, this.physicsInfo); //Y se crea un nuevo cuerpo física con las mismas físicas que tenía al principio.
			this.body.SetUserData(this);
            ctx.restore();
        }
        
	}
    
}