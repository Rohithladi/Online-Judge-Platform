const express = require('express');
const router = express.Router();
const Problem = require('../models/problem');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { v4: uuid } = require('uuid');

// POST /api/submit
router.post('/', async (req, res) => {
  const { code, language, problemId, userId } = req.body;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const testCases = problem.hiddenTestCases;
    const results = [];

    for (const testCase of testCases) {
      const id = uuid();
      const tempDir = path.join(__dirname, '..', 'temp', id);
      fs.mkdirSync(tempDir, { recursive: true });

      let filename, runnerScript;
      switch (language) {
        case 'cpp':
          filename = 'code.cpp';
          runnerScript = '/cpp_runner.sh';
          break;
        case 'python':
          filename = 'code.py';
          runnerScript = '/python_runner.sh';
          break;
        case 'java':
          filename = 'Code.java';
          runnerScript = '/java_runner.sh';
          break;
        default:
          return res.status(400).json({ error: 'Unsupported language' });
      }

      fs.writeFileSync(path.join(tempDir, filename), code);
      fs.writeFileSync(path.join(tempDir, 'input.txt'), testCase.input);

      const dockerCmd = `docker run --rm -m 50m -v ${tempDir}:/code -w /code code-runner ${runnerScript}`;

      let actualOutput = '';
      try {
        actualOutput = execSync(dockerCmd, { timeout: 5000 }).toString().trim();
      } catch (err) {
        actualOutput = 'Error';
      }

      results.push({
        input: testCase.input,
        expected: testCase.output.trim(),
        actual: actualOutput,
        passed: actualOutput === testCase.output.trim()
      });

      // Clean up temp files (optional)
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    const passedAll = results.every(r => r.passed);

    if (passedAll) {
      const user = await User.findById(userId);

      const alreadySolved = user.solvedProblems.some(
        entry => entry.problemId.toString() === problemId
      );

      if (!alreadySolved) {
        user.solvedProblems.push({
          problemId,
          language
        });

        await user.save();
      }
    }

    return res.json({ results, passedAll });
  } catch (err) {
    console.error('Submission error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
