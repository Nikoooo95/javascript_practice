function NewCoin(options) {
	return {
		type: 'coin',
		width: 0.2,
		height: 0.2,
		position: {x: options.x, y: options.y},
		imgScale: 0.5,

		score: options.score || 1,

        isGoal: false,
        img: options.img,

		physicsInfo: {
			density: 100000.0,
            friction: 100000,
			fixedRotation: true,
			linearDamping: 100000.0,
            angularDamping: 10000.0,
            restitution: 10000.0,
			type: b2Body.b2_dynamicBody
		},

		body: null,

		Start: function(){
			this.body = CreateBall(world, this.position.x/scale, this.position.y / scale,
				this.width, this.height, this.physicsInfo);
			this.body.SetUserData(this);
		},

		Update: function(deltaTime){
			//this.animation.Update(deltaTime);
		},

		Draw: function(ctx){
           var bodyPosition = this.body.GetPosition();
			var posX = bodyPosition.x * scale;
			var posY = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);
			
			ctx.save();
			
			ctx.translate(posX, posY);
			ctx.scale(this.imgScale, this.imgScale);
			
			ctx.drawImage(this.img,
				-this.width * scale*2,
				-this.height * scale*2,
				this.width * scale * 4 , this.height * scale * 4 );
			ctx.restore();
		}
	}
}