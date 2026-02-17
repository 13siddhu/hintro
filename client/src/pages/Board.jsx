import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useBoardStore from '../store/useBoardStore';
import io from 'socket.io-client';
import { DndContext, closestCorners, DragOverlay } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import List from '../components/List';
import Task from '../components/Task';

const socket = io('/', {
    transports: ['websocket'],
    path: '/socket.io',
});

const Board = () => {
    const { id: boardId } = useParams();
    const { board, fetchBoard, createList, onListCreate, onTaskCreate, onTaskMove } = useBoardStore();
    const [activeId, setActiveId] = useState(null);
    const [newListTitle, setNewListTitle] = useState('');

    useEffect(() => {
        fetchBoard(boardId);

        socket.emit('join-board', boardId);

        socket.on('list:create', (list) => {
            onListCreate(list);
        });

        socket.on('task:create', (task) => {
            onTaskCreate(task);
        });

        socket.on('task:move', (data) => {
            // Ideally we should refetch or update state carefully
            // For now, let's just refetch to be safe/simple, or use the store updater
            // onTaskMove(data); 
            fetchBoard(boardId); //Simplest way to sync for now
        });

        return () => {
            socket.off('list:create');
            socket.off('task:create');
            socket.off('task:move');
        };
    }, [boardId]);

    const handleCreateList = async (e) => {
        e.preventDefault();
        if (!newListTitle) return;
        await createList(boardId, newListTitle);
        setNewListTitle('');
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        // Find the container (list) of the active item
        const activeTask = board.lists.flatMap(l => l.tasks).find(t => t._id === activeId);
        if (!activeTask) return; // Should not happen

        // Find the container of the over item
        // If overId is a container (list), then we dropped on a list
        // If overId is a task, we dropped on a task, so we need its list
        let newListId = null;
        let newPosition = 0; // Simplified for now

        const overList = board.lists.find(l => l._id === overId);
        if (overList) {
            newListId = overList._id;
            // We dropped on a list, so add to end? or handle sortable index?
        } else {
            // Dropped on a task?
            const overTask = board.lists.flatMap(l => l.tasks).find(t => t._id === overId);
            if (overTask) {
                newListId = overTask.listId;
                // Calculate new position based on index of overTask
            }
        }

        if (newListId && activeTask.listId !== newListId) {
            // Optimistic update should happen in store, but for now just call API
            await onTaskMove({ taskId: activeId, newListId, oldListId: activeTask.listId });
            await useBoardStore.getState().moveTask(activeId, newListId, 0); // Call API
        } else if (newListId && activeTask.listId === newListId) {
            // Same list reordering
            // For now, we skip reordering logic to keep it simple as requested "Drag and drop tasks across lists"
            // But dnd-kit handles visual reordering via SortableContext if we update state.
        }
    };

    if (!board) return <div>Loading...</div>;

    return (
        <div className="p-8 h-screen overflow-x-auto">
            <h1 className="text-3xl font-bold mb-6">{board.title}</h1>

            <div className="flex gap-4 items-start">
                <DndContext
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-4">
                        {board.lists.map((list) => (
                            <List key={list._id} list={list} />
                        ))}
                    </div>

                    <DragOverlay>
                        {activeId ? <div className="bg-white p-4 shadow rounded">Dragging...</div> : null}
                    </DragOverlay>
                </DndContext>

                <div className="min-w-[300px] bg-gray-200 p-4 rounded-lg">
                    <form onSubmit={handleCreateList}>
                        <input
                            type="text"
                            placeholder="Add another list"
                            className="w-full p-2 rounded mb-2"
                            value={newListTitle}
                            onChange={(e) => setNewListTitle(e.target.value)}
                        />
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                            Add List
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Board;
