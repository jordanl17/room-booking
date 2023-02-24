import { useNotifications } from '@contexts/Notifications/notificationsProvider'
import { fireEvent, render, screen } from '@testing-library/react'
import { useMutation, useQueryClient } from 'react-query'
import ComponentTestHarness from '../../../utils/ComponentTestHarness'
import RoomCard from './RoomCard'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}))

jest.mock('@contexts/Notifications/notificationsProvider', () => ({
  ...jest.requireActual('@contexts/Notifications/notificationsProvider'),
  useNotifications: jest.fn(),
}))

const mockUseMutation = useMutation as jest.Mock
const mockUseQueryClient = useQueryClient as jest.Mock
const mockUseNotifications = useNotifications as jest.Mock

const mockBookRoom = jest.fn()
const mockSetQueryData = jest.fn()
const mockAddNotification = jest.fn()

mockUseMutation.mockReturnValue({ mutate: mockBookRoom })
mockUseQueryClient.mockReturnValue({ setQueryData: mockSetQueryData })
mockUseNotifications.mockReturnValue({ addNotification: mockAddNotification })

describe('RoomCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('room with availability', () => {
    beforeEach(() => {
      render(
        <ComponentTestHarness>
          <RoomCard
            name="mock room name"
            spots={3}
            thumbnail="mock thumb url/route.jpg"
          />
        </ComponentTestHarness>
      )
    })

    test('has image of room', () => {
      const imageEl = screen.getByRole('img')

      expect(imageEl).toHaveAttribute('src', 'mock thumb url/route.jpg')
      expect(imageEl).toHaveAttribute('alt', 'mock room name')
    })

    test('has name of room', () => {
      screen.getByText('mock room name')
    })

    test('has spot availability message', () => {
      screen.getByText('3 spots remaining')
    })

    test('has no book button', () => {
      screen.getByText('Book!')
    })

    describe('when booking a room', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByText('Book!'))
      })

      test('should make request to book the room', async () => {
        expect(mockBookRoom).toHaveBeenCalledWith('mock room name')
      })

      describe('when booking is successful', () => {
        beforeEach(() => {
          const successCb = mockUseMutation.mock.calls[0][2].onSuccess

          successCb()
        })

        test('updates mem cache to decrement spots for room', () => {
          expect(mockSetQueryData).toHaveBeenCalledWith(
            'rooms',
            expect.any(Function)
          )

          const cacheUpdaterCb = mockSetQueryData.mock.calls[0][1]

          const newCache = cacheUpdaterCb({
            rooms: [
              { name: 'mock room name', spots: 3 },
              { name: 'mock some other room', spots: 10 },
            ],
          })

          expect(newCache).toEqual({
            rooms: [
              { name: 'mock room name', spots: 2 },
              { name: 'mock some other room', spots: 10 },
            ],
          })
        })

        test('triggers success notification', () => {
          expect(mockAddNotification).toHaveBeenCalledWith({
            message: 'Secured your place at mock room name',
            type: 'success',
          })
        })
      })

      describe('when booking fails', () => {
        beforeEach(() => {
          const errorCb = mockUseMutation.mock.calls[0][2].onError

          errorCb()
        })

        test('triggers error notification', () => {
          expect(mockAddNotification).toHaveBeenCalledWith({
            message: 'Sorry, something went wrong, try booking again',
            type: 'error',
          })
        })
      })
    })
  })

  describe('room with no availability', () => {
    beforeEach(() => {
      render(
        <ComponentTestHarness>
          <RoomCard
            name="mock room name"
            spots={0}
            thumbnail="mock thumb url/route.jpg"
          />
        </ComponentTestHarness>
      )
    })

    test('has image of room', () => {
      const imageEl = screen.getByRole('img')

      expect(imageEl).toHaveAttribute('src', 'mock thumb url/route.jpg')
      expect(imageEl).toHaveAttribute('alt', 'mock room name')
    })

    test('has name of room', () => {
      screen.getByText('mock room name')
    })

    test('has unavailable banner', () => {
      screen.getByText('Out of spots')
    })

    test('has no spot availability message', () => {
      expect(screen.queryByText('spots remaining', { exact: false })).toBeNull()
    })

    test('has no book button', () => {
      expect(screen.queryByText('Book!')).toBeNull()
    })
  })
})
