import React from 'react';

const Loading = ({ color = 'blue' }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 ${
              color === 'blue' ? 'bg-blue-600' : 
              color === 'gray' ? 'bg-gray-600' :
              color === 'green' ? 'bg-green-600' :
              color === 'red' ? 'bg-red-600' :
              color === 'yellow' ? 'bg-yellow-600' :
              color === 'purple' ? 'bg-purple-600' :
              'bg-blue-600'
            } rounded-full animate-bounce`}
            style={{
              animationDelay: `${i * 0.2}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Loading;