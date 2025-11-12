import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import KanbanColumn from '@/Components/KanbanColumn';
import { Head, Link } from '@inertiajs/react';

export default function UserDashboard({ viewedUser, tasks, availableTags }) {
    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Tasks: {viewedUser.full_name || viewedUser.name}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">{viewedUser.email}</p>
                    </div>
                    <Link
                        href={route('admin.users')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                    >
                        ← Back to Users
                    </Link>
                </div>
            }
        >
            <Head title={`Tasks: ${viewedUser.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    You are viewing <strong>{viewedUser.name}'s</strong> tasks as an administrator. 
                                    This is a read-only view.
                                </p>
                            </div>
                        </div>
                    </div>

                    {tasks.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                This user hasn't created any tasks yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <KanbanColumn
                                title="To Do"
                                status="to_do"
                                tasks={getTasksByStatus('to_do')}
                                onTaskEdit={() => {}}
                                onDrop={() => {}}
                                onDragOver={() => {}}
                                onDragStart={() => {}}
                                onDragEnd={() => {}}
                                color="blue"
                            />
                            
                            <KanbanColumn
                                title="In Progress"
                                status="in_progress"
                                tasks={getTasksByStatus('in_progress')}
                                onTaskEdit={() => {}}
                                onDrop={() => {}}
                                onDragOver={() => {}}
                                onDragStart={() => {}}
                                onDragEnd={() => {}}
                                color="yellow"
                            />
                            
                            <KanbanColumn
                                title="Done"
                                status="done"
                                tasks={getTasksByStatus('done')}
                                onTaskEdit={() => {}}
                                onDrop={() => {}}
                                onDragOver={() => {}}
                                onDragStart={() => {}}
                                onDragEnd={() => {}}
                                color="green"
                            />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


