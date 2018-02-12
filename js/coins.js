function NewCoin(options) {
	return {
		type: 'coin',
		width: 0.2,
		height: 0.2,
		position: {x: options.x, y: options.y},
		imgScale: 0.5,

		score: options.score || 100,

		toDelete: false,

		animation:{
			img: coinImg,
			timePerFrame: 1/24,
			currentFrametime: 0,
			frameWidth: 100,
			frameHeight: 100,
			actualX: 0,

			Update: function(deltaTime){
				this.currentFrametime += deltaTime;
				if(this.currentFrametime >= this.timePerFrame){
					this.actualX+=this.frameWidth;
					if(this.actualX > 999){
						this.actualX = 0;
					}
					this.currentFrametime = 0.0;
				}
			},

			Draw: function(ctx){
				ctx.drawImage(this.img, this.actualX, 0, 
				this.frameWidth, this.frameHeight, 
				-this.frameWidth/2, -this.frameHeight/2,
				this.frameWidth, this.frameHeight);
			}
		},

		physicsInfo: {
			density: 1.0,
            friction: 0.5,
			fixedRotation: true,
			linearDamping: 0.0,
            angularDamping: 0.0,
            restitution: 0.5,
			type: b2Body.b2_dynamicBody
		},

		body: null,

		Start: function(){
			this.body = CreateBall(world, this.position.x/scale, this.position.y / scale,
				this.width, this.height, this.physicsInfo);
			this.body.SetUserData(this);
		},

		Update: function(deltaTime){
			this.animation.Update(deltaTime);
		},

		Draw: function(ctx){
			var bodyPosition = this.body.GetPosition();
			var posX = bodyPosition.x * scale;
			var posY = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);
			ctx.save();
			ctx.translate(posX, posY);
			ctx.scale(this.imgScale, this.imgScale);
			this.animation.Draw(ctx);
			ctx.restore();
		}
	}
}