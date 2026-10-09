import { spawn } from 'node:child_process'
import { connect } from 'node:net'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
const readFlag = (name, fallback) => {
  const match = args.find((value) => value.startsWith(`--${name}=`))
  if (match) return match.slice(match.indexOf('=') + 1)

  const index = args.indexOf(`--${name}`)
  if (index !== -1) return args[index + 1] ?? fallback

  return fallback
}

const host = readFlag('host', '0.0.0.0')
const port = Number.parseInt(readFlag('port', '5175'), 10)
const strictPort = args.includes('--strictPort')
const url = `http://${host === '0.0.0.0' ? '127.0.0.1' : host}:${port}/`

function isPortOpen() {
  return new Promise((resolve) => {
    const socket = connect({ host: host === '0.0.0.0' ? '127.0.0.1' : host, port })
    const finish = (isOpen) => {
      socket.destroy()
      resolve(isOpen)
    }

    socket.setTimeout(1000)
    socket.once('connect', () => finish(true))
    socket.once('timeout', () => finish(false))
    socket.once('error', () => finish(false))
  })
}

if (await isPortOpen()) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(2000) })
    const html = await response.text()
    if (response.ok && html.includes('<title>Wedding OS')) {
      console.log(`Wedding OS is already running at ${url}`)
      process.exit(0)
    }
    console.error(`Port ${port} is occupied, but the response is not the Wedding OS.`)
    process.exit(1)
  } catch {
    console.error(`Port ${port} is occupied but did not respond as the Wedding OS.`)
    process.exit(1)
  }
}

const viteCli = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url))
const viteArgs = ['--host', host, '--port', String(port)]
if (strictPort) viteArgs.push('--strictPort')
const vite = spawn(process.execPath, [viteCli, ...viteArgs], {
  stdio: 'inherit',
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => vite.kill(signal))
}

vite.once('error', (error) => {
  console.error(`Could not start the Wedding OS dev server: ${error.message}`)
  process.exitCode = 1
})

vite.once('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0)
})
