import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { randomUUID } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

const closerGymSample = {
  id: randomUUID(),
  title: 'Closer Gym',
  description: 'Lorem...',
  phone: '00000',
  latitude: -26.9958203,
  longitude: -48.666327,
}

const distantGymSample = {
  id: randomUUID(),
  title: 'Distant Gym',
  description: 'Lorem...',
  phone: '00000',
  latitude: -26.8797326,
  longitude: -48.7256469,
}

const userSample = {
  id: randomUUID(),
  latitude: new Decimal(-26.9958203),
  longitude: new Decimal(-48.666327),
}

describe('CheckIn Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)
    await gymsRepository.create(closerGymSample)
    await gymsRepository.create(distantGymSample)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: closerGymSample.id,
      userId: userSample.id,
      userLatitude: userSample.latitude,
      userLongitude: userSample.longitude,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: closerGymSample.id,
      userId: userSample.id,
      userLatitude: userSample.latitude,
      userLongitude: userSample.longitude,
    })
    await expect(async () => {
      await sut.execute({
        gymId: closerGymSample.id,
        userId: userSample.id,
        userLatitude: userSample.latitude,
        userLongitude: userSample.longitude,
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: closerGymSample.id,
      userId: userSample.id,
      userLatitude: userSample.latitude,
      userLongitude: userSample.longitude,
    })

    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymId: closerGymSample.id,
      userId: userSample.id,
      userLatitude: userSample.latitude,
      userLongitude: userSample.longitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))
    await expect(async () => {
      await sut.execute({
        gymId: distantGymSample.id,
        userId: userSample.id,
        userLatitude: userSample.latitude,
        userLongitude: userSample.longitude,
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
