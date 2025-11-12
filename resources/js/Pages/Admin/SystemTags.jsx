import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TagBadge from '@/Components/TagBadge';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';

export default function SystemTags({ systemTags }) {
    const [tags, setTags] = useState(systemTags);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newTag, setNewTag] = useState({ name: '', color: '#3B82F6' });
    const [editingTag, setEditingTag] = useState(null);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(route('admin.tags.system.store'), newTag);
            setTags([...tags, response.data]);
            setNewTag({ name: '', color: '#3B82F6' });
            setShowCreateForm(false);
        } catch (error) {
            console.error('Error creating tag:', error);
        }
    };

    const handleUpdate = async (tag) => {
        try {
            const response = await axios.patch(route('admin.tags.system.update', tag.id), {
                name: tag.name,
                color: tag.color,
            });
            setTags(tags.map(t => t.id === tag.id ? response.data : t));
            setEditingTag(null);
        } catch (error) {
            console.error('Error updating tag:', error);
        }
    };

    const handleDelete = async (tagId) => {
        if (!confirm('Are you sure you want to delete this system tag? This will remove it from all tasks.')) {
            return;
        }

        try {
            await axios.delete(route('admin.tags.system.destroy', tagId));
            setTags(tags.filter(t => t.id !== tagId));
        } catch (error) {
            console.error('Error deleting tag:', error);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        System Tags
                    </h2>
                    <Link
                        href={route('admin.dashboard')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                    >
                        ← Back to Admin Dashboard
                    </Link>
                </div>
            }
        >
            <Head title="System Tags" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Manage System Tags</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    System tags are available to all users
                                </p>
                            </div>
                            <button
                                onClick={() => setShowCreateForm(!showCreateForm)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                {showCreateForm ? 'Cancel' : 'Create Tag'}
                            </button>
                        </div>

                        {showCreateForm && (
                            <form onSubmit={handleCreate} className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex space-x-3">
                                    <input
                                        type="text"
                                        placeholder="Tag name"
                                        value={newTag.name}
                                        onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    <input
                                        type="color"
                                        value={newTag.color}
                                        onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                                        className="w-20 h-10 border-gray-300 rounded-md cursor-pointer"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="space-y-3">
                            {tags.map((tag) => (
                                <div key={tag.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    {editingTag?.id === tag.id ? (
                                        <div className="flex-1 flex items-center space-x-3">
                                            <input
                                                type="text"
                                                value={editingTag.name}
                                                onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                                                className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="color"
                                                value={editingTag.color}
                                                onChange={(e) => setEditingTag({ ...editingTag, color: e.target.value })}
                                                className="w-16 h-9 border-gray-300 rounded-md cursor-pointer"
                                            />
                                            <button
                                                onClick={() => handleUpdate(editingTag)}
                                                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingTag(null)}
                                                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center space-x-3">
                                                <TagBadge tag={tag} />
                                                <span className="text-sm text-gray-500">
                                                    {tag.color}
                                                </span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setEditingTag(tag)}
                                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tag.id)}
                                                    className="text-red-600 hover:text-red-700 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}

                            {tags.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <p>No system tags yet. Create one to get started.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


