import { ConfigModuleOptions } from '@nestjs/config';

export const ENV_CONFIG: ConfigModuleOptions = {
   cache: true,
   isGlobal: true,
   envFilePath: ['.env', '.env.development', '.env.production'],
   expandVariables: true,
   ignoreEnvFile: process.env.NODE_ENV === 'production',
};
