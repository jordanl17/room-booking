import { RoomCardSkeleton } from '@atoms/RoomCard'

const RoomListSkeleton = () => (
  <>
    {Array(6)
      .fill(undefined)
      .map((_, index) => (
        <li key={`${index}-skeleton-room-card`}>
          <RoomCardSkeleton />
        </li>
      ))}
  </>
)

export default RoomListSkeleton
