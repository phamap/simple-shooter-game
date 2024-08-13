import { IGameObject } from './models'

export function drawGameObject(gameObject: IGameObject, context: CanvasRenderingContext2D | null) {
	if (context) {
		context.save()
		context.globalAlpha = gameObject.alpha
		context.beginPath()
		context.arc(
			gameObject.x,
			gameObject.y,
			gameObject.radius,
			0,
			Math.PI * 2,
			false
		)
		context.fillStyle = gameObject.color
		context.fill()
		context.restore()
	}
}

export function updateGameObject(gameObject: IGameObject, speed = 1, context: CanvasRenderingContext2D | null, changeAlpha = false) {
	if (changeAlpha) {
		gameObject.alpha -= .01
		gameObject.velocity!.x *= .97
		gameObject.velocity!.y *= .97
	}
	gameObject.x = gameObject.x + (gameObject.velocity!.x * speed)
	gameObject.y = gameObject.y + (gameObject.velocity!.y * speed)

	drawGameObject(gameObject, context)
}

export function collisionDetect(gameObject1: IGameObject, gameObject2: IGameObject, fn: Function) {
	// узнаем расстояние между игроком и врагом(обнаружение коллизий)
	const dist = Math.hypot(gameObject1.x - gameObject2.x, gameObject1.y - gameObject2.y)

	// если дистанция - радиус игрока - радиус врага меньше 1
	if ((dist - gameObject1.radius - gameObject2.radius < 1)) {
		fn();
	}
}