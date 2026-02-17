const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const List = require('../models/List');

// @route   POST api/tasks
// @desc    Create a task
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title, listId, boardId } = req.body;

        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ msg: 'List not found' });
        }

        const newTask = new Task({
            title,
            listId,
            boardId,
        });

        const task = await newTask.save();

        // Add task to list
        list.tasks.push(task._id);
        await list.save();

        // Socket emit
        req.io.to(boardId).emit('task:create', task);

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/tasks/:id/move
// @desc    Move task (Drag & Drop)
// @access  Private
router.put('/:id/move', auth, async (req, res) => {
    try {
        const { newListId, position } = req.body;
        const taskId = req.params.id;

        // Logic to move task between lists or reorder in same list
        // This is a simplified version. For full robust dnd, we need handle indices carefully.
        // For now, let's just update the listId if it changed.

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        const oldListId = task.listId;

        if (oldListId.toString() !== newListId) {
            // Remove from old list
            await List.findByIdAndUpdate(oldListId, {
                $pull: { tasks: taskId }
            });

            // Add to new list
            await List.findByIdAndUpdate(newListId, {
                $push: { tasks: taskId }
            });

            task.listId = newListId;
            await task.save();
        }

        // We would also need to handle position updates here in a real app

        req.io.to(task.boardId.toString()).emit('task:move', { taskId, newListId, oldListId });

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
