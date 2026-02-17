import { create } from 'zustand';
import api from '../api/axios';

const useBoardStore = create((set, get) => ({
    board: null,
    loading: false,
    error: null,

    fetchBoard: async (boardId) => {
        set({ loading: true });
        try {
            const res = await api.get(`/boards/${boardId}`);
            set({ board: res.data, loading: false });
        } catch (err) {
            set({ error: err.response?.data?.msg || 'Error fetching board', loading: false });
        }
    },

    createList: async (boardId, title) => {
        try {
            const res = await api.post('/lists', { boardId, title });
            // Optimistic update handled by socket or verify here
            // But we can add it directly to state too
            const board = get().board;
            if (board) {
                // This might fail if lists is not populated properly yet but we ensure populated in endpoints
                // But for now, we rely on fetch or socket event
            }
        } catch (err) {
            console.error(err);
        }
    },

    createTask: async (boardId, listId, title) => {
        try {
            await api.post('/tasks', { boardId, listId, title });
        } catch (err) {
            console.error(err);
        }
    },

    moveTask: async (taskId, newListId, position) => {
        // Optimistic UI update could go here
        try {
            await api.put(`/tasks/${taskId}/move`, { newListId, position });
        } catch (err) {
            console.error(err);
        }
    },

    // Socket event handlers
    onListCreate: (newList) => {
        const board = get().board;
        if (board && board._id === newList.boardId) {
            set({ board: { ...board, lists: [...board.lists, { ...newList, tasks: [] }] } });
        }
    },

    onTaskCreate: (newTask) => {
        const board = get().board;
        if (board && board._id === newTask.boardId) {
            const newLists = board.lists.map(list => {
                if (list._id === newTask.listId) {
                    return { ...list, tasks: [...list.tasks, newTask] };
                }
                return list;
            });
            set({ board: { ...board, lists: newLists } });
        }
    },

    onTaskMove: ({ taskId, newListId, oldListId }) => {
        const board = get().board;
        if (!board) return;

        // Find the task in old list
        let task;
        const newLists = board.lists.map(list => {
            if (list._id === oldListId) {
                task = list.tasks.find(t => t._id === taskId);
                return { ...list, tasks: list.tasks.filter(t => t._id !== taskId) };
            }
            return list;
        });

        if (task) {
            // Add to new list
            const updatedLists = newLists.map(list => {
                if (list._id === newListId) {
                    return { ...list, tasks: [...list.tasks, { ...task, listId: newListId }] };
                }
                return list;
            });
            set({ board: { ...board, lists: updatedLists } });
        }
    }
}));

export default useBoardStore;
