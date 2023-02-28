import { Rooms } from '../../../../types/api'
import { SortableFieldKey, sortBy, SortDirection } from '@utils/roomSortHelpers'

const filterOnlyAvailable = (input: Rooms['rooms']) =>
  input.filter(({ spots }) => spots)

const sortByField =
  (field: SortableFieldKey, direction: SortDirection) =>
  (input: Rooms['rooms']) =>
    [...input].sort(sortBy(field, direction))

export default {
  filterOnlyAvailable,
  sortByField,
}
