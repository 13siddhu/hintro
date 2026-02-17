#!/bin/bash
# Start backend
cd server
npm start &
SERVER_PID=$!

# Start frontend
cd ../client
npm run dev &
CLIENT_PID=$!

# Handle shutdown
trap "kill $SERVER_PID $CLIENT_PID; exit" SIGINT

wait
