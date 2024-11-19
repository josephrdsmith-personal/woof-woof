import { TaskRepository } from '../../../src/repositories/memory/task.repository';
import { Task, TaskStatus } from '../../../src/types/task';

describe('TaskRepository', () => {
  let repository: TaskRepository;

  beforeEach(() => {
    repository = new TaskRepository();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        userId: '123',
        status: TaskStatus.TODO
      };

      const task = await repository.create(taskData);

      expect(task).toMatchObject({
        ...taskData,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
    });
  });

  describe('findById', () => {
    it('should return null for non-existent task', async () => {
      const task = await repository.findById('non-existent');
      expect(task).toBeNull();
    });
  });
}); 