import {
  NOTIFICATION_TYPES,
  useNotifications,
} from '@contexts/Notifications/notificationsProvider'
import { useMutation } from 'react-query'
import { Room } from '../../../types/api'
import { bookRoom } from '@utils/api'
import useAfterRoomBooking from './useAfterRoomBooking'
import Button from '@atoms/Button'

export type CardRoomType = Room & { isRecent?: boolean }

type Props = CardRoomType

const RoomCard = ({ name, spots, thumbnail, isRecent }: Props) => {
  const afterRoomBooking = useAfterRoomBooking()
  const { addNotification } = useNotifications()

  const updateRoomInCache = () => {
    afterRoomBooking(name)
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
  const bookCtaLabel = () => {
    if (isSavingBooking) return 'Booking...'
    return isRecent ? 'Book again!' : 'Book!'
  }

  return (
    <section
      data-testid="room-card"
      className={`rounded-md relative m-1 h-fit ${
        isNotAvailable ? 'opacity-50' : ''
      }`}
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
          <Button onClick={() => book(name)} disabled={isSavingBooking}>
            {bookCtaLabel()}
          </Button>
        )}
      </div>
    </section>
  )
}

export default RoomCard
