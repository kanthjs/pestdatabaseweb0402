declare module 'pg' {
    export interface PoolConfig {
        connectionString?: string;
        max?: number;
        min?: number;
        idleTimeoutMillis?: number;
        connectionTimeoutMillis?: number;
    }

    export class Pool {
        constructor(config?: PoolConfig);
        connect(): Promise<any>;
        end(): Promise<void>;
        query(text: string, values?: any[]): Promise<any>;
    }

    export default {
        Pool
    };
}
