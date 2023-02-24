import {
  NOTIFICATION_TYPES,
  useNotifications,
} from '@contexts/Notifications/notificationsProvider'
import { useMutation, useQueryClient } from 'react-query'
import { Room, Rooms } from '../../../types/api'
import { bookRoom } from '../../../utils/api'

type Props = Room

const updateRoomSpots = (updatedRoomName: string) => (roomInCache: Room) =>
  roomInCache.name === updatedRoomName
    ? { ...roomInCache, spots: roomInCache.spots - 1 }
    : roomInCache

const RoomCard = ({ name, spots, thumbnail }: Props) => {
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  const updateRoomInCache = () => {
    queryClient.setQueryData(
      'rooms',
      (currentRoomsData: Rooms | undefined): Rooms => {
        // this will never actually happen, however react-query doesn't know this
        if (!currentRoomsData) return {} as Rooms
        const { rooms } = currentRoomsData

        return {
          // little dodgy, in that people could maybe cancel their rooms
          // and this isn't considering that
          // better way would be to requery for updated rooms
          // didnt do this because it would give back the old data
          rooms: rooms.map(updateRoomSpots(name)),
        }
      }
    )
    addNotification({
      type: NOTIFICATION_TYPES.success,
      message: `Secured your place at ${name}`,
    })
  }

  const { mutate: book, isLoading: isSavingBooking } = useMutation(
    'bookRoom',
    bookRoom,
    {
      onSuccess: updateRoomInCache,
      onError: () => {
        addNotification({
          type: NOTIFICATION_TYPES.error,
          message: 'Sorry, something went wrong, try booking again',
        })
      },
    }
  )

  const isNotAvailable = spots === 0

  return (
    <section
      data-testid="room-card"
      className={`relative m-1 h-fit ${isNotAvailable ? 'opacity-50' : ''}`}
    >
      {isNotAvailable && (
        <span className="flex block justify-center absolute bg-purple text-white w-full rounded-t-md ">
          Out of spots
        </span>
      )}
      <img
        className="rounded-md h-56 w-full object-cover"
        src={thumbnail}
        alt={name}
      />
      <div className="flex flex-row justify-between items-start py-2">
        <span>
          <div className="block font-bold">{name}</div>
          {!isNotAvailable && (
            <div className="block text-purple">{spots} spots remaining</div>
          )}
        </span>
        {!isNotAvailable && (
          <button
            onClick={() => book(name)}
            disabled={isSavingBooking}
            className="rounded-sm bg-purple text-white px-4 py-1 text-xs transition-all hover:opacity-50 hover:mt-0.5 disabled:opacity-50"
          >
            {isSavingBooking ? 'Booking...' : 'Book!'}
          </button>
        )}
      </div>
    </section>
  )
}

export default RoomCard
