// src/pages/Feature2.tsx
import React from 'react';
import { FeatureProps } from '@/types';

const Feature2: React.FC<FeatureProps> = ({ title = 'Feature 2' }) => {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">This is the content for Feature 2. Add your specific content here.</p>
        </div>
      </div>
    </div>
  );
};

export default Feature2;

// src/pages/Feature3.tsx
import React from 'react';
import { FeatureProps } from '@/types';

const Feature3: React.FC<FeatureProps> = ({ title = 'Feature 3' }) => {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">This is the content for Feature 3. Add your specific content here.</p>
        </div>
      </div>
    </div>
  );
};

export default Feature3;
