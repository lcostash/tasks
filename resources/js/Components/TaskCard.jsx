import { useMemo } from 'react';
import TagBadge from './TagBadge';

export default function TaskCard({ task, onEdit, onDragStart, onDragEnd }) {
    const formattedDueDate = useMemo(() => {
        if (!task.due_date) return null;
        const date = new Date(task.due_date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }, [task.due_date]);

    const isOverdue = useMemo(() => {
        if (!task.due_date || task.status === 'done') return false;
        return new Date(task.due_date) < new Date();
    }, [task.due_date, task.status]);

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, task)}
            onDragEnd={onDragEnd}
            onClick={() => onEdit(task)}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-move"
        >
            <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
            
            {task.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {task.description}
                </p>
            )}

            {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {task.tags.map((tag) => (
                        <TagBadge key={tag.id} tag={tag} />
                    ))}
                </div>
            )}

            {task.due_date && (
                <div className="flex items-center text-xs mt-2">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}>
                        {formattedDueDate}
                    </span>
                    {isOverdue && (
                        <span className="ml-1 text-red-600">(Overdue)</span>
                    )}
                </div>
            )}
        </div>
    );
}


