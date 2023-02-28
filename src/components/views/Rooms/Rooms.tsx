import RoomList from '@views/Rooms/FilterableRoomList'

const Rooms = () => (
  <>
    <header className="py-6">
      <h1 className="text-4xl font-normal">Rooms</h1>
      <h2 className="text-2xl font-normal">Search and book a room below.</h2>
    </header>
    <main>
      <RoomList />
    </main>
  </>
)

export default Rooms
