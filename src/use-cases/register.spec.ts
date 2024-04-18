import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUseCase } from './register'

const sampleUserInput = {
  name: 'John Doe',
  email: 'john@doe.com',
  password: '123456',
}

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute(sampleUserInput)
    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash use password upon registration', async () => {
    const { user } = await sut.execute(sampleUserInput)
    const isPasswordHashed = await compare('123456', user.password_hash)
    expect(isPasswordHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    await sut.execute(sampleUserInput)
    await expect(() => sut.execute(sampleUserInput)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })
})
