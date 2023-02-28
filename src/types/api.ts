export interface Room {
  name: string
  spots: number
  thumbnail: string
}

export interface Rooms {
  readonly rooms: Room[]
}
