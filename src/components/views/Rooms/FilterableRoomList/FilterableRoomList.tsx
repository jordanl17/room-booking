import {
  NOTIFICATION_TYPES,
  useNotifications,
} from '@contexts/Notifications/notificationsProvider'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { Room, Rooms } from '../../../../types/api'
import { getAllRooms } from '@utils/api'
import { SortableFieldKey, SortDirection } from '@utils/roomSortHelpers'
import filterFncs from './filterFncs'
import RoomList from '@molecules/RoomList'
import { CardRoomType } from '@molecules/RoomCard/RoomCard'
import useRecentBookings from './useRecentBookings'

const FilterableRoomList = () => {
  const { data, isLoading, isError } = useQuery<Rooms>('rooms', getAllRooms)
  const { addNotification } = useNotifications()
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false)
  const [activeSortDirection, setActiveSortDirection] = useState<SortDirection>(
    SortDirection.UNSORTED
  )
  const [activeSortField, setActiveSortField] =
    useState<SortableFieldKey>('name')
  const recentBookingNames = useRecentBookings()

  useEffect(() => {
    if (isError) {
      addNotification({
        type: NOTIFICATION_TYPES.error,
        message: 'Error loading available rooms',
      })
    }
  }, [addNotification, isError])

  const highlightRecents = useCallback(
    (rooms: Room[]): CardRoomType[] =>
      rooms.map((room) => ({
        ...room,
        isRecent: recentBookingNames.includes(room.name),
      })),
    [recentBookingNames]
  )

  const visibleRooms = useMemo(() => {
    if (!data) return data
    if (!showOnlyAvailable && !activeSortDirection)
      return highlightRecents(data.rooms)

    const filtersToApply = []

    // order is important for efficiency - apply the filter on spots first
    if (showOnlyAvailable) filtersToApply.push(filterFncs.filterOnlyAvailable)
    if (activeSortDirection) {
      filtersToApply.push(
        filterFncs.sortByField(activeSortField, activeSortDirection)
      )
    }

    return highlightRecents(
      filtersToApply.reduce((result, fnc) => fnc(result), data.rooms)
    )
  }, [
    data,
    showOnlyAvailable,
    activeSortDirection,
    highlightRecents,
    activeSortField,
  ])

  const handleToggleShowAvailable = () =>
    setShowOnlyAvailable((current) => !current)

  const handleSortingChange =
    (param: 'direction' | 'field') =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const {
        target: { value },
      } = e

      if (param === 'direction')
        setActiveSortDirection(
          SortDirection[value as keyof typeof SortDirection]
        )
      else {
        setActiveSortField(value as SortableFieldKey)
        if (!activeSortDirection) setActiveSortDirection(SortDirection.ASC)
      }
    }

  const renderListFilters = () => (
    <div className="flex flex-col items-end sm:flex-row gap-5 justify-end my-2 px-4 md:items-baseline">
      <button
        className="rounded-md border-purple border-2 p-2"
        onClick={handleToggleShowAvailable}
      >
        {showOnlyAvailable ? 'Show all rooms' : 'Show only available room'}
      </button>
      <span className="flex flex-row gap-1 items-baseline">
        <label htmlFor="direction-select">Sort in:</label>
        <select
          className="rounded-md border-purple border-2 p-2"
          value={SortDirection[activeSortDirection]}
          name="direction"
          id="direction-select"
          onChange={handleSortingChange('direction')}
        >
          {[SortDirection.UNSORTED, SortDirection.ASC, SortDirection.DESC].map(
            (direction) => (
              <option key={direction} value={SortDirection[direction]}>
                {SortDirection[direction]}
              </option>
            )
          )}
        </select>
      </span>
      <span className="flex flex-row gap-1 items-baseline">
        <label htmlFor="field-select">Sort by:</label>
        <select
          className="rounded-md border-purple border-2 p-2"
          value={activeSortField}
          name="field"
          id="field-select"
          onChange={handleSortingChange('field')}
        >
          {['name', 'spots'].map((field) => (
            <option key={field} value={field}>
              {field.toUpperCase()}
            </option>
          ))}
        </select>
      </span>
    </div>
  )

  return (
    <section>
      {renderListFilters()}
      <RoomList rooms={visibleRooms} isLoading={isLoading} />
    </section>
  )
}

export default FilterableRoomList
