import { useEffect, useRef } from 'react'

export default function CanvasBg() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animFrame
    let nodes = []

    const NODE_COUNT = 55

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function createNode() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
      }
    }

    function hexPath(cx, cy, size) {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 180) * (60 * i - 30)
        const x = cx + size * Math.cos(angle)
        const y = cy + size * Math.sin(angle)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.stroke()
    }

    function drawHexGrid(W, H) {
      const size = 44
      const h = size * Math.sqrt(3)
      const w = size * 2
      ctx.strokeStyle = 'rgba(0,80,120,0.13)'
      ctx.lineWidth = 0.7
      const cols = Math.ceil(W / (w * 0.75)) + 2
      const rows = Math.ceil(H / h) + 2
      for (let col = -1; col < cols; col++) {
        for (let row = -1; row < rows; row++) {
          const cx = col * w * 0.75
          const cy = row * h + (col % 2 === 0 ? 0 : h / 2)
          hexPath(cx, cy, size)
        }
      }
    }

    function draw() {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // Ambient gradient
      const grad = ctx.createRadialGradient(W * 0.2, H * 0.5, 0, W * 0.2, H * 0.5, W * 0.7)
      grad.addColorStop(0, 'rgba(0,40,70,0.38)')
      grad.addColorStop(1, 'rgba(5,13,26,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      drawHexGrid(W, H)

      // Particles
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0) n.x = W
        if (n.x > W) n.x = 0
        if (n.y < 0) n.y = H
        if (n.y > H) n.y = 0
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,229,255,${n.alpha})`
        ctx.fill()
      })

      // Connections
      const CONN_DIST = 130
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < CONN_DIST) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(0,229,255,${0.12 * (1 - d / CONN_DIST)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animFrame = requestAnimationFrame(draw)
    }

    resize()
    for (let i = 0; i < NODE_COUNT; i++) nodes.push(createNode())
    draw()

    const onResize = () => { resize(); nodes = []; for (let i = 0; i < NODE_COUNT; i++) nodes.push(createNode()) }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} id="bg-canvas" />
}
