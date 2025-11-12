import TaskCard from './TaskCard';

export default function KanbanColumn({ 
    title, 
    status, 
    tasks, 
    onTaskEdit, 
    onDrop,
    onDragOver,
    onDragStart,
    onDragEnd,
    color = 'blue'
}) {
    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200',
        yellow: 'bg-yellow-50 border-yellow-200',
        green: 'bg-green-50 border-green-200',
    };

    const headerColorClasses = {
        blue: 'text-blue-700 bg-blue-100',
        yellow: 'text-yellow-700 bg-yellow-100',
        green: 'text-green-700 bg-green-100',
    };

    return (
        <div className="flex flex-col h-full">
            <div className={`${headerColorClasses[color]} px-4 py-3 rounded-t-lg`}>
                <h2 className="font-semibold flex items-center justify-between">
                    <span>{title}</span>
                    <span className="text-sm font-normal ml-2">({tasks.length})</span>
                </h2>
            </div>
            
            <div
                onDrop={(e) => onDrop(e, status)}
                onDragOver={onDragOver}
                className={`flex-1 ${colorClasses[color]} border-2 border-dashed rounded-b-lg p-4 space-y-3 min-h-[200px]`}
            >
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={onTaskEdit}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                    />
                ))}
                
                {tasks.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                        Drop tasks here
                    </div>
                )}
            </div>
        </div>
    );
}


