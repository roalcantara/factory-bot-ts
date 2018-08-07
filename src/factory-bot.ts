import { isFunction, sample } from 'lodash'

export type FactoryParam = () => any

export type FactoryAttribute = string | number | boolean | Date | FactoryParam

export type Factory = {
  clazz: any
  attributes: Map<string, FactoryAttribute>
}

export class FactoryBot {
  private factories = new Map<string, Factory>()
  private sequences = 0

  has(name: string): boolean {
    return this.factories[name] !== undefined
  }

  count(): number {
    return Object.keys(this.factories).length
  }

  clear(): void {
    this.factories = new Map<string, Factory>()
    this.sequences = 0
  }

  define<T = {}>(name: string, attributes: Partial<T>, clazz?: { new(): T; } | any): void {
    this.factories[name] = {
      clazz, attributes
    }
  }

  extend<T = {}>(name: string, trait: string, attributes: Partial<T>): void {
    if (!this.has(name)) throw new Error(`Factory '${name}' has not been defined!`)
    if (this.has(trait)) throw new Error(`Factory '${name}'\`s trait '${trait}' has already been defined!`)

    this.factories[trait] = { ...this.factories[name] }

    this.factories[trait].attributes = Object.assign({},
      ...this.factories[name].attributes, attributes
    )
  }

  instantiate<T>(type: (new () => T)): T {
    return new type()
  }

  build <T = {}>(name: string, attributes ?: Partial<T>): T {
    const factory = this.factories[name] as Factory
    const instance = factory.clazz ? this.instantiate<T>(factory.clazz) : {}

    Object.keys(factory.attributes)
      .forEach(attribute => {
        instance[attribute] = this.parse(factory.attributes[attribute])
      })

    // tslint:disable-next-line
    return Object.assign(instance, attributes) as T
  }

  buildList<T = {}>(name: string, length = 1, attributes?: Partial<T>): Array <T> {
    return Array<T>(length)
      .fill(undefined)
        .map(() => this.build<T>(name, attributes))
  }

  rand<T>(enumInstance: T): T {
    return sample(Object.keys(enumInstance)
      .map(key => enumInstance[key] as T))
  }

  seq(callbackfn: (seq: number) => FactoryAttribute): FactoryAttribute {
    this.sequences ++

    return callbackfn(this.sequences)
  }

  private parse = val => {
    if (isFunction(val)) return val()

    return val
  }
}
