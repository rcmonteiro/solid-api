import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymUseCase } from './create-gym'

const sampleGymInput = {
  title: 'Closer Gym',
  description: 'Lorem...',
  phone: '00000',
  latitude: -26.9958203,
  longitude: -48.666327,
}

let GymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Gym Use Case', () => {
  beforeEach(() => {
    GymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(GymsRepository)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute(sampleGymInput)
    expect(gym.id).toEqual(expect.any(String))
  })
})
