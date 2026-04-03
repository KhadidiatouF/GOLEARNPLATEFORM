export interface IRepository <T>{ 
    findAll(page?: number, limit?: number): Promise<{data: T[], total: number, page: number, limit: number}>
    findById(id:number) : Promise<T|null>
    create(data:Omit<T,"id">) : Promise<T>
    update(id:number,data:Partial<T>): Promise<T>
    delete(id:number) :Promise<void>
}