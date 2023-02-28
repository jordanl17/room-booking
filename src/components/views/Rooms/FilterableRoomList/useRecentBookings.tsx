import { UPDATED_RECENT_BOOKED_ROOMS } from '@constants/eventKeys'
import { BOOKED_ROOMS_KEY } from '@constants/localStorageKeys'
import { useEffect, useState } from 'react'

type LocalStorageRecentBookings = Record<string, number>

const RECENCY_IN_MINUTES = 1

/**
 * Hook to retrieve names of all rooms
 * that are considered to have been recently booked
 *
 * Additional sideeffect of this hook is to cleanup
 * recently booked rooms
 */
const useRecentBookings = () => {
  const [visibleRecents, setVisibleRecents] =
    useState<LocalStorageRecentBookings>({})

  useEffect(() => {
    const timeNow = Date.now()
    const localStorageRecents: LocalStorageRecentBookings = JSON.parse(
      localStorage.getItem(BOOKED_ROOMS_KEY) || '{}'
    )
    const updatedRecentBookings = Object.entries(localStorageRecents).reduce(
      (updated, [roomName, lastBooked]) => {
        if (lastBooked < timeNow - RECENCY_IN_MINUTES * 60 * 1000) {
          // remove stale rooms from recent list
          return updated
        }
        return { ...updated, [roomName]: lastBooked }
      },
      {}
    )

    setVisibleRecents(updatedRecentBookings)
    localStorage.setItem(
      BOOKED_ROOMS_KEY,
      JSON.stringify(updatedRecentBookings)
    )
  }, [])

  useEffect(() => {
    const handleNewRecentBookings = () => {
      const newInLocal = JSON.parse(
        localStorage.getItem(BOOKED_ROOMS_KEY) || '{}'
      )

      setVisibleRecents((current) => {
        return { ...current, ...newInLocal }
      })
    }

    window.addEventListener(
      UPDATED_RECENT_BOOKED_ROOMS,
      handleNewRecentBookings
    )

    return () =>
      window.removeEventListener(
        UPDATED_RECENT_BOOKED_ROOMS,
        handleNewRecentBookings
      )
  }, [])

  return Object.keys(visibleRecents)
}

export default useRecentBookings
