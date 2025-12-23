export interface EnvironmentVarTypes {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;

  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
}
