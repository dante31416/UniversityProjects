const typesEnemy = {
    DEFAULT: "Default",
    ARBOK: "arbok",
    NIDOKING: "nidoking",
    MAGNETON: "magneton",
    MAGNEMITE: "magnemite",

}
const statesEnemy = {
    DEFAULT: "Default",
    MOVE: "Move",
    DAMAGED: "Death",

}
class Enemy {

    constructor(img, initialPosition, life) {
        this.img = img;
        this.position = Vector2.Copy(initialPosition);
        this.SpawnPoint = Vector2.Copy(initialPosition);
        this.rotation = PIH;
        this.life = life;
        this.tipo = typesEnemy.NIDOKING;
        this.enemystate = statesEnemy.MOVE;
        this.enemyAnimations = new Animations(TAnimationEnemies);
        this.boundingRadius = 18;
        this.boundingRadius2 = this.boundingRadius * this.boundingRadius;

        this.speed = 50;
    }

    Update(deltaTime) {
        
        this.position.y +=  this.speed * deltaTime;
    }

    Draw(ctx) {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation - PIH);
        ctx.scale(1.2, 1.2);
        this.enemyAnimations.ActualAnimation(this.tipo + this.enemystate);//nidokingMove
        ctx.drawImage(this.img,this.enemyAnimations.frameX * this.enemyAnimations.spriteWidth,this.enemyAnimations.frameY* this.enemyAnimations.spriteHiegh, this.enemyAnimations.spriteWidth, this.enemyAnimations.spriteHiegh, -15, -23, 32, 32);

        ctx.restore();

        //ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.beginPath();
        //ctx.arc(this.position.x, this.position.y, this.boundingRadius, 0, Math.PI * 2, false);
        ctx.fill();
    }

    Damage(damage) {
        this.state = statesEnemy.DAMAGED;
    
        this.life -= damage;
        if (this.life < 0)
            this.life = 0;
        
        return this.life <= 0;
    }
   

}
