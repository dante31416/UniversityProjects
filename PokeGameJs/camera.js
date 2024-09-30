
class Camera {

    constructor(target) {
        this.target = target;

        this.minX = -100;
        this.maxX = 500;
        this.minY = -100;
        this.maxY = 500;

        this.smoothingSpeed = 5;

        // shake
        this.shakingValue = Vector2.Zero();
        this.shakingTime = 0;
        this.shakingSpeed = 40;
        this.shakingSize = 5;
        this.shakeInitRandom = Vector2.Zero();

        this.position = Vector2.Zero();
        this.targetPosition = Vector2.Zero();
    }

    Start() {
        this.position.x = this.target.position.x - canvas.width / 2;
        this.position.y = this.target.position.y - canvas.height / 2;
    }

    Update(deltaTime) {
        this.targetPosition.x = this.target.position.x - canvas.width / 2;
        this.targetPosition.y = this.target.position.y - canvas.height / 2;

        this.shakingValue.Set(0, 0);
        if (this.shakingTime > 0) {
            this.shakingTime -= deltaTime;

            this.shakingValue.x = Math.cos(this.shakeInitRandom.x + this.shakingTime * this.shakingSpeed) * this.shakingSize;
            this.shakingValue.y = Math.sin(this.shakeInitRandom.y + this.shakingTime * this.shakingSpeed) * this.shakingSize;
        }
    }

    PreDraw(ctx) {
        ctx.save();

        ctx.translate(-this.position.x, -this.position.y);
    }

    PostDraw(ctx) {
        ctx.restore();
    }

    Shake(time, speed, size) {
        this.shakingTime = time;
        this.shakingSpeed = speed;
        this.shakingSize = size;
        this.shakeInitRandom.Random();
    }

}