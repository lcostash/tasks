import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import TagBadge from '@/Components/TagBadge';
import axios from 'axios';

export default function TaskModal({ show, task = null, onClose, onSave, onDelete }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: '',
        status: 'to_do',
        tag_ids: [],
    });
    const [errors, setErrors] = useState({});
    const [availableTags, setAvailableTags] = useState([]);
    const [showTagSelector, setShowTagSelector] = useState(false);
    const [newTag, setNewTag] = useState({ name: '', color: '#3B82F6' });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (show) {
            fetchTags();
            if (task) {
                setFormData({
                    title: task.title || '',
                    description: task.description || '',
                    due_date: task.due_date || '',
                    status: task.status || 'to_do',
                    tag_ids: task.tags ? task.tags.map(t => t.id) : [],
                });
            } else {
                setFormData({
                    title: '',
                    description: '',
                    due_date: '',
                    status: 'to_do',
                    tag_ids: [],
                });
            }
            setErrors({});
        }
    }, [show, task]);

    const fetchTags = async () => {
        try {
            const response = await axios.get(route('tags.index'));
            setAvailableTags(response.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            let response;
            if (task) {
                response = await axios.patch(route('tasks.update', task.id), formData);
            } else {
                response = await axios.post(route('tasks.store'), formData);
            }
            onSave(response.data);
            onClose();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        setProcessing(true);
        try {
            await axios.delete(route('tasks.destroy', task.id));
            onDelete(task.id);
            onClose();
        } catch (error) {
            console.error('Error deleting task:', error);
        } finally {
            setProcessing(false);
        }
    };

    const handleTagToggle = (tagId) => {
        setFormData(prev => ({
            ...prev,
            tag_ids: prev.tag_ids.includes(tagId)
                ? prev.tag_ids.filter(id => id !== tagId)
                : [...prev.tag_ids, tagId]
        }));
    };

    const handleCreateTag = async () => {
        if (!newTag.name.trim()) return;

        try {
            const response = await axios.post(route('tags.store'), newTag);
            setAvailableTags([...availableTags, response.data]);
            setFormData(prev => ({
                ...prev,
                tag_ids: [...prev.tag_ids, response.data.id]
            }));
            setNewTag({ name: '', color: '#3B82F6' });
            setShowTagSelector(false);
        } catch (error) {
            console.error('Error creating tag:', error);
        }
    };

    const selectedTags = availableTags.filter(tag => formData.tag_ids.includes(tag.id));

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {task ? 'Edit Task' : 'Create New Task'}
                </h2>

                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <InputLabel htmlFor="title" value="Title" />
                        <TextInput
                            id="title"
                            type="text"
                            className="mt-1 block w-full"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            isFocused
                        />
                        <InputError message={errors.title?.[0]} className="mt-2" />
                    </div>

                    {/* Description */}
                    <div>
                        <InputLabel htmlFor="description" value="Description" />
                        <textarea
                            id="description"
                            className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                            rows="3"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <InputError message={errors.description?.[0]} className="mt-2" />
                    </div>

                    {/* Status */}
                    <div>
                        <InputLabel htmlFor="status" value="Status" />
                        <select
                            id="status"
                            className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="to_do">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                        <InputError message={errors.status?.[0]} className="mt-2" />
                    </div>

                    {/* Due Date */}
                    <div>
                        <InputLabel htmlFor="due_date" value="Due Date" />
                        <TextInput
                            id="due_date"
                            type="date"
                            className="mt-1 block w-full"
                            value={formData.due_date}
                            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                        />
                        <InputError message={errors.due_date?.[0]} className="mt-2" />
                    </div>

                    {/* Tags */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <InputLabel value="Tags" />
                            <button
                                type="button"
                                onClick={() => setShowTagSelector(!showTagSelector)}
                                className="text-sm text-blue-600 hover:text-blue-700"
                            >
                                {showTagSelector ? 'Hide Tags' : 'Select Tags'}
                            </button>
                        </div>

                        {selectedTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {selectedTags.map(tag => (
                                    <TagBadge
                                        key={tag.id}
                                        tag={tag}
                                        onRemove={() => handleTagToggle(tag.id)}
                                    />
                                ))}
                            </div>
                        )}

                        {showTagSelector && (
                            <div className="border border-gray-300 rounded-md p-3 mt-2">
                                <div className="max-h-48 overflow-y-auto space-y-2 mb-3">
                                    {availableTags.map(tag => (
                                        <label
                                            key={tag.id}
                                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.tag_ids.includes(tag.id)}
                                                onChange={() => handleTagToggle(tag.id)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <TagBadge tag={tag} />
                                            {tag.is_system && (
                                                <span className="text-xs text-gray-500">(System)</span>
                                            )}
                                        </label>
                                    ))}
                                </div>

                                {/* Create New Tag */}
                                <div className="border-t pt-3">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Create New Tag</p>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Tag name"
                                            value={newTag.name}
                                            onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                                            className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm text-sm"
                                        />
                                        <input
                                            type="color"
                                            value={newTag.color}
                                            onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                                            className="w-12 h-9 border-gray-300 rounded-md cursor-pointer"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleCreateTag}
                                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-between">
                    <div>
                        {task && (
                            <DangerButton type="button" onClick={handleDelete} disabled={processing}>
                                Delete
                            </DangerButton>
                        )}
                    </div>
                    <div className="flex space-x-3">
                        <SecondaryButton type="button" onClick={onClose}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? 'Saving...' : (task ? 'Update' : 'Create')}
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </Modal>
    );
}


