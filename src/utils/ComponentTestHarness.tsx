import NotificationsProvider from '@contexts/Notifications/notificationsProvider'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

const ComponentTestHarness = ({
  children,
}: {
  children: JSX.Element | string
}) => (
  <NotificationsProvider>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </NotificationsProvider>
)

export default ComponentTestHarness
