import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import ComponentTestHarness from '@utils/ComponentTestHarness'
import Rooms from './Rooms'

jest.mock('@utils/api', () => ({
  getAllRooms: jest.fn().mockReturnValue({
    rooms: [
      { name: 'first room', spots: 2, thumbnail: 'first room image' },
      { name: 'second room', spots: 1, thumbnail: 'second room image' },
    ],
  }),
  bookRoom: jest
    .fn()
    .mockImplementation((roomName) => Promise.resolve(roomName)),
}))

const renderer = async () => {
  await render(
    <ComponentTestHarness>
      <Rooms />
    </ComponentTestHarness>
  )

  await waitFor(() => {
    screen.getByText('Rooms')
  })
}

describe('Rooms E2E', () => {
  beforeEach(renderer)

  test('has title and subtitle', () => {
    screen.getByText('Rooms')
    screen.getByText('Search and book a room below.')
  })

  test('shows all rooms', () => {
    const [firstRoom, secondRoom] = screen.getAllByTestId('room-card')

    within(firstRoom).getByText('first room')
    within(firstRoom).getByText('2 spots remaining')
    within(firstRoom).getByText('Book!')

    within(secondRoom).getByText('second room')
    within(secondRoom).getByText('1 spots remaining')
    within(secondRoom).getByText('Book!')
  })

  test('placing a single booking for a room', async () => {
    const [firstRoom] = screen.getAllByTestId('room-card')

    fireEvent.click(within(firstRoom).getByText('Book!'))

    await waitFor(() => {
      screen.getByText('Secured your place at first room')
    })

    within(firstRoom).getByText('1 spots remaining')
  })

  test('placing a booking for the last spot in a room', async () => {
    const [_, secondRoom] = screen.getAllByTestId('room-card')

    fireEvent.click(within(secondRoom).getByText('Book!'))

    await waitFor(() => {
      screen.getByText('Secured your place at second room')
    })

    expect(
      within(secondRoom).queryByText('spots remaining', { exact: false })
    ).toBeNull()
    expect(within(secondRoom).queryByText('Book!')).toBeNull()
  })
})
