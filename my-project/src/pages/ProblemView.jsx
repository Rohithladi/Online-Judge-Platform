import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProblemView() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [userId, setUserId] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState('cpp');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/problems/${id}`);
        setProblem(res.data);
      } catch (err) {
        console.error('Error fetching problem:', err);
      }
    };
    

    const uid = localStorage.getItem('userId');
    setUserId(uid);
    fetchProblem();
  }, [id]);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    try {
      const res = await axios.post('http://localhost:5000/api/run', {
        code,
        input: problem.sampleInput,
        language,
      });

      setOutput(res.data.output || 'Executed successfully!');
    } catch (err) {
      console.error('Error running code:', err);
      setOutput('Error executing code.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setOutput('Checking against all test cases...');
    try {
      const res = await axios.post('http://localhost:5000/api/submissions', {
        code,
        language,
        problemId: id,
        userId,
      });

      const { results, passedAll } = res.data;
      const formatted = results
        .map((r, idx) => 
          `Test Case ${idx + 1}:\nInput:\n${r.input}\nExpected:\n${r.expected}\nActual:\n${r.actual}\nPassed: ${r.passed ? '✅' : '❌'}\n`
        ).join('\n----------------\n');

      setOutput(formatted);

      if (passedAll) {
        alert('🎉 All test cases passed!');
      } else {
        alert('❌ Some test cases failed.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setOutput('Error during submission.');
    }
  };

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Loading problem...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="w-1/2 bg-gray-50 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold">{problem.title}</h2>
        <p className="mt-4 text-gray-700 whitespace-pre-line">{problem.description}</p>

        {problem.constraints && (
          <div className="mt-4">
            <h3 className="font-semibold">Constraints:</h3>
            <p className="text-gray-700 whitespace-pre-line">{problem.constraints}</p>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Sample Input:</h3>
          <pre className="bg-white p-2 rounded border mt-2">{problem.sampleInput}</pre>

          <h3 className="text-lg font-semibold mt-4">Sample Output:</h3>
          <pre className="bg-white p-2 rounded border mt-2">{problem.sampleOutput}</pre>
        </div>

        {Array.isArray(problem.visibleTestCases) && problem.visibleTestCases.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Visible Test Cases:</h3>
            {problem.visibleTestCases.map((tc, i) => (
              <div key={i} className="mt-2 bg-white p-3 rounded shadow">
                <p><strong>Input:</strong> {tc.input}</p>
                <p><strong>Expected Output:</strong> {tc.output}</p>
              </div>
            ))}
          </div>
        )}

        {Array.isArray(problem.hiddenTestCases) && problem.hiddenTestCases.length > 0 && (
          <div className="mt-6 text-gray-400 text-sm italic">
            Hidden test cases will be used during actual submission and are not visible here.
          </div>
        )}
      </div>

      {/* Right Panel: Code Editor */}
      <div className="w-1/2 bg-white p-6 flex flex-col">
        {/* Language Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 border rounded bg-gray-100"
          >
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-[65vh] p-4 bg-gray-100 rounded-md font-mono resize-none"
          placeholder="Write your code here..."
        />

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-5 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Submit Code
          </button>
        </div>

        {output && (
          <div className="mt-6 bg-gray-100 p-4 rounded border whitespace-pre-wrap text-sm max-h-[300px] overflow-y-auto">
            <h4 className="font-semibold mb-2">Output:</h4>
            <pre>{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
