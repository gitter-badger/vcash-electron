import { spawn } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

/**
 * Start daemon.
 * @function start
 * @return {object|null} Child process or null.
 */
const start = () => {
  const daemonName = ''.concat(
    'vcashd-',
    process.arch,
    process.platform === 'win32' ? '.exe' : ''
  )

  /** Prepare daemon path. */
  let path = join(__dirname, '..', 'bin', daemonName)

  /** Execute from unpacked asar directory when running packaged. */
  path = path.replace('app.asar', 'app.asar.unpacked')

  /** Check if daemon exists and spawn it. */
  const daemon = existsSync(path) === true ? spawn(path) : null

  if (daemon !== null) {
    /** Log daemon stderr in dev mode. */
    daemon.stderr.on('data', data => {
      if (process.env.NODE_ENV === 'dev') {
        console.log(data.toString().trim())
      }
    })

    /** Log daemon exit. */
    daemon.on('exit', (code, signal) => {
      console.log('Daemon exited, code:', code, 'signal:', signal)
    })
  }

  return daemon
}

/** Start daemon. */
const daemon = start()

/** Export child process. */
export default daemon
