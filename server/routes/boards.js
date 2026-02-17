const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Board = require('../models/Board');

// @route   GET api/boards
// @desc    Get all boards for user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // Find boards where user is owner or member
        const boards = await Board.find({
            $or: [{ owner: req.user.id }, { members: req.user.id }],
        }).sort({ createdAt: -1 });
        res.json(boards);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/boards
// @desc    Create a board
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title } = req.body;
        const newBoard = new Board({
            title,
            owner: req.user.id,
            members: [req.user.id],
        });

        const board = await newBoard.save();
        res.json(board);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/boards/:id
// @desc    Get board by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const board = await Board.findById(req.params.id)
            .populate({
                path: 'lists',
                populate: {
                    path: 'tasks',
                    model: 'Task',
                },
            })
            .populate('members', '-password');

        if (!board) {
            return res.status(404).json({ msg: 'Board not found' });
        }

        // Check permissions
        if (board.owner.toString() !== req.user.id && !board.members.some(member => member._id.toString() === req.user.id)) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(board);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Board not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
