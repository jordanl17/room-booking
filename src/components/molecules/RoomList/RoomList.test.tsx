import { useNotifications } from '@contexts/Notifications/notificationsProvider'
import { render, screen } from '@testing-library/react'
import { useQuery } from 'react-query'
import ComponentTestHarness from '../../../utils/ComponentTestHarness'
import RoomList from './RoomList'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn().mockReturnValue({}),
}))
jest.mock('@atoms/RoomCard', () => ({
  default: ({ name }: { name: string }) => <div>room={name}</div>,
}))
jest.mock('@contexts/Notifications/notificationsProvider', () => ({
  ...jest.requireActual('@contexts/Notifications/notificationsProvider'),
  useNotifications: jest.fn().mockReturnValue({ addNotification: jest.fn() }),
}))

const mockUseQuery = useQuery as jest.Mock
const mockUseNotifications = useNotifications as jest.Mock

describe('RoomList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('makes a call to get all rooms', () => {
    render(
      <ComponentTestHarness>
        <RoomList />
      </ComponentTestHarness>
    )
    expect(mockUseQuery).toHaveBeenCalledWith('rooms', expect.any(Function))
  })

  describe('when rooms successfully returned', () => {
    beforeEach(() => {
      mockUseQuery.mockReturnValue({
        data: {
          rooms: [
            { name: 'first room' },
            { name: 'second room' },
            { name: 'third room' },
          ],
        },
      })

      render(
        <ComponentTestHarness>
          <RoomList />
        </ComponentTestHarness>
      )
    })

    test('shows all rooms', () => {
      screen.getByText('room=first room')
      screen.getByText('room=second room')
      screen.getByText('room=third room')
    })
  })

  describe('when rooms fails to return', () => {
    const mockAddNotification = jest.fn()

    beforeEach(() => {
      mockUseQuery.mockReturnValue({ data: undefined, isError: true })
      mockUseNotifications.mockReturnValue({
        addNotification: mockAddNotification,
      })

      render(
        <ComponentTestHarness>
          <RoomList />
        </ComponentTestHarness>
      )
    })

    test('does not show any rooms', () => {
      expect(screen.queryByText('room=', { exact: false })).toBeNull()
    })

    test('triggers error notification', () => {
      expect(mockAddNotification).toHaveBeenCalledWith({
        message: 'Error loading available rooms',
        type: 'error',
      })
    })
  })
})
