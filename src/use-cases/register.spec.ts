import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUseCase } from './register'

const sampleUserInput = {
  name: 'John Doe',
  email: 'john@doe.com',
  password: '123456',
}

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository())
    const { user } = await registerUseCase.execute(sampleUserInput)
    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash use password upon registration', async () => {
    const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository())
    const { user } = await registerUseCase.execute(sampleUserInput)
    const isPasswordHashed = await compare('123456', user.password_hash)
    expect(isPasswordHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository())
    await registerUseCase.execute(sampleUserInput)
    await expect(() =>
      registerUseCase.execute(sampleUserInput),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
