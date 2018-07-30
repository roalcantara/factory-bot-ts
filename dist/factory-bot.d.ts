export declare type FactoryParam = () => any;
export declare type FactoryAttribute = string | number | boolean | Date | FactoryParam;
export declare type Factory = {
    clazz: any;
    attributes: Map<string, FactoryAttribute>;
};
export declare class FactoryBot {
    private factories;
    private sequences;
    has(name: string): boolean;
    count(): number;
    clear(): void;
    define<T = {}>(name: string, attributes: Partial<T>, clazz?: {
        new (): T;
    } | any): void;
    instantiate<T>(type: (new () => T)): T;
    build<T = {}>(name: string, attributes?: T): T;
    buildList<T = {}>(name: string, length?: number, attributes?: T): Array<T>;
    rand<T>(enumInstance: T): T;
    seq(callbackfn: (seq: number) => FactoryAttribute): FactoryAttribute;
    private parse;
}
