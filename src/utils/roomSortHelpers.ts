import { Room } from '../types/api'

export enum SortDirection {
  UNSORTED,
  ASC,
  DESC,
}

export type SortableFieldKey = 'name' | 'spots'
type SortableFieldType = Room[SortableFieldKey]

const sortAsc = (A: SortableFieldType, B: SortableFieldType) => {
  if (A > B) return 1
  if (A < B) return -1
  return 0
}

type SortByType = (
  sortField: SortableFieldKey,
  sortDirection: SortDirection
) => (A: Room, B: Room) => number

export const sortBy: SortByType =
  (sortField, sortDirection) => (roomA, roomB) => {
    if (sortDirection === SortDirection.UNSORTED) return 0

    const { [sortField]: fieldA } = roomA
    const { [sortField]: fieldB } = roomB
    const sortResult = sortAsc(fieldA, fieldB)

    return sortDirection === SortDirection.DESC ? -sortResult : sortResult
  }
