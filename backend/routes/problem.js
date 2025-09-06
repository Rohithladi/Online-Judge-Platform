const express = require('express');
const router = express.Router();
const Problem = require('../models/problem');

// POST: Create a problem
router.post('/create', async (req, res) => {
  try {
    const {
      title, description, difficulty, constraints,
      tags, visibleTestCases, hiddenTestCases, sampleInput, sampleOutput,
    } = req.body;

    const newProblem = new Problem({
      title,
      description,
      difficulty,
      constraints,
      tags: tags?.split(',').map(t => t.trim()),
      visibleTestCases,
      hiddenTestCases,
      sampleInput,
      sampleOutput,
    });

    await newProblem.save();
    res.status(201).json({ message: 'Problem created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch problems' });
  }
});

// 🔍 Get a single problem by ID
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✏️ Update problem by ID
router.put('/edit/:id', async (req, res) => {
  try {
    const updatedProblem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProblem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.status(200).json({ message: 'Problem updated successfully', updatedProblem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update problem' });
  }
});

// ❌ Delete a problem by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedProblem = await Problem.findByIdAndDelete(req.params.id);
    if (!deletedProblem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete problem' });
  }
});

module.exports = router;