# Hintro - Real-Time Collaboration, Simplified.

Welcome to **Hintro**, a powerful yet simple Kanban-style task management platform designed to keep your team in sync, in real-time.

Whether you're brainstorming a new product, tracking bugs, or managing a personal project, Hintro provides the fluid, drag-and-drop experience you need to stay organized without the clutter.

## 🚀 Why Hintro?

We built Hintro because we believe tools should get out of your way.
- **Instant Sync**: See changes as they happen. No refreshing required.
- **Intuitive Design**: A clean, modern interface that requires zero learning curve.
- **Secure**: robust authentication to keep your data safe.

## ✨ Key Features

- **🔐 Secure Authentication**: JWT-based signup and login system to protect your boards.
- **📋 Dynamic Boards & Lists**: Create as many boards and lists as your workflow demands.
- **✅ Task Management**: Add tasks, set priorities, and track progress effortlessly.
- **🖱️ Drag & Drop Interface**: powered by `@dnd-kit`, move tasks between lists or reorder them with a satisfying snap.
- **⚡ Real-Time Collaboration**: Built with **Socket.io**, every move, edit, and update is broadcast instantly to all connected users.

## 🛠️ Tech Stack

Built with a love for modern web standards and performance:

**Frontend**:
- [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
- [Tailwind CSS](https://tailwindcss.com/) for rapid styling
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [React Query](https://tanstack.com/query/latest) for data fetching
- [@dnd-kit](https://dndkit.com/) for accessible drag-and-drop

**Backend**:
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- [Socket.io](https://socket.io/) for real-time events
- [MongoDB](https://www.mongodb.com/) (with Mongoose) for flexible data storage

## 🏁 Getting Started

Follow these steps to get Hintro running locally on your machine.

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or a cloud Atlas URI)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/hintro.git
    cd hintro
    ```

2.  **Install Dependencies**
    We need to install packages for both the server and client.

    **Server:**
    ```bash
    cd server
    npm install
    # Create your .env file
    cp .env.example .env
    ```
    *Note: If you don't have a `.env.example`, creates a `.env` file with:*
    ```env
    MONGO_URI=mongodb://localhost:27017/task-collab
    JWT_SECRET=your_super_secret_key
    PORT=5000
    ```

    **Client:**
    ```bash
    cd ../client
    npm install
    ```

3.  **Run the Application**
    You can run everything with a single command from the root directory:
    ```bash
    ./start.sh
    ```
    
    *Or run them individually in separate terminals:*
    - Server: `cd server && npm start`
    - Client: `cd client && npm run dev`

4.  **Open in Browser**
    Navigate to `http://localhost:5173` and start collaborating!

## 📚 API Overview

The backend exposes a RESTful API for board management:

- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Boards**: `/api/boards` (GET, POST, GET :id)
- **Lists**: `/api/lists` (POST)
- **Tasks**: `/api/tasks` (POST, PUT move)

Real-time events like `task:move` and `list:create` are handled automatically via Socket.io.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by [Your Name]
</p>


