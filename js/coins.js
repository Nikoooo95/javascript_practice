function NewCoin(options) {
	return {
		type: options.type,
		width: 0.2,
		height: 0.2,
		position: {x: options.x, y: options.y},
		imgScale: 0.5,

		score: options.score || 1,

        isGoal: false,
        img: options.img,
        hitted: false,
        
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
        
        Restart: function(){
            isGoal = false;
            this.body.GetWorld().DestroyBody(this.body);
            this.body = CreateBall(world, this.position.x/scale, this.position.y / scale,
				this.width, this.height, this.physicsInfo);
			this.body.SetUserData(this);
        
            ctx.restore();
        }
	}
}