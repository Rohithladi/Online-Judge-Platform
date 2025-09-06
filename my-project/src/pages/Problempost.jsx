import React, { useState } from 'react';
import axios from 'axios';

export default function AdminProblemForm() {
  const [problem, setProblem] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    constraints: '',
    visibleTestCases: [{ input: '', output: '' }],
    hiddenTestCases: [{ input: '', output: '' }],
    tags: '',
    sampleInput: '',
    sampleOutput: '',
  });

  const handleChange = (e) => {
    setProblem({ ...problem, [e.target.name]: e.target.value });
  };

  const handleTestChange = (type, index, field, value) => {
    const updated = [...problem[type]];
    updated[index][field] = value;
    setProblem({ ...problem, [type]: updated });
  };

  const addTestCase = (type) => {
    setProblem({ ...problem, [type]: [...problem[type], { input: '', output: '' }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
await axios.post('http://localhost:5000/api/problems/create', problem);
      alert('Problem posted successfully!');
    } catch (err) {
      console.error(err);
      alert('Error posting problem');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Post a New Problem</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Problem Title" className="w-full border p-2" onChange={handleChange} required />
        <select name="difficulty" className="w-full border p-2" onChange={handleChange}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <textarea name="description" placeholder="Problem Description" className="w-full border p-2 h-28" onChange={handleChange} required />
        <textarea name="constraints" placeholder="Constraints" className="w-full border p-2 h-24" onChange={handleChange} />
        <textarea name="sampleInput" placeholder="Sample Input" className="w-full border p-2 h-20" onChange={handleChange} />
        <textarea name="sampleOutput" placeholder="Sample Output" className="w-full border p-2 h-20" onChange={handleChange} />
        <input name="tags" placeholder="Tags (comma-separated)" className="w-full border p-2" onChange={handleChange} />

        <div>
          <h4 className="font-medium">Visible Test Cases</h4>
          {problem.visibleTestCases.map((tc, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <textarea className="w-1/2 border p-2" placeholder="Input" value={tc.input} onChange={(e) => handleTestChange('visibleTestCases', idx, 'input', e.target.value)} />
              <textarea className="w-1/2 border p-2" placeholder="Output" value={tc.output} onChange={(e) => handleTestChange('visibleTestCases', idx, 'output', e.target.value)} />
            </div>
          ))}
          <button type="button" className="text-blue-500" onClick={() => addTestCase('visibleTestCases')}>+ Add Visible Test Case</button>
        </div>

        <div>
          <h4 className="font-medium">Hidden Test Cases</h4>
          {problem.hiddenTestCases.map((tc, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <textarea className="w-1/2 border p-2" placeholder="Input" value={tc.input} onChange={(e) => handleTestChange('hiddenTestCases', idx, 'input', e.target.value)} />
              <textarea className="w-1/2 border p-2" placeholder="Output" value={tc.output} onChange={(e) => handleTestChange('hiddenTestCases', idx, 'output', e.target.value)} />
            </div>
          ))}
          <button type="button" className="text-blue-500" onClick={() => addTestCase('hiddenTestCases')}>+ Add Hidden Test Case</button>
        </div>

        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">Post Problem</button>
      </form>
    </div>
  );
}
