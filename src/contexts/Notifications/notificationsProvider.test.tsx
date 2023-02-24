import { fireEvent, render, screen, within } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import NotificationsProvider, {
  NOTIFICATION_TYPES,
  useNotifications,
} from './notificationsProvider'

const NotificationsHarness = () => {
  const { addNotification } = useNotifications()

  const handleAddNotification = (errorType: 'success' | 'error') => () =>
    addNotification({
      type: NOTIFICATION_TYPES[errorType],
      message: `test ${errorType} message`,
    })

  return (
    <>
      <button onClick={handleAddNotification(NOTIFICATION_TYPES.error)}>
        trigger error
      </button>
      <button onClick={handleAddNotification(NOTIFICATION_TYPES.success)}>
        trigger success
      </button>
    </>
  )
}

describe('notifications', () => {
  let unmount: () => void

  beforeEach(() => {
    jest.useFakeTimers()

    const renderer = render(
      <NotificationsProvider>
        <NotificationsHarness />
      </NotificationsProvider>
    )

    unmount = renderer.unmount
  })

  test('initially has no notifications', () => {
    expect(screen.queryByTestId('notification', { exact: false })).toBeNull()
  })

  test.each(['success', 'error'])(
    'shows %s notification',
    (notificationType) => {
      fireEvent.click(screen.getByText(`trigger ${notificationType}`))

      const notification = screen.getByTestId(
        `${notificationType}-notification`
      )
      within(notification).getByText(`test ${notificationType} message`)
    }
  )

  test('notification disappears after 3s', async () => {
    fireEvent.click(screen.getByText('trigger success'))

    screen.getByText('test success message')

    await act(async () => {
      jest.advanceTimersByTime(2500)
    })

    screen.getByText('test success message')

    await act(async () => {
      jest.advanceTimersByTime(500)
    })

    expect(screen.queryByText('test success message')).toBeNull()
  })

  test('only shows 2 most recent notifications', () => {
    fireEvent.click(screen.getByText('trigger success'))
    fireEvent.click(screen.getByText('trigger success'))
    fireEvent.click(screen.getByText('trigger error'))
    fireEvent.click(screen.getByText('trigger error'))

    expect(screen.queryAllByText('test success message').length).toEqual(0)
    expect(screen.getAllByText('test error message').length).toEqual(2)
  })

  test('is able to handle component unmount', async () => {
    fireEvent.click(screen.getByText('trigger success'))

    screen.getByText('test success message')

    await act(async () => {
      jest.advanceTimersByTime(2900)
    })

    unmount()

    await act(async () => {
      jest.advanceTimersToNextTimer()
    })

    expect(screen.queryByText('test success message')).toBeNull()
  })
})
