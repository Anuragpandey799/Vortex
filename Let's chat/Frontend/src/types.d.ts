export type Message = {
  _id?: string;
  room: string;
  userId: string;
  username: string;
  text: string;
  createdAt?: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
};
