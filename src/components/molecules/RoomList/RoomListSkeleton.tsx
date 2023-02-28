import { RoomCardSkeleton } from '@molecules/RoomCard'

const RoomListSkeleton = () => (
  <ul
    data-testid="room-list-skeleton"
    className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  >
    {Array(6)
      .fill(undefined)
      .map((_, index) => (
        <li key={`${index}-skeleton-room-card`}>
          <RoomCardSkeleton />
        </li>
      ))}
  </ul>
)

export default RoomListSkeleton
