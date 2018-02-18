/*
 * Background
 * Copyright © 2018+ Nicolás Tapia Sanz
 *
 * Distributed under the Boost Software License, version  1.0
 * See documents/LICENSE.TXT or www.boost.org/LICENSE_1_0.txt
 *
 * nic.tap95@gmail.com
 */

function NewBackground (options) {
	return {
        
        //PROPIEDADES DEL FONDO
		type: options.type,                       //Nombre
		width: options.width,                     //Anchura
		height: options.height,                   //Altura
		position: {x: options.x, y: options.y},   //Posicion
        img: options.img,                         //Image
        angle: 0,                                 //Angulo
        
		Update: function(deltaTime){
			if(this.type == 'background1'){
                //Actualización de la rotación del fondo 1
                this.angle = (this.angle - 0.03) % 360;
            }
		},

        //Este método tan solo se llama para el fondo que gira
		Draw: function(ctx){
            ctx.save();
            //Traslación al centro, rotación y recolocación
            ctx.translate(400, 225);
            ctx.rotate(this.angle * Math.PI /180);
            ctx.translate(-400, -225);
            //Imagen del fondo
			ctx.drawImage(this.img, 0, 0, this.width, this.height, -50,-225, this.width, this.height);
			ctx.restore();
		},
        
	}
}