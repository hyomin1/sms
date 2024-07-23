// // socketSlice.ts
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { io, Socket } from 'socket.io-client';

// interface SocketState {
//   socket: Socket | null;
// }

// const initialState: SocketState = {
//   socket: null,
// };

// const socketSlice = createSlice({
//   name: 'socket',
//   initialState,
//   reducers: {
//     setSocket: (state, action: PayloadAction<Socket>) => {
//       state.socket = action.payload;
//     },
//   },
// });

// export const { setSocket } = socketSlice.actions;
// export default socketSlice.reducer;
