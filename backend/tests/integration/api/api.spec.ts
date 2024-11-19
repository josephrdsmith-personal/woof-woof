import { createServer } from '../../../src/server'
import request from 'supertest'
import { TaskStatus } from '../../../src/types/task'

describe('API Integration Tests', () => {
  const app = createServer()

  describe('Tasks API', () => {
    it('should create a new task', async () => {
      const response = await request(app.callback())
        .post('/api/tasks')
        .send({
          userId: 'test-user',
          title: 'Test Task',
          description: 'Test Description',
          status: TaskStatus.TODO
        })

      expect(response.status).toBe(201)
      expect(response.body).toMatchObject({
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO
      })
    })

    it('should get a task by id', async () => {
      // First create a task
      const createResponse = await request(app.callback())
        .post('/api/tasks')
        .send({
          userId: 'test-user',
          title: 'Test Task',
          status: TaskStatus.TODO
        })

      // Then get it by id
      const response = await request(app.callback())
        .get(`/api/tasks/${createResponse.body.id}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(createResponse.body)
    })

    it('should return 404 for non-existent task', async () => {
      const response = await request(app.callback())
        .get('/api/tasks/non-existent')

      expect(response.status).toBe(404)
    })
  })
})