class Vec
{
    constructor (x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
}

class Rect
{
    constructor (w, h)
    {
        this.pos = new Vec;
        this.size = new Vec(w, h);
    }
    get left()
    {
        return this.pos.x - this.size.x / 2;
    }
    get right()
    {
        return this.pos.x + this.size.x / 2;
    }
    get top()
    {
        return this.pos.y - this.size.y / 2;
    }
    get bottom()
    {
        return this.pos.y + this.size.y / 2;
    }
}

class Players extends Rect
{
    constructor ()
    {
        super(20, 100);
        this.score = 0;
    }
}

class Ball extends Rect
{
    constructor()
    {
        super(10, 10);
        this.vel = new Vec;
    }
}

class Pong{
    constructor(_canvas)
    {
        this._canvas = _canvas;
        this.c = canvas.getContext('2d');

        this.ball = new Ball;

        this.players = [
            new Players,
            new Players
        ];

        this.players[0].pos.x = 40;
        this.players[1].pos.x = this._canvas.width - 40;
        this.players.forEach(player => {
            player.pos.y = this._canvas.height /2; 
        });

        let lastTime;
        const callBack = (milliSec) => {
            if(lastTime) {
                this.update((milliSec - lastTime) / 1000); // convert to seconds
            }
            lastTime = milliSec;
            requestAnimationFrame(callBack);
        };
        callBack();
        this.reset();
    }

    reset()
    {
        this.ball.pos.x = this._canvas.width / 2;
        this.ball.pos.y = this._canvas.height / 2;
        this.ball.vel.x = 0;
        this.ball.vel.y = 0;
    }

    start()
    {
        if(this.ball.vel.x === 0 || this.ball.vel.y === 0) {
            this.ball.vel.x = 300 * (Math.random() > .5 ? 1 : -1);
            this.ball.vel.y = 300 * (Math.random() * 2 -1);
        }
    }

    collide(player, ball)
    {
        if(player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top) {
            ball.vel.x = -ball.vel.x;
        }
    }

    draw() {
        this.c.fillStyle = '#000';
        this.c.fillRect(0, 0, this._canvas.width, this._canvas.height);

        this.drawRect(this.ball);
        this.players.forEach(player => this.drawRect(player));

        this.drawScore();
    }

    drawRect(rect) {
        this.c.fillStyle = '#fff';
        this.c.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }

    drawScore() {
        this.scorePose = this._canvas.width /4;
        this.scoreText = this._canvas.getContext('2d');
        this.scoreText.font = '48px serif';
        this.scoreText.fillText(this.players[1].score, this._canvas.width - this.scorePose, 50);
        this.scoreText.fillText(this.players[0].score, this.scorePose, 50);
    }

    update(dt) {
        this.ball.pos.x += this.ball.vel.x * dt;
        this.ball.pos.y += this.ball.vel.y * dt;
    
        if(this.ball.left <= 0 || this.ball.right>= this._canvas.width) {
            let playerID;
            if(this.ball.vel.x < 0) {
                playerID = 1;
            } else {
                playerID = 0;
            }
            this.players[playerID].score++;
            this.reset();
            this.ball.vel.y = -this.ball.vel.y;

        }
        if(this.ball.top <= 0 || this.ball.bottom>= this._canvas.height) {
            this.ball.vel.y = -this.ball.vel.y;
        }

        this.players[1].pos.y = this.ball.pos.y;

        this.players.forEach(player => this.collide(player, this.ball));
        this.draw();
    }
}

const canvas = document.querySelector('.pong');
const pong = new Pong(canvas);

canvas.addEventListener('mousemove', event => {
    const scale = event.offsetY / event.target.getBoundingClientRect().height
    pong.players[0].pos.y = canvas.height * scale;
});

canvas.addEventListener('click', event => {
    pong.start();
});









