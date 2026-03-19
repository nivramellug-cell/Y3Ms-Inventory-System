import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

async function ensureCatalystScripts() {
  const host = window.location.hostname
  const isLocalhost = host === 'localhost' || host === '127.0.0.1'

  if (isLocalhost) {
    return
  }

  try {
    await loadScript('https://static.zohocdn.com/catalyst/sdk/js/4.0.0/catalystWebSDK.js')
    await loadScript('/__catalyst/sdk/init.js')
  } catch {
    // Keep app running and let login page show actionable error.
  }
}

async function bootstrap() {
  await ensureCatalystScripts()

  const app = createApp(App)
  app.use(router)
  app.mount('#app')
}

bootstrap()
