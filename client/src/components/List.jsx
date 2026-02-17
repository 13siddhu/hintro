import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Task from './Task';
import { useState } from 'react';
import useBoardStore from '../store/useBoardStore';

const List = ({ list }) => {
    const { setNodeRef } = useDroppable({
        id: list._id,
    });

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const createTask = useBoardStore(state => state.createTask);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle) return;
        await createTask(list.boardId, list._id, newTaskTitle);
        setNewTaskTitle('');
    };

    return (
        <div ref={setNodeRef} className="bg-gray-100 p-4 rounded-lg min-w-[300px] shadow-sm">
            <h3 className="font-bold mb-4 text-gray-700">{list.title}</h3>

            <SortableContext
                id={list._id}
                items={list.tasks.map(t => t._id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-3 mb-4 min-h-[50px]">
                    {list.tasks.map((task) => (
                        <Task key={task._id} task={task} />
                    ))}
                </div>
            </SortableContext>

            <form onSubmit={handleCreateTask}>
                <input
                    type="text"
                    placeholder="Add a task"
                    className="w-full p-2 rounded text-sm mb-2"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <button type="submit" className="text-gray-500 hover:text-gray-700 text-sm">
                    + Add Card
                </button>
            </form>
        </div>
    );
};

export default List;
