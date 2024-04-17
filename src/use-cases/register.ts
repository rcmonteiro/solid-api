import { UserRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

interface registerUseCaseParams {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ name, email, password }: registerUseCaseParams) {
    const userAlreadyExists = await this.userRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new Error('User already exists')
    }

    const password_hash = await hash(password, 6)

    await this.userRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
