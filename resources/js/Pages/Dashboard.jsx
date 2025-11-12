import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import KanbanColumn from '@/Components/KanbanColumn';
import TaskModal from '@/Components/TaskModal';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [showCompleted, setShowCompleted] = useState(true);
    const [loading, setLoading] = useState(true);
    const [draggedTask, setDraggedTask] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, [showCompleted]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(route('tasks.index'), {
                params: { show_completed: showCompleted }
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
        setDraggedTask(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        
        if (!draggedTask || draggedTask.status === newStatus) {
            return;
        }

        try {
            // Optimistically update UI
            setTasks(tasks.map(task => 
                task.id === draggedTask.id 
                    ? { ...task, status: newStatus }
                    : task
            ));

            // Update on server
            await axios.patch(route('tasks.update-status', draggedTask.id), {
                status: newStatus
            });
        } catch (error) {
            console.error('Error updating task status:', error);
            // Revert on error
            fetchTasks();
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowTaskModal(true);
    };

    const handleAddTask = () => {
        setEditingTask(null);
        setShowTaskModal(true);
    };

    const handleTaskSave = (savedTask) => {
        if (editingTask) {
            // Update existing task
            setTasks(tasks.map(task => 
                task.id === savedTask.id ? savedTask : task
            ));
        } else {
            // Add new task
            setTasks([savedTask, ...tasks]);
        }
    };

    const handleTaskDelete = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        My Tasks
                    </h2>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={showCompleted}
                                onChange={(e) => setShowCompleted(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                            />
                            <span>Show completed</span>
                        </label>
                        <button
                            onClick={handleAddTask}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Task
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-gray-500">Loading tasks...</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <KanbanColumn
                                title="To Do"
                                status="to_do"
                                tasks={getTasksByStatus('to_do')}
                                onTaskEdit={handleEditTask}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                color="blue"
                            />
                            
                            <KanbanColumn
                                title="In Progress"
                                status="in_progress"
                                tasks={getTasksByStatus('in_progress')}
                                onTaskEdit={handleEditTask}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                color="yellow"
                            />
                            
                            <KanbanColumn
                                title="Done"
                                status="done"
                                tasks={getTasksByStatus('done')}
                                onTaskEdit={handleEditTask}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                color="green"
                            />
                        </div>
                    )}
                </div>
            </div>

            <TaskModal
                show={showTaskModal}
                task={editingTask}
                onClose={() => setShowTaskModal(false)}
                onSave={handleTaskSave}
                onDelete={handleTaskDelete}
            />
        </AuthenticatedLayout>
    );
}
