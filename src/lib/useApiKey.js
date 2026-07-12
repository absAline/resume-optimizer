const STORAGE_KEY = 'resume-optimizer-ai-config'

const DEFAULT_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
  },
  deepseek: {
    name: 'DeepSeek',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
  },
}

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return null
}

function saveConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

export function getApiConfig() {
  return loadConfig()
}

export function clearApiConfig() {
  localStorage.removeItem(STORAGE_KEY)
}

export function setApiConfig({ provider, apiKey, endpoint, model }) {
  const cfg = { provider, apiKey, endpoint, model }
  saveConfig(cfg)
  return cfg
}

export function isRealMode() {
  const cfg = loadConfig()
  return !!(cfg?.apiKey && cfg?.endpoint)
}

export default function useApiKey() {
  const cfg = loadConfig()
  if (cfg?.apiKey) {
    return {
      isDemo: false,
      provider: cfg.provider || 'custom',
      endpoint: cfg.endpoint,
      model: cfg.model,
      apiKey: cfg.apiKey,
      config: cfg,
    }
  }
  return {
    isDemo: true,
    provider: null,
    endpoint: null,
    model: null,
    apiKey: null,
    config: null,
    defaultProviders: DEFAULT_PROVIDERS,
  }
}

export { DEFAULT_PROVIDERS }
