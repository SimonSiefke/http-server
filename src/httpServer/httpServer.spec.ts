import * as request from 'supertest'
import { createHttpServer, HttpServer } from './httpServer'
import * as util from '../util/util'

//
// ─── SETUP ──────────────────────────────────────────────────────────────────────
//
let httpServer: HttpServer
let app: request.SuperTest<request.Test>

beforeAll(() => {
  httpServer = createHttpServer({
    directory: __dirname,
  })
  app = request(httpServer)
})

afterAll(() => {
  httpServer.close()
})

//
// ─── MOCKS ──────────────────────────────────────────────────────────────────────
//
const isFile = jest
  .spyOn(util, 'isFile')
  .mockImplementation(absolutePath =>
    Promise.resolve(absolutePath.endsWith('.html'))
  )

const getFile = jest
  .spyOn(util, 'getFile')
  .mockImplementation(() => Promise.resolve('Hello World'))

//
// ─── TESTS ──────────────────────────────────────────────────────────────────────
//
test('should respond with index.html', done => {
  app
    .get('/')
    .expect('Content-Type', 'text/html')
    .expect(/hello world/i)
    .expect(200, done)
})

test('should ignore query strings', done => {
  getFile.mockImplementation(() => Promise.resolve('Hello World'))
  app.get('/index.html?version=2').expect(/hello world/i, done)
})

// TODO
// test('should inject code into index.html', done => {
//   getFile.mockImplementation(() => Promise.resolve('Hello World'))
//   app
//     .get('/')
//     .expect('Content-Type', 'text/html')
//     .expect(/hello world/i)
//     .expect(200, done)
// })

test('should respond with 404 when file does not exist', done => {
  isFile.mockImplementation(() => Promise.resolve(false))
  app.get('/').expect(404, done)
})
