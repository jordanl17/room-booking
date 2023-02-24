import NotificationsProvider from '@contexts/Notifications/notificationsProvider'
import Rooms from '@views/Rooms'
import { QueryClient, QueryClientProvider } from 'react-query'

type Props = {}

const queryClient = new QueryClient()

function App({}: Props) {
  return (
    <div>
      <NotificationsProvider>
        <QueryClientProvider client={queryClient}>
          <Rooms />
        </QueryClientProvider>
      </NotificationsProvider>
    </div>
  )
}

export default App
