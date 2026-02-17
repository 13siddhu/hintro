const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const List = require('../models/List');
const Board = require('../models/Board');

// @route   POST api/lists
// @desc    Create a list
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title, boardId } = req.body;

        // Check board ownership/membership
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ msg: 'Board not found' });
        }

        // Create List
        const newList = new List({
            title,
            boardId,
        });

        const list = await newList.save();

        // Add list to board
        board.lists.push(list._id);
        await board.save();

        // Socket.io emit
        req.io.to(boardId).emit('list:create', list);

        res.json(list);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
