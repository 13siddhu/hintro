import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Task = ({ task }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: task._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white p-3 rounded shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing"
        >
            <p className="text-sm font-medium">{task.title}</p>
            {task.priority && (
                <span className={`text-xs px-2 py-0.5 rounded mt-2 inline-block
            ${task.priority === 'High' ? 'bg-red-100 text-red-600' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-blue-100 text-blue-600'
                    }`}>
                    {task.priority}
                </span>
            )}
        </div>
    );
};

export default Task;
