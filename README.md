# factory-bot-ts

A simple library for setting up [TypeScript](https://www.typescriptlang.org/) objects as test data - heavily inspired by the awesome Ruby's [factory_bot](https://github.com/thoughtbot/factory_bot).

- Fully written in [TypeScript](https://www.typescriptlang.org/)
- With (optional) type checking
- With no persistence layer
- And no promises. ☺️

## Installation

**1.** Add to your project

```sh
npm i -D factory-bot-ts
yarn add factory-bot-ts --dev
```

## Basics

**1.** Ok, suppose we've got a Ninja model..

```typescript
  // ../src/models/ninja.model.ts

  export enum NinjaRank {
    GENIN = 'Genin',
    CHUUNIN = 'Chuunin',
    JOUNIN = 'Jounin'
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
```

**2.** We would define our factories..

```typescript
  // ../src/tests/index.ts

  import * as Faker from 'faker'
  import { sample } from 'lodash'

  import { FactoryBot } from 'factory-bot-ts'

  import { Ninja, NinjaRank, Village } from '../src/models'

  FactoryBot.define('ninja', {
    id: () => Faker.random.number(),
    name: () => Faker.name.findName(),
    username: () => FactoryBot.seq(seq => `${Faker.internet.userName()}_${seq}`),
    level: () => FactoryBot.rand(NinjaRank),
    sensor: () => sample([true, false])
  }, Ninja)

  FactoryBot.define('village', {
    id: () => Faker.random.uuid(),
    name: () => Faker.name.findName(),
    members: () => FactoryBot.buildList<Ninja>('ninja', 2)
  }, Village)

  export {
    FactoryBot
  }
```

**3.** And then we'd just use them on our tests!

```typescript
  // ../src/models/ninja.model.spec.ts

  import { FactoryBot } from '../src/tests'

  import { Ninja, NinjaRank, Village } from '.'

  export class NinjaSpec {
    let instance: Ninja

    before(() => {
      instance = FactoryBot.build('ninja', { name: 'Kakashi Hatake' })
    })

    it('builds a Ninja! 👹', () => {
      expect(instance).to.be.an
        .instanceof(Ninja)
    })
  }
```

## More

Factory-bot-ts also allow us to define..

**1.** Untyped factories with static data

```typescript
  FactoryBot.define('ninja', {
    id: 1,
    name: 'Sasuke Uchiha',
    username: 'sasuke',
    level: NinjaRank.GENIN,
    sensor: false,
    sharingan: true
  })

  FactoryBot.build('ninja') /* => {
    id: 1,
    name: 'Sasuke Uchiha',
    username: 'sasuke',
    level: 'Genin',
    sensor: false,
    sharingan: true
  } */
```

**2.** Factories with type checking

```typescript
  FactoryBot.define<Ninja>('ninja', {
    id: 1,
    name: 'Sasuke Uchiha',
    username: 'sasuke',
    level: NinjaRank.GENIN,
    sensor: false
  }, Ninja)

  FactoryBot.build('ninja') /* => Ninja {
    id: 1,
    name: 'Sasuke Uchiha',
    username: 'sasuke',
    level: 'Genin',
    sensor: false
  } */
```

**3.** Factories with Dynamic data

```typescript
  FactoryBot.define('ninja', {
    id: () => Faker.random.number(),
    name: () => Faker.name.findName(),
    username: () => Faker.internet.userName(),
    level: () => FactoryBot.rand(NinjaRank),
    sensor: () => sample([true, false])
  }, Ninja)

  FactoryBot.build('ninja') /* => Ninja {
    id: 43748,
    name: 'Martine Romaguera MD',
    username: 'Kaleb_Homenick',
    level: 'Jounin',
    sensor: true
  } */
```

**4.** Factories with custom, random and sequenced data

```typescript
  FactoryBot.define('ninja', {
    id: () => Faker.random.number(),
    name: () => Faker.name.findName(),
    username: () => FactoryBot.seq(seq => `${Faker.internet.userName()}_${seq}`),
    level: () => FactoryBot.rand(NinjaRank),
    sensor: () => sample([true, false])
  }, Ninja)

  FactoryBot.build<Ninja>('ninja', { name: 'Uzimaki Naruto' }) /* => Ninja {
    id: 11941,
    name: 'Uzimaki Naruto',
    username: 'Art_Crist36_1',
    level: 'Genin',
    sensor: true
  } */

  FactoryBot.build<Ninja>('ninja', { name: 'Sasuke Uchiha', username: 'sasuke-kun' }) /* => Ninja {
    id: 52565,
    name: 'Sasuke Uchiha',
    username: 'sasuke-kun',
    level: 'Chuunin',
    sensor: false
  } */
```

**5.** And chained factories

```typescript
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
    members: () => FactoryBot.buildList<Ninja>('ninja', 2)
  }, Village)

  FactoryBot.build('village') /* => Village {
    id: '7ec17407-cfdb-4a3f-b434-de788eb41591',
    name: 'Leaf',
    members: [ Ninja {
      id: 11941,
      name: 'Herta Hane',
      username: 'Kaleb_Homenick_5',
      level: 'Genin',
      sensor: true
    }, Ninja {
      id: 52565,
      name: 'Corbin Koss',
      username: 'Art_Crist36_6',
      level: 'Genin',
      sensor: false
    }]
  } */
```

For more examples, please, check out the project's [specs](https://github.com/roalcantara/factory-bot-ts/blob/master/tests/factory-bot.spec.ts).

## Dependencies

To run this project we need to have:

- [Node](http://nodejs.org)
- [Yarn](http://yarnpkg.com)

## Development

1. Install the dependencies above
2. `$ git clone https://github.com/roalcantara/factory-bot-ts.git` - Clone the project
3. `$ cd factory-bot-ts` - Go into the project folder
4. `$ yarn` - Run the setup script

## Running specs

`$ yarn test` to run the specs

## How to contribute

- Bug reports and pull requests are welcome on [GitHub](https://github.com/roalcantara/factory-bot-ts)
- Follow the [Semantic Versioning Specification](http://semver.org/)
- Follow the [GitHub Flow](https://guides.github.com/introduction/flow/)
- Follow the [5 Useful Tips For A Better Commit Message](https://robots.thoughtbot.com/5-useful-tips-for-a-better-commit-message) article and the [How to Write a Git Commit Message](http://chris.beams.io/posts/git-commit/) post
- Use [Commitizen cli](http://commitizen.github.io/cz-cli/) when committing

## Code of Conduct

Everyone interacting in the factory-bot-ts project’s codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/roalcantara/factory-bot-ts/blob/master/CODE_OF_CONDUCT.md).

## License

The package is available as open source under the terms of the [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).