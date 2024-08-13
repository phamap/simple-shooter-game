import './style.css'
import { getProjectileVelocity } from "./projectile";
import { IGameObject } from './models';
import { collisionDetect, drawGameObject, updateGameObject } from './drawGameItem';
import { createEnemy } from './enemy';

const canvas = document.querySelector('canvas')
const scoreElement = document.querySelector('#score')
const endScoreElement = document.querySelector('#endScore')
const modalElement: HTMLElement | null = document.querySelector('.modal')
const btn: HTMLElement | null = document.querySelector('#btn')
let score = 0

function updateScore(score: number) {
  if (scoreElement) {
    scoreElement.innerHTML = `${score}`
  }
}

if (canvas) {
  canvas.width = innerWidth
  canvas.height = innerHeight

  const context = canvas.getContext('2d')
  const playerPosition = {
    x: canvas.width / 2,
    y: canvas.height / 2
  }
  const playerConfig: IGameObject = {
    x: playerPosition.x,
    y: playerPosition.y,
    radius: 10,
    color: 'white',
    velocity: null,
    alpha: 1
  }
  let projectiles: IGameObject[] = []
  let particles: IGameObject[] = []
  let enemies: IGameObject[] = []
  let animationId: number | null = null;

  function resetGame() {
    score = 0
    updateScore(0)
    projectiles = []
    particles = []
    enemies = []
    modalElement!.style.display = 'none'
  }

  function spawnEnemy() {
    setInterval(() => {
      enemies.push(createEnemy(playerPosition, canvas!))
    }, 1000)
  }

  function updateParticles() {
    if (particles.length) {
      particles.forEach((particle, index) => {
        // рисуем пули
        updateGameObject(particle, 2, context, true)
        // если частицы растворились удаляем их из
        if (
          particle.alpha < 0.1
        ) {
          particles.splice(index, 1)
        }
      })
    }
  }

  function updateProjectiles() {
    if (projectiles.length) {
      projectiles.forEach((projectile, index) => {
        // рисуем пули
        updateGameObject(projectile, 4, context)
        // если пули покинули игровое поле удаляем их
        if (
          projectile.x + projectile.radius < 0
          || projectile.x - projectile.radius > canvas!.width
          || projectile.y - projectile.radius < 0
          || projectile.y - projectile.radius > canvas!.height
        ) {
          projectiles.splice(index, 1)
        }
      })
    }
  }

  function updateEnemies() {
    if (enemies.length) {
      enemies.forEach((enemy, enemyIndex) => {
        // рисуем врагов
        updateGameObject(enemy, 1, context)
        // обнаружение коллизий между игроком и врагами
        collisionDetect(playerConfig, enemy, () => {
          endScoreElement!.innerHTML = `${score}`
          modalElement!.style.display = 'flex'
          cancelAnimationFrame(animationId!)
        })

        projectiles.forEach((projectile, projIndex) => {
          // обнаружение коллизий между врагами и пулями
          collisionDetect(projectile, enemy, () => {
            // генерируем частички
            for (let i = 0; i < enemy.radius * 2; i++) {
              particles.push({
                x: projectile.x,
                y: projectile.y,
                radius: Math.random() * 2,
                color: enemy.color,
                velocity: {
                  x: (Math.random() - .5) * (Math.random() * 5),
                  y: (Math.random() - .5) * (Math.random() * 5)
                },
                alpha: 1
              })
            }
            setTimeout(() => { // исключает мерцание врагов и пуль при удалении их из массивов
              projectiles.splice(projIndex, 1)
              if (enemies[enemyIndex].radius - 8 < 8) {
                score += 100 * Math.round(enemy.radius)
                updateScore(score)
                enemies.splice(enemyIndex, 1) // удаляем врага
              } else {
                enemies[enemyIndex].radius = enemies[enemyIndex].radius - 8 // уменьшаем врага
              }
            })
          })
        })
      })

    }
  }

  function animate() {
    // рисуем сцену
    animationId = requestAnimationFrame(animate)
    if (context && canvas) {
      context.fillStyle = 'rgba(0, 0, 0, .1)'
      context.fillRect(0, 0, canvas.width, canvas.height)
      // рисуем игрока
      drawGameObject(playerConfig, context)
      updateProjectiles()
      updateEnemies()
      updateParticles()
    }
  }

  addEventListener('click', (ev: MouseEvent) => {
    // создаем пулю
    projectiles.push({
      x: playerPosition.x,
      y: playerPosition.y,
      radius: 5,
      color: 'white',
      velocity: getProjectileVelocity(ev, playerPosition),
      alpha: 1
    })
  })

  btn?.addEventListener('click', (ev: MouseEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
    resetGame()
    animate()
  })

  animate()
  spawnEnemy()
}
