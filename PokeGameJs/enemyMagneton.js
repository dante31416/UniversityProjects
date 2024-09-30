
class enemyMagneton extends Enemy {
    constructor(img, initialPosition, life, small, direction) {
        super(img, initialPosition, life);
        this.small = small;
        this.tipo = typesEnemy.MAGNETON;
        if (this.small)
        {
            this.tipo = typesEnemy.MAGNEMITE;
        }
       
    }

    Update(deltaTime) {
    

        this.position.y +=  this.speed * deltaTime;
        
    }

    Damage(damage) {
        const dead = super.Damage(damage); 
      
        if (dead && !this.small) {
            // spawn two small Magnemites
            sfx.magnemite.play();
            const enemyMagnemiteA = new enemyMagneton(this.img,new Vector2(this.position.x, this.position.y) , 1, true);
            enemies.push(enemyMagnemiteA);

            const enemyMagnemiteB = new enemyMagneton(this.img, new Vector2(this.position.x-50, this.position.y) , 1, true);
            enemies.push(enemyMagnemiteB);

            const enemyMagnemiteC = new enemyMagneton(this.img, new Vector2(this.position.x+50, this.position.y) , 1, true);
            enemies.push(enemyMagnemiteC);
        }
         
        return dead;
    }

}
