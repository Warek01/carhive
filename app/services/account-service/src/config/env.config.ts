export const envConfig = {
   cache: true,
   isGlobal: true,
   envFilePath: ['.env', '.env.development', '.env.production'],
   expandVariables: true,
   ignoreEnvVars: false,
   ignoreEnvFile: process.env.NODE_ENV === 'production',
};
