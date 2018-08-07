// tslint:disable:max-classes-per-file

import { sample } from 'lodash'

import { FactoryBot } from '../src'

import { expect, Faker } from '.'

export enum NinjaRank {
  GENIN = 'Genin',
  CHUUNIN = 'Chuunin',
  JONIN = 'Jōnin'
}

export class Ninja {
  id?: number
  name?: string
  username?: string
  level?: NinjaRank
  sensor?: boolean

  constructor(attrs?: Partial<Ninja>) {
    Object.assign(this, attrs)
  }
}

export class Village {
  id?: string
  name?: string
  members?: Array<Ninja>

  constructor(attrs?: Partial<Village>) {
    Object.assign(this, attrs)
  }
}

describe('FactoryBot', () => {
  describe('#seq', () => {
    let first

    before(() => {
      first = FactoryBot.seq(seq => `ninja${seq}@leaf.jp`)
    })

    it('generates a sequenced value for each invocation', () => {
      expect(first).to
        .eq('ninja1@leaf.jp')
    })

    context('when seq is called again', () => {
      let second

      before(() => {
        second = FactoryBot.seq(seq => `ninja${seq}@leaf.jp`)
      })

      it('does not duplicate values', () => {
        expect(first).to.not
          .eq(second)
      })
    })
  })

  describe('#rand', () => {
    let value

    context('when a Enum is given', () => {
      before(() => {
        value = FactoryBot.rand(NinjaRank)
      })

      it('returns a random enum value', () => {
        expect([NinjaRank.CHUUNIN, NinjaRank.GENIN, NinjaRank.JONIN]).to
          .include(value)
      })
    })
  })

  describe('#define', () => {
    context('when static values are given', () => {
      before(() => {
        FactoryBot.define<Ninja>('ninja', {
          id: 1,
          name: 'Uzimaki Naruto',
          username: 'naruto',
          level: NinjaRank.GENIN,
          sensor: false
        }, Ninja)
      })

      it('defines a factory with same values for each build', () => {
        expect(FactoryBot.build<Ninja>('ninja')).to.deep
          .eq(new Ninja({
            id: 1,
            name: 'Uzimaki Naruto',
            username: 'naruto',
            level: NinjaRank.GENIN,
            sensor: false
          }))
      })
    })

    context('when no model class is given', () => {
      before(() => {
        FactoryBot.define('ninja', {
          id: '1234',
          name: 'Uzimaki Naruto',
          username: 'naruto',
          level: NinjaRank.GENIN,
          sensor: false
        })
      })

      it('defines a simple factory', () => {
        expect(FactoryBot.build('ninja')).to.deep
          .eq({
            id: '1234',
            name: 'Uzimaki Naruto',
            username: 'naruto',
            level: NinjaRank.GENIN,
            sensor: false
          })
      })

      it('with no model class', () => {
        expect(FactoryBot.build('ninja')).to.not.be.an
          .instanceof(Ninja)
      })
    })

    context('when no generic type is given', () => {
      before(() => {
        FactoryBot.define('ninja', {
          id: '1234',
          name: 'Uzimaki Naruto',
          username: 'naruto',
          level: NinjaRank.GENIN,
          email: 'non-existent@property.jp'
        })
      })

      it('defines a factory with no type checking', () => {
        expect(FactoryBot.build('ninja')).to.deep
          .eq({
            id: '1234',
            name: 'Uzimaki Naruto',
            username: 'naruto',
            level: NinjaRank.GENIN,
            email: 'non-existent@property.jp'
          })
      })

      context('with function values', () => {
        before(() => {
          FactoryBot.define('ninja', {
            id: () => Faker.random.number(),
            name: () => Faker.name.findName(),
            username: () => FactoryBot.seq(seq => `${Faker.internet.userName()}_${seq}`),
            level: () => FactoryBot.rand(NinjaRank),
            sensor: () => sample([true, false])
          }, Ninja)
        })

        it('defines a factory with values that are evaluated for each build', () => {
          const first = FactoryBot.build('ninja', { name: 'Uzimaki Naruto', username: 'naruto-kun' })
          const second = FactoryBot.build('ninja', { name: 'Sasuke Uchiha', username: 'sasuke-kun' })

          expect(first).to.not.be.deep
            .eq(second)
        })
      })
    })

    context('when a chained factory is defined', () => {
      let village: Village

      before(() => {
        FactoryBot.define('ninja', {
          id: () => Faker.random.number(),
          name: () => Faker.name.findName(),
          username: () => FactoryBot.seq(seq => `${Faker.internet.userName()}_${seq}`),
          level: () => FactoryBot.rand(NinjaRank),
          sensor: () => sample([true, false])
        }, Ninja)

        FactoryBot.define('village', {
          id: () => Faker.random.uuid(),
          name: 'Leaf',
          members: () => FactoryBot.buildList('ninja', 2)
        }, Village)

        village = FactoryBot.build<Village>('village')
      })

      it('defines a factory with nested values', () => {
        expect(village.members.length).to
          .eq(2)
      })
    })
  })

  describe('#count', () => {
    context('when there are no factories defined', () => {
      before(() => {
        FactoryBot.clear()
      })

      it('returns zero', () => {
        expect(FactoryBot.count()).to
          .eq(0)
      })
    })

    context('when there are factories are defined', () => {
      before(() => {
        FactoryBot.define<Ninja>('ninja', {
          id: 1,
          name: 'Kakashi Hatake',
          username: 'kakashi',
          level: NinjaRank.GENIN,
          sensor: false
        }, Ninja)

        FactoryBot.define('village', {
          id: () => Faker.random.uuid(),
          name: 'Leaf',
          members: () => FactoryBot.buildList('ninja', 2)
        }, Village)
      })

      it('returns the quantity of defined factories', () => {
        expect(FactoryBot.count()).to
          .eq(2)
      })
    })
  })

  describe('#clear', () => {
    context('when there are factories defined', () => {
      before(() => {
        FactoryBot.define<Ninja>('ninja', {
          id: 1,
          name: 'Kakashi Hatake',
          username: 'kakashi',
          level: NinjaRank.GENIN,
          sensor: false
        }, Ninja)
      })

      it('cleans up all factories', () => {
        FactoryBot.clear()

        expect(FactoryBot.count()).to
          .eq(0)
      })
    })
  })

  describe('#build', () => {
    before(() => {
      FactoryBot.define('ninja', {
        id: () => Faker.random.number(),
        name: () => Faker.name.findName(),
        username: () => FactoryBot.seq(seq => `${Faker.internet.userName()}_${seq}`),
        level: () => FactoryBot.rand(NinjaRank),
        sensor: () => sample([true, false])
      }, Ninja)
    })

    it('builds and returns a object`s instance for the given factory', () => {
      expect(FactoryBot.build<Ninja>('ninja')).to.be.an
        .instanceof(Ninja)
    })

    context('when custom parameters are given', () => {
      let ninja: Ninja

      before(() => {
        ninja = FactoryBot.build<Ninja>('ninja', {
          name: 'Uzimaki Naruto',
          username: 'naruto-kun'
        })
      })

      it('builds and returns a object`s intance with the given custom parameters', () => {
        expect(ninja).to.be.deep
          .eq(new Ninja({
            id: ninja.id,
            name: 'Uzimaki Naruto',
            username: 'naruto-kun',
            level: ninja.level,
            sensor: ninja.sensor
          }))
      })
    })
  })

  describe('#buildList', () => {
    let ninjas: Array<Ninja>

    before(() => {
      FactoryBot.define('ninja', {
        id: () => Faker.random.number(),
        name: () => Faker.name.findName(),
        username: () => FactoryBot.seq(seq => `${Faker.internet.userName()}_${seq}`),
        level: () => FactoryBot.rand(NinjaRank),
        sensor: () => sample([true, false])
      }, Ninja)

      ninjas = FactoryBot.buildList<Ninja>('ninja')
    })

    it('builds a list with at least one object`s instance', () => {
      expect(ninjas.length).to.be
        .eq(1)
    })

    context('when a length is given', () => {
      let length: number

      before(() => {
        length = 3
        ninjas = FactoryBot.buildList<Ninja>('ninja', length)
      })

      it('builds a list with the given length of object`s instances', () => {
        expect(ninjas.length).to.be
          .eq(length)
      })

      it('builds a list with different objetcs', () => {
        expect(ninjas[0].id).to.not.be
          .eq(ninjas[1].id)
      })
    })
  })
})
