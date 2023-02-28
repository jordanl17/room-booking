import RoomList from './RoomList'
import { render, screen } from '@testing-library/react'

jest.mock('@molecules/RoomCard', () => ({
  ...jest.requireActual('@molecules/RoomCard'),
  default: ({ name }: { name: string }) => <div>room={name}</div>,
}))

describe('RoomList', () => {
  test('shows skeleton when loading', () => {
    render(<RoomList rooms={undefined} isLoading />)

    screen.getByTestId('room-list-skeleton')
  })

  test('shows empty state when there are no rooms', () => {
    const { rerender } = render(<RoomList rooms={undefined} />)

    screen.getByText('No rooms available')

    rerender(<RoomList rooms={[]} />)

    screen.getByText('No rooms available')
  })

  test('renders list of rooms', () => {
    render(
      <RoomList
        rooms={[
          { name: 'first room', thumbnail: 'first thumbnail', spots: 1 },
          { name: 'second room', thumbnail: 'second thumbnail', spots: 2 },
        ]}
      />
    )

    screen.getByText('room=first room')
    screen.getByText('room=second room')
  })
})
