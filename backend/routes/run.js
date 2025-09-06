const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { v4: uuid } = require('uuid');

router.post('/', async (req, res) => {
  const { code, input, language } = req.body;
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
  fs.writeFileSync(path.join(tempDir, 'input.txt'), input);

  const dockerCmd = `
    docker run --rm -m 50m -v ${tempDir}:/code -w /code code-runner ${runnerScript}
  `;

  exec(dockerCmd, { timeout: 5000 }, (err, stdout, stderr) => {
    if (err) {
      return res.json({ output: 'Error or Timeout' });
    }
    return res.json({ output: stdout || stderr });
  });
});

module.exports = router;
