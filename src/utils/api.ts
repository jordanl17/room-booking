import axios from 'axios'
import { Rooms } from '../types/api'

export const getAllRooms: () => Promise<Rooms> = async () => {
  const { data } = await axios.get<Rooms>(
    'https://wetransfer.github.io/rooms.json'
  )

  return data
}

export const bookRoom = (roomName: string): Promise<string> => {
  return new Promise((resolve) => setTimeout(() => resolve(roomName), 1000))
}
