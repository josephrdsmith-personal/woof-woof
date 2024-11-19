
import { UserRepository } from '../../../src/repositories/memory/user.repository';
import { UserCredentials } from '../../../src/types/user';

describe('UserMemoryRepository', () => {
  let repository: UserRepository;
  const mockUser: UserCredentials = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  };

  beforeEach(() => {
    repository = new UserRepository();
  });

  it('should create a new user', async () => {
    const user = await repository.create(mockUser);
    
    expect(user).toHaveProperty('id');
    expect(user.username).toBe(mockUser.username);
    expect(user.email).toBe(mockUser.email);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should find user by credentials', async () => {
    const createdUser = await repository.create(mockUser);
    const foundUser = await repository.findByCredentials(
      mockUser.username,
      mockUser.password
    );
    
    expect(foundUser).toBeDefined();
    expect(foundUser?.id).toBe(createdUser.id);
    expect(foundUser?.email).toBe(mockUser.email);
  });

  it('should return null when user not found', async () => {
    const foundUser = await repository.findByCredentials(
      'nonexistent',
      'wrongpassword'
    );
    expect(foundUser).toBeNull();
  });
});