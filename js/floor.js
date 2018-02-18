/*
 * Floor
 * Copyright © 2018+ Nicolás Tapia Sanz
 *
 * Distributed under the Boost Software License, version  1.0
 * See documents/LICENSE.TXT or www.boost.org/LICENSE_1_0.txt
 *
 * nic.tap95@gmail.com
 */

function NewFloor (options) {
	return {
        //PROPIEDADES DEL SUELO
		type: "floor",
		width: options.width,
		height: options.height,
		position: {x: options.x, y: options.y},
		img: floorImg,

        //FÍSICAS DEL SUELO
		physicsInfo: {
			density: 10,
			fixedRotation: true,
			type: b2Body.b2_staticBody
		},

		body: null,

        //INICIALIZACIÓN DEL CUERPO FÍSICO DEL SUELO
		Start: function(){
			this.body = CreateBox(world, this.position.x/scale, this.position.y / scale,
				this.width, this.height/10, this.physicsInfo);
			this.body.SetUserData(this);
		},

		Update: function(deltaTime){
		},

        //DIBUJADO DEL SUELO
		Draw: function(ctx){
			ctx.drawImage(this.img, 0, 0,
				this.width * scale * 2, this.height * scale * 4, 
                0, 414, this.width * scale* 2, this.height * scale * 2 );
			ctx.restore();
		}
	}
}