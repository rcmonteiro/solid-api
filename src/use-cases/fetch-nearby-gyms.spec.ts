import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

const sampleGymInput = {
  title: 'Gym',
  description: 'Lorem...',
  phone: '00000',
  latitude: -26.9958203,
  longitude: -48.666327,
}

let GymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    GymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(GymsRepository)
  })

  it('should be able to find nearby gyms', async () => {
    await GymsRepository.create({ ...sampleGymInput, title: 'Closer Gym' })
    await GymsRepository.create({
      ...sampleGymInput,
      latitude: 0,
      longitude: 0,
    })

    const { gyms } = await sut.execute({
      userLatitude: -26.9958203,
      userLongitude: -48.666327,
    })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Closer Gym' })])
  })
})
