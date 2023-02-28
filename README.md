## Room Booking app

### scripts

- `npm run dev` - will start the dev serve running on port `3000`
- `npm t` - will run a suite of unit and e2e tests
- `npm run test:coverage` - run unit and e2e tests with coverage report
- `npm run check` - run eslint and typescript compile check

### Technologies

The following packages have been used:

- `vite` for lightweight build and dev server hot reloading capabilities
- `typescript` for type safety checking at compile time
- `react` for managing logical componentialisation and DOM orchestration
- `react-query` for managing local global data cache
- `axios` as the network layer wrapper
- `testing-library/react` for unit and e2e test DOM querying
- `jest` as test runner
- `babel` for transpiling typescript files to javascript
- `tailwindcss` for declarative class styling

### dir structure
The source is broken down into the following directories and files

- `/components` holds atoms (small individual presentation, or minimal logic holding components); and molecules (larger components, such as orchestration of multiple atoms in `RoomCard`). `views` are also present - where a view is a single page (in this case `Rooms`, and then reused components only within a single view are presented within the view's dir)
- `/constants` has constant values used for keys or network config
- `/contexts` holds a globally accessible Notifications config (more on this below)

### Features

First commit - includes all basic functionality to:

- show all rooms
- support placing a single spot booking on an available room
- style to match wireframe
- testing for all units, and some e2e flows

Second commit - Filter extensions:  
Additional features added to filter only showing available room; to sort according to both name or number of available spots  
NOTE: no tests added in this commit, mostly due to time

Third commit - Recently booked logic:
The CTA button will change from 'Book!' to 'Book again!' for all rooms that have been booked recently. Recently is currently considered to just be within the last minute (unreasonable but useful for demonstration purposed). The logic here uses local storage to track the rooms that have been recently booked
NOTE: test also not added for this, this was added only as a stretch feature

### Notifications

To provide user feedback on actions, and indeed errors, a notifications banner is provided. This is surfaced up as a wrapping context with a custom hook for use in consumers. This approach was taken, as although there exist open sourced packages on NPM to offer up notification stacking eg notistack, this seemed a little overkill in this particular instance, and would have also increased bundle size. Instead the solution provided, although quite crude and not great for volume or more complex use (eg different timeouts for different notifications), it works well in this scenario

### Styling

Styling mimics that of the provided wireframe. Note however, that exact spacing of grid layout items is not matching as the known grid rem was know provided.

Classnames use template literals. Although packages exist to make this much more elegant (eg `classnames`), this was deemed to add to the bundle size more that it would improve code readability, so wasn't added.

### Testing

Tests cover unit tests for molecules and atoms; tests for the shuffle logic implementations; and for the notifications context; and also api functions

E2E tests ensure correct integration of all components to form coherent screen flow.

Note the creation of `advanceTimersAndFlush()` in [`api.test.ts`](./src/utils/api.test.ts). This was required due to the way that `jest`'s `advanceTimersByTime` plays with a promise. In the api file [`api.ts`](./src/utils/api.ts) a promise swapped timeout was utilised to mock the endpoint which would be used to place a booking on a room. When `advanceTimersByTime` is used, all previous calls to a timer fnc eg. `setTimeout` or `setInterval` are spied on by jest. However, in the case of a `setTimeout` within a Promise, the promise cb is still within the microtask queue within the JS environment, and is yet to be executed on the stack, thus jest is not aware of its existence. This means that `advanceTimerByTime` will run only callbacks within timer functions, but logic that awaits the resolution of a promise will be blocked from detection by the event loop.

By introducing a promise-ified call to `setImmediate`, a flush of the microtask queue is triggered by the event loop, which ensures that those pending promises resulting from timer logic are available for execution.

### Further considerations
If more time was allows the following changes could be made:
* Ideally the server would offer up UUIDs for rooms; currently the FE uses name as the id. Alternatively, the FE could create dynamic UUIDs after the initial fetch. This was not added as part of this work but would improve robustness of this solution
* I18n bundle would probably be useful for accessibility
* Addition of optimistic loading - currently booking a room involves waiting to see confirmation of the booking. The FE could immediately assume successful booking, and then on server response either retain its current state, or revert and provide the user with a warning.
* API endpoint to book a room - the implemented logic here assumed the existence of a mocked endpoint which does not provide any data in response. Therefore, it is up to the client to reconcile the new state of server data. Ideally, an endpoint would return the new available spots at the booked room. This would avoid race conditions where a user believes they've booked the last spot in a room, but there has actually been a cancellation received simultaneously on server. An alternative approach to ensure sync of client and server data would be that after the room booking mutation has completed, a refetch of the lists query would be performed. This wasn't implemented in this example as the list would return the old data.
* Additional functionality eg cancel a booking, see existing bookings, or book multiple spots at once
* Testing for the additional features beyond MVP
* Improvement on the recently booked feature to perhaps improve the quick accessibility to recently booked rooms
* Better consideration to API types- `Room` and `Rooms` are used, but to keep a consistent use of the API types, `Rooms` might be best used and then `Rooms['rooms']` used in lieu of `Room` type