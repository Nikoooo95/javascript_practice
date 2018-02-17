function NewGoal (options) {
	return {
		type: options.type,
		width: options.width,
		height: options.height,
		position: {x: options.x, y: options.y},
		imgScale: 1,
		img: options.img,

		physicsInfo: {
			density: 10,
			fixedRotation: true,
			type: b2Body.b2_staticBody
		},

		body: null,

		Start: function(){
			this.body = CreateBox(world, this.position.x /scale+1.25, this.position.y / scale-0.75,
			0.75, 1, this.physicsInfo);
			this.body.SetUserData(this);
		},

		Update: function(deltaTime){
			
		},

		Draw: function(ctx){
			
			
			ctx.save();
			
			ctx.scale(this.imgScale, this.imgScale);
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