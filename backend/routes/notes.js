const express = require('express');
const Note = require('../models/Note');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all notes for user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id }).sort({ updatedAt: -1 });
        res.json(notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create note
router.post('/', authMiddleware, async (req, res) => {
    const { title, body } = req.body;

    try {
        const newNote = new Note({
            title,
            body,
            userId: req.user.id
        });

        const note = await newNote.save();
        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update note
router.put('/:id', authMiddleware, async (req, res) => {
    const { title, body } = req.body;

    try {
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ msg: 'Note not found' });
        }

        // Make sure user owns note
        if (note.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        note.title = title !== undefined ? title : note.title;
        note.body = body !== undefined ? body : note.body;

        note = await note.save();
        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete note
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ msg: 'Note not found' });
        }

        // Make sure user owns note
        if (note.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await note.deleteOne();
        res.json({ msg: 'Note removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
