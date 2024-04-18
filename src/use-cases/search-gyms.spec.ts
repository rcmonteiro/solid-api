import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

const sampleGymInput = {
  title: 'Gym',
  description: 'Lorem...',
  phone: '00000',
  latitude: -26.9958203,
  longitude: -48.666327,
}

let GymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    GymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(GymsRepository)
  })

  it('should be able to search gyms', async () => {
    await GymsRepository.create(sampleGymInput)
    await GymsRepository.create(sampleGymInput)
    await GymsRepository.create({ ...sampleGymInput, title: 'ClOsEr GyM' })

    const { gyms } = await sut.execute({
      query: 'Closer',
      page: 1,
    })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'ClOsEr GyM' })])
  })

  it('should be able fetch a paginated search', async () => {
    for (let i = 1; i <= 22; i++) {
      await GymsRepository.create({
        ...sampleGymInput,
        title: `Gym ${i}`,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Gym',
      page: 2,
    })
    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym 21' }),
      expect.objectContaining({ title: 'Gym 22' }),
    ])
  })
})
