import { RoomCardSkeleton } from '@molecules/RoomCard'

const RoomListSkeleton = () => (
  <div data-testid="room-list-skeleton">
    {Array(6)
      .fill(undefined)
      .map((_, index) => (
        <li key={`${index}-skeleton-room-card`}>
          <RoomCardSkeleton />
        </li>
      ))}
  </div>
)

export default RoomListSkeleton
