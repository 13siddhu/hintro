import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Dashboard = () => {
    const [boards, setBoards] = useState([]);
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const { user, logout } = useAuthStore();

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = async () => {
        try {
            const res = await api.get('/boards');
            setBoards(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const createBoard = async (e) => {
        e.preventDefault();
        if (!newBoardTitle) return;
        try {
            const res = await api.post('/boards', { title: newBoardTitle });
            setBoards([res.data, ...boards]);
            setNewBoardTitle('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>
                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            <div className="mb-8">
                <form onSubmit={createBoard} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="New Board Title"
                        value={newBoardTitle}
                        onChange={(e) => setNewBoardTitle(e.target.value)}
                        className="border p-2 rounded flex-grow max-w-md"
                    />
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                        Create Board
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {boards.map((board) => (
                    <Link
                        key={board._id}
                        to={`/board/${board._id}`}
                        className="block bg-white p-6 rounded shadow hover:shadow-lg transition duration-200"
                    >
                        <h3 className="text-xl font-semibold mb-2">{board.title}</h3>
                        <p className="text-gray-500 text-sm">Created: {new Date(board.createdAt).toLocaleDateString()}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
