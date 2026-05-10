import { useState, useEffect } from 'react'

const KEY = 'resume-api-config'
const DEFAULT = { provider: 'claude', key: '' }

export function getApiConfig() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || DEFAULT
  } catch {
    return DEFAULT
  }
}

export function setApiConfig(config) {
  localStorage.setItem(KEY, JSON.stringify({ ...DEFAULT, ...config }))
}

export default function useApiKey() {
  const [config, setConfig] = useState(getApiConfig)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setApiConfig(config)
  }, [config])

  const update = (patch) => setConfig(c => ({ ...c, ...patch }))
  const hasKey = !!config.key

  return { provider: config.provider, key: config.key, hasKey, update, showModal, setShowModal }
}
