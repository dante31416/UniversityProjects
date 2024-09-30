
class Scene0 {
    constructor() {
        this.gameObjects = [];
    }

    Update(deltaTime) {
        this.gameObjects.forEach(go => go.Update(deltaTime));
    }

    Draw(ctx) {
        this.gameObjects.forEach(go => go.Draw(ctx));
    }
}