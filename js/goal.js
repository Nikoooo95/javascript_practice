/*
 * Goal
 * Copyright © 2018+ Nicolás Tapia Sanz
 *
 * Distributed under the Boost Software License, version  1.0
 * See documents/LICENSE.TXT or www.boost.org/LICENSE_1_0.txt
 *
 * nic.tap95@gmail.com
 */

function NewGoal (options) {
	return {
        //PROPIEDADES DE LA PORTERIA
		type: options.type,
		width: options.width,
		height: options.height,
		position: {x: options.x, y: options.y},
		img: options.img,

        //FÍSICAS DE LA PORTERÍA
		physicsInfo: {
			density: 10,
			fixedRotation: true,
			type: b2Body.b2_staticBody
		},

		body: null,

        //INICIALIZACIÓN DEL CUERPO FÍSICO DE LA PORTERÍA
		Start: function(){
			this.body = CreateBox(world, this.position.x /scale+1.25, this.position.y / scale-0.75,
			0.75, 1, this.physicsInfo);
			this.body.SetUserData(this);
		},

		Update: function(deltaTime){
		},

        //DIBUJADO DE LA PORTERÍA
		Draw: function(ctx){
			ctx.save();
            
            //Si la portería es la dererecha, se invierte el sprite.
            if(this.type == 'goalR'){
                ctx.scale(-1, 1);
            }
			
			ctx.drawImage(this.img,
				this.position.x,
				this.position.y,
				this.width, this.height);
			ctx.restore();
           
		}

	}
}