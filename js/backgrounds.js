function NewBackground (options) {
	return {
		type: 'background',
		width: 800.0,
		height: 450.0,
		position: {x: options.x, y: options.y},
		imgScale: 0.5,
        img: backgroundImg,
        
		animation:{
			img: options.img,
			timePerFrame: 1/24,
			currentFrametime: 0,
			frameWidth: 100,
			frameHeight: 100,
			actualX: 0,

			Draw: function(ctx){
				ctx.drawImage(this.img, this.actualX, 0, 
				this.frameWidth, this.frameHeight, 
				-this.frameWidth/2, -this.frameHeight/2,
				this.frameWidth, this.frameHeight);
			}
		},

		Start: function(){
			this.body = CreateBox(world, this.position.x/scale, this.position.y / scale,
				this.width, this.height, this.physicsInfo);
			this.body.SetUserData(this);
		},

		Update: function(deltaTime){
			
		},

		Draw: function(ctx){
			var bodyPosition = this.body.GetPosition();
			var posX = bodyPosition.x * scale;
			var posY = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);
			

			
			ctx.drawImage(this.img,
				0,
				0,
				this.width, this.height);
			ctx.restore();
		}
	}
}