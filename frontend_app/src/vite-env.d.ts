/* eslint-disable @typescript-eslint/consistent-type-definitions */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_API_BASE?: string;
  readonly REACT_APP_BACKEND_URL?: string;
  readonly REACT_APP_FRONTEND_URL?: string;
  readonly REACT_APP_WS_URL?: string;
  readonly REACT_APP_NODE_ENV?: string;
  readonly REACT_APP_NEXT_TELEMETRY_DISABLED?: string;
  readonly REACT_APP_ENABLE_SOURCE_MAPS?: string;
  readonly REACT_APP_PORT?: string;
  readonly REACT_APP_TRUST_PROXY?: string;
  readonly REACT_APP_LOG_LEVEL?: string;
  readonly REACT_APP_HEALTHCHECK_PATH?: string;
  readonly REACT_APP_FEATURE_FLAGS?: string;
  readonly REACT_APP_EXPERIMENTS_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
