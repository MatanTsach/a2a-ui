interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_APP_VERSION: string;
  NEXT_PUBLIC_APP_NAME: string;
  NEXT_PUBLIC_ORCHESTRATOR_URL: string;
}

const DEFAULT_VALUES: Partial<EnvironmentConfig> = {
  NEXT_PUBLIC_APP_VERSION: '1.0.0',
  NEXT_PUBLIC_APP_NAME: 'A2A UI',
  NEXT_PUBLIC_ORCHESTRATOR_URL: 'http://localhost:8080',
};

function validateEnvironment(): EnvironmentConfig {
  // Safely access environment variables for both server and client
  const getEnvVar = (key: string): string | undefined => {
    if (typeof window === 'undefined') {
      // Server-side: access process.env directly
      return process.env[key];
    } else {
      // Client-side: only access NEXT_PUBLIC_ variables
      if (key.startsWith('NEXT_PUBLIC_')) {
        return (window as any).__NEXT_DATA__?.buildId ? process.env[key] : undefined;
      }
      return undefined;
    }
  };

  const config: EnvironmentConfig = {
    NODE_ENV: (getEnvVar('NODE_ENV') as EnvironmentConfig['NODE_ENV']) || 'development',
    NEXT_PUBLIC_APP_VERSION: getEnvVar('NEXT_PUBLIC_APP_VERSION') || DEFAULT_VALUES.NEXT_PUBLIC_APP_VERSION!,
    NEXT_PUBLIC_APP_NAME: getEnvVar('NEXT_PUBLIC_APP_NAME') || DEFAULT_VALUES.NEXT_PUBLIC_APP_NAME!,
    NEXT_PUBLIC_ORCHESTRATOR_URL: getEnvVar('NEXT_PUBLIC_ORCHESTRATOR_URL') || DEFAULT_VALUES.NEXT_PUBLIC_ORCHESTRATOR_URL!,
  };

  // Validate NODE_ENV
  if (!['development', 'production', 'test'].includes(config.NODE_ENV)) {
    config.NODE_ENV = 'development'; // Fallback instead of throwing
  }

  // Log configuration in development (only on server side to avoid logger issues)
  if (typeof window === 'undefined' && config.NODE_ENV === 'development') {
    console.log('Environment configuration loaded:', config);
  }

  return config;
}

export const ENV = validateEnvironment();

// Helper functions
export const isDevelopment = ENV.NODE_ENV === 'development';
export const isProduction = ENV.NODE_ENV === 'production';
export const isTest = ENV.NODE_ENV === 'test'; 