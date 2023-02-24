import axios from 'axios'
import { bookRoom, getAllRooms } from './api'

jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
  },
}))

const advanceTimersAndFlush = (timeMs: number): Promise<unknown> => {
  jest.advanceTimersByTime(timeMs)
  return new Promise<unknown>(jest.requireActual('timers').setImmediate)
}

const mockAxiosGet = axios.get as jest.Mock

describe('getAllRooms', () => {
  test('makes call to the rooms data', () => {
    mockAxiosGet.mockResolvedValueOnce({ data: 'mock rooms' })
    getAllRooms()

    expect(mockAxiosGet).toHaveBeenCalledWith(
      'https://wetransfer.github.io/rooms.json'
    )
  })

  test('responds with the retrieved data', async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: 'mock rooms' })
    const result = await getAllRooms()

    expect(result).toEqual('mock rooms')
  })

  test('throws error when network error occurs', async () => {
    mockAxiosGet.mockRejectedValueOnce(new Error('network error'))

    try {
      await getAllRooms()
    } catch (err: any) {
      expect(err.message).toEqual('network error')
    }
  })
})

describe('bookRoom', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  test('has fake delay', async () => {
    const mockAfterResolveCb = jest.fn()

    bookRoom('mock room').then(mockAfterResolveCb)
    expect(mockAfterResolveCb).not.toHaveBeenCalled()

    await advanceTimersAndFlush(999)
    expect(mockAfterResolveCb).not.toHaveBeenCalled()
    await advanceTimersAndFlush(1)
    expect(mockAfterResolveCb).toHaveBeenCalledWith('mock room')
  })
})
