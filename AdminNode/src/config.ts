/**
 * Configuration module for AdminNode
 * Reads configuration from environment variables with sensible defaults.
 * 
 * Environment Variables:
 *   - ADMIN_API_PORT: Express API server port (default: 5000)
 *   - ADMIN_P2P_PORT: libp2p TCP port (default: 4001)
 *   - ADMIN_P2P_WS_PORT: libp2p WebSocket port (default: 4002)
 *   - ADMIN_CORS_ORIGINS: Comma-separated allowed origins (default: http://localhost:3000)
 *   - DSN_BOOTSTRAP_PEERS: Comma-separated bootstrap peer multiaddrs
 *   - DSN_NAMESPACE: DHT namespace (default: dsn)
 */

export interface Config {
  apiPort: number;
  p2pPort: number;
  p2pWsPort: number;
  corsOrigins: string[];
  bootstrapPeers: string[];
  namespace: string;
}

function getEnvOrDefault(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

function parseCommaSeparated(value: string): string[] {
  if (!value) return [];
  return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
}

function loadConfig(): Config {
  return {
    apiPort: parseInt(getEnvOrDefault('ADMIN_API_PORT', '5000'), 10),
    p2pPort: parseInt(getEnvOrDefault('ADMIN_P2P_PORT', '4001'), 10),
    p2pWsPort: parseInt(getEnvOrDefault('ADMIN_P2P_WS_PORT', '4002'), 10),
    corsOrigins: parseCommaSeparated(
      getEnvOrDefault('ADMIN_CORS_ORIGINS', 'http://localhost:3000')
    ),
    bootstrapPeers: parseCommaSeparated(
      process.env.DSN_BOOTSTRAP_PEERS || ''
    ),
    namespace: getEnvOrDefault('DSN_NAMESPACE', 'dsn'),
  };
}

// Singleton config instance
let config: Config | null = null;

export function getConfig(): Config {
  if (!config) {
    config = loadConfig();
  }
  return config;
}

export default getConfig;
