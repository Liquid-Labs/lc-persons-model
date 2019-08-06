/* globals beforeAll describe expect test */
import { resourcesSettings, verifyCatalystSetup } from '@liquid-labs/catalyst-core-api'
import { Person, personResourceConf } from './model'

const personFooModel = {
  pubId       : '630AC9ED-3531-41E3-BD87-E26ADA74ECBC',
  legalID     : '555-55-5555',
  legalIDType : 'SSN',
  active      : true,
  authId      : null,
  lastUpdated : null,
  displayName : 'foo',
  phone       : null,
  email       : null,
  phoneBackup : null,
  photoUrl    : null,
  addresses   : undefined
}

const personBarModel = {
  pubId       : '23DB5195-67FF-4709-9033-7F9F5C5A6C6F',
  legalID     : null,
  legalIDType : null,
  active      : true,
  authId      : null,
  lastUpdated : null,
  displayName : 'bar',
  phone       : null,
  email       : null,
  phoneBackup : null,
  photoUrl    : null,
  addresses   : []
}

describe('Person', () => {
  beforeAll(() => {
    const resourceList = [ personResourceConf ]
    resourcesSettings.setResources(resourceList)
    verifyCatalystSetup()
  })

  test("should identify self as a 'persons' resource", () => {
    const person = new Person(personFooModel)
    expect(person.resourceName).toBe('persons')
  })

  test("should be incomplete if address is 'null'", () => {
    const person = new Person(personFooModel)
    expect(person.isComplete()).toBe(false)
    expect(person.getMissing()).toHaveLength(1)
    expect(person.getMissing()[0]).toBe('addresses')
  })

  test("should provide ascending and descending display name sort options", () => {
    const personFoo = new Person(personFooModel)
    const personBar = new Person(personBarModel)

    const persons = [ personFoo, personBar ]
    expect(typeof resourcesSettings.getResourcesMap()['persons'].sortMap['displayName-asc'])
      .toBe('function')
    persons.sort(resourcesSettings.getResourcesMap()['persons'].sortMap['displayName-asc'])
    expect(persons[0]).toBe(personBar)
    expect(persons[1]).toBe(personFoo)

    expect(typeof resourcesSettings.getResourcesMap()['persons'].sortMap['displayName-desc'])
      .toBe('function')
    persons.sort(resourcesSettings.getResourcesMap()['persons'].sortMap['displayName-desc'])
    expect(persons[0]).toBe(personFoo)
    expect(persons[1]).toBe(personBar)
    // and verify that we test all the options
    expect(resourcesSettings.getResourcesMap()['persons'].sortOptions).toHaveLength(2)
  })

  test("should define default sort options", () => {
    expect(resourcesSettings.getResourcesMap()['persons'].sortDefault).toBe('displayName-asc')
  })
})
