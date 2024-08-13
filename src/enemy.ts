import { IGameObject, IVelocity } from './models';

export function createEnemy(playerPosition: IVelocity, canvas: HTMLCanvasElement): IGameObject {
  const radius = Math.random() * (30 - 6) + 6
  let x;
  let y;
  if (Math.random() < .5) {
    x = Math.random() < .5 ? 0 - radius : canvas.width
    y = Math.random() * canvas.height
  } else {
    x = Math.random() * canvas.width
    y = Math.random() < .5 ? 0 - radius : canvas.height
  }

  // вычисляем угол
  const angle = Math.atan2(
    playerPosition.y - y!,
    playerPosition.x - x!
  )
  // вычисляем скорость
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle)
  }

  return { x, y, radius, color: `hsl(${Math.random() * 360}, 50%, 50%)`, velocity, alpha: 1 }
}