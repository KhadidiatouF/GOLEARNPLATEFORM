export interface IRepository<T, C = any, U = any> {

    findAll(page?: number, limit?: number): Promise<{
        data: T[];
        total: number;
        page: number;
        limit: number;
    }>;

    findById(id: number): Promise<T | null>;

    create(data: C): Promise<T>;

    update(id: number, data: U): Promise<T>;

    delete(id: number): Promise<void>;
}