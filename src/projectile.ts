import { IVelocity } from './models';

export function getProjectileVelocity(ev: MouseEvent, playerPosition: IVelocity) {
  // вычисляем угол
  const angle = Math.atan2(
    ev.clientY - playerPosition.y,
    ev.clientX - playerPosition.x
  )
  // вычисляем скорость
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle)
  }

  return velocity
}