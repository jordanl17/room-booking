import { UPDATED_RECENT_BOOKED_ROOMS } from '@constants/eventKeys'
import { BOOKED_ROOMS_KEY } from '@constants/localStorageKeys'
import { useQueryClient } from 'react-query'
import { Room, Rooms } from '../../../types/api'

/**
 * Hook to manage the after effects of booking a room
 * ie: updating the memory cache;
 * storing id in local storage
 */
const updateRoomSpots = (updatedRoomName: string) => (roomInCache: Room) =>
  roomInCache.name === updatedRoomName
    ? { ...roomInCache, spots: roomInCache.spots - 1 }
    : roomInCache

const useAfterRoomBooking = () => {
  const queryClient = useQueryClient()

  const postRoomBooking = (bookedRoomName: Room['name']) => {
    queryClient.setQueryData(
      'rooms',
      (currentRoomsData: Rooms | undefined): Rooms => {
        // this will never actually happen, however react-query doesn't know this
        if (!currentRoomsData) return {} as Rooms
        const { rooms } = currentRoomsData

        return {
          rooms: rooms.map(updateRoomSpots(bookedRoomName)),
        }
      }
    )

    const existingBookedRooms = JSON.parse(
      localStorage.getItem(BOOKED_ROOMS_KEY) || '{}'
    )
    localStorage.setItem(
      BOOKED_ROOMS_KEY,
      JSON.stringify({ ...existingBookedRooms, [bookedRoomName]: Date.now() })
    )
    dispatchEvent(new Event(UPDATED_RECENT_BOOKED_ROOMS))
  }

  return postRoomBooking
}

export default useAfterRoomBooking
