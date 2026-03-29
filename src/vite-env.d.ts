/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Production API base including path segment `.../api_project` (no trailing slash). */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
