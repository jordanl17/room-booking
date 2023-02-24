import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

interface NotificationsProviderPropTypes {
  children: React.ReactNode
}

export const NOTIFICATION_TYPES = {
  error: 'error',
  success: 'success',
} as const

const NOTIFICATION_COLOR: Record<
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES],
  string
> = {
  [NOTIFICATION_TYPES.error]: 'red',
  [NOTIFICATION_TYPES.success]: 'green',
}

interface Notification {
  type: (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]
  message: string
}

const NotificationsContext = createContext<{
  addNotification: (notification: Notification) => void
}>({
  addNotification: () => null,
})

export const useNotifications = () => {
  const context = useContext(NotificationsContext)

  return context
}

const NotificationsProvider = ({
  children,
}: NotificationsProviderPropTypes) => {
  const [notifications, setNotifications] = useState<
    (Notification & { id: number })[]
  >([])
  const isMounted = useRef(false)

  const addNotification: (notification: Notification) => void = useCallback(
    (notification) => {
      setNotifications((currentNotifications) => [
        ...currentNotifications,
        // create a time based id as react key
        { ...notification, id: Date.now() },
      ])

      setTimeout(() => {
        if (isMounted)
          setNotifications((currentNotifications) => {
            const newNotifications = [...currentNotifications]
            newNotifications.shift()

            return newNotifications
          })
      }, 3000)
    },
    []
  )

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  const value = useMemo(() => ({ addNotification }), [addNotification])
  return (
    <NotificationsContext.Provider value={value}>
      <div className="absolute inset-x-0 opacity-80">
        {notifications.slice(-2).map(({ type, message, id }) => (
          <div
            data-testid={`${type}-notification`}
            className={`mx-10 bg-${NOTIFICATION_COLOR[type]}-600 text-${NOTIFICATION_COLOR[type]}-200 p-3 my-1`}
            key={`${id}-${message}`}
          >
            {message}
          </div>
        ))}
      </div>
      {children}
    </NotificationsContext.Provider>
  )
}

export default NotificationsProvider
