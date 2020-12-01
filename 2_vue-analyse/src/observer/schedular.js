import { nextTick } from '../utils'

let has = {}
let queue = []
let waiting = false

function flushSchedulerQueue() {
  for (let i = 0; i < queue.length; i++) {
    const watcher = queue[i]
    watcher.run()
  }
  queue = []
  has = {}
  waiting = false
}

function queueWatcher(watcher) {
  // 更新时对watcher去重
  const id = watcher.id
  if (has[id] == null) {
    queue.push(watcher)
    has[id] = true
    // Promise.resolve().then(flushSchedulerQueue)
    if (!waiting) {
      nextTick(flushSchedulerQueue)
      waiting = true
    }
  }
}

export { queueWatcher }
