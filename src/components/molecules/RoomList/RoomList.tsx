import RoomCard from '@molecules/RoomCard'
import { Room } from '../../../types/api'
import RoomListSkeleton from './RoomListSkeleton'

type Props = {
  rooms: Room[] | undefined
  isLoading?: boolean
  isError?: boolean
}

const RoomList = ({ rooms, isLoading, isError }: Props) => {
  if (isLoading) return <RoomListSkeleton />
  if (isError) return null // notification created by parent
  if (!rooms || !rooms.length) {
    return (
      <div className="flex justify-center align-center mt-10 text-2xl">
        No rooms available
      </div>
    )
  }

  return (
    <ul className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {rooms.map((room) => (
        <li key={room.name}>
          <RoomCard {...room} />
        </li>
      ))}
    </ul>
  )
}

export default RoomList
