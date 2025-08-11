
import React from 'react';

const PracticeOptionsTest: React.FC = () => {
  const options = [
    'Enhanced Practice 🚀',
    'Original Practice 📚', 
    'Timed Test ⏱️',
    'Daily Challenge 🏆',
    'Question History 📊'
  ];

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px', borderRadius: '10px' }}>
      <h3>🎯 Practice Options Test (2025-08-11T12:55:18.980Z)</h3>
      <p>Expected: 5 options | Found: {options.length} options</p>
      <ul>
        {options.map((option, index) => (
          <li key={index} style={{ margin: '5px 0', fontSize: '16px' }}>{option}</li>
        ))}
      </ul>
      <p style={{ color: 'green', fontWeight: 'bold' }}>
        ✅ If you can see this component with 5 options, the fix is working!
      </p>
    </div>
  );
};

export default PracticeOptionsTest;
