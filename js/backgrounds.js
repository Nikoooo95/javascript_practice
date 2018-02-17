function NewBackground (options) {
	return {
		type: options.type,
		width: options.width,
		height: options.height,
		position: {x: options.x, y: options.y},
		imgScale: 0.5,
        img: options.img,
        angle: 0,
        
		Update: function(deltaTime){
			if(this.type == 'background1'){
                this.angle = (this.angle - 0.03) % 360;
            }
		},

		Draw: function(ctx){
            ctx.save();
            ctx.translate(400, 218);
            //ctx.translate(0,0);
            ctx.rotate(this.angle * Math.PI /180);
            ctx.translate(-400, -225);
			ctx.drawImage(this.img, 0, 0, this.width, this.height, -50,-225, this.width, this.height);
            ctx.rotate(-this.angle * Math.PI /180);
			ctx.restore();
		},
        
        
	}
}