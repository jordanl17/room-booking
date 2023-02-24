import RoomCard from '@atoms/RoomCard'
import {
  NOTIFICATION_TYPES,
  useNotifications,
} from '@contexts/Notifications/notificationsProvider'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { Rooms } from '../../../types/api'
import { getAllRooms } from '../../../utils/api'
import RoomListSkeleton from './RoomListSkeleton'

const RoomList = () => {
  const { data, isLoading, isError } = useQuery<Rooms>('rooms', getAllRooms)
  const { addNotification } = useNotifications()

  useEffect(() => {
    if (isError) {
      addNotification({
        type: NOTIFICATION_TYPES.error,
        message: 'Error loading available rooms',
      })
    }
  }, [addNotification, isError])

  const renderRoomListContent = () => {
    if (isLoading) return <RoomListSkeleton />

    return data?.rooms.map((roomParams) => (
      <li key={roomParams.name}>
        <RoomCard {...roomParams} />
      </li>
    ))
  }

  return (
    <ul className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {renderRoomListContent()}
    </ul>
  )
}

export default RoomList
