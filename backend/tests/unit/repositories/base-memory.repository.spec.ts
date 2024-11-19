import { BaseMemoryRepository } from '../../../src/repositories/memory/base-memory.repository';
import type { Entity } from '../../../src/types/entity';

// Test entity type
interface TestEntity extends Entity {
  name: string;
}

// Test implementation of BaseMemoryRepository
class TestRepository extends BaseMemoryRepository<TestEntity> {}

describe('BaseMemoryRepository', () => {
  let repository: TestRepository;

  beforeEach(() => {
    repository = new TestRepository();
  });

  describe('create', () => {
    it('should create an entity with generated id and timestamps', async () => {
      const entity = await repository.create({ name: 'Test' });
      
      expect(entity.id).toBeDefined();
      expect(entity.name).toBe('Test');
      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('update', () => {
    it('should update an existing entity', async () => {
      const entity = await repository.create({ name: 'Test' });
      const updated = await repository.update(entity.id, { name: 'Updated' });
      
      expect(updated.name).toBe('Updated');
      expect(updated.updatedAt).not.toEqual(entity.updatedAt);
    });

    it('should throw error when updating non-existent entity', async () => {
      await expect(repository.update('non-existent', { name: 'Test' }))
        .rejects
        .toThrow('Entity with id non-existent not found');
    });
  });

  describe('delete', () => {
    it('should delete an existing entity', async () => {
      const entity = await repository.create({ name: 'Test' });
      await expect(repository.delete(entity.id)).resolves.not.toThrow();
      const found = await repository.findById(entity.id);
      expect(found).toBeNull();
    });

    it('should throw error when deleting non-existent entity', async () => {
      await expect(repository.delete('non-existent'))
        .rejects
        .toThrow('Entity with id non-existent not found');
    });
  });

  describe('findById', () => {
    it('should find entity by id', async () => {
      const entity = await repository.create({ name: 'Test' });
      const found = await repository.findById(entity.id);
      expect(found).toEqual(entity);
    });

    it('should return null for non-existent entity', async () => {
      const found = await repository.findById('non-existent');
      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all entities', async () => {
      await repository.create({ name: 'Test 1' });
      await repository.create({ name: 'Test 2' });
      
      const entities = await repository.findAll();
      expect(entities).toHaveLength(2);
    });

    it('should handle pagination', async () => {
      await repository.create({ name: 'Test 1' });
      await repository.create({ name: 'Test 2' });
      await repository.create({ name: 'Test 3' });
      
      const page1 = await repository.findAll({ page: 1, limit: 2 });
      expect(page1).toHaveLength(2);
      
      const page2 = await repository.findAll({ page: 2, limit: 2 });
      expect(page2).toHaveLength(1);
    });
  });
}); 