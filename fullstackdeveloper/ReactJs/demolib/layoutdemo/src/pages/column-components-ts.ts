// src/pages/Column1.tsx
import React from 'react';
import { ColumnProps } from '@/types';

const Column1: React.FC<ColumnProps> = ({
  title = 'Column 1 Content',
  content = 'This is the detailed content for Column 1. You can add any specific information or components here.',
  featuredItem = {
    title: 'Featured Item',
    description: 'Special content for Column 1 goes here.',
  },
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{content}</p>
      <div className="bg-gray-50 p-4 rounded">
        <h4 className="font-medium mb-2">{featuredItem.title}</h4>
        <p className="text-sm text-gray-500">{featuredItem.description}</p>
      </div>
    </div>
  );
};

export default Column1;

// src/pages/Column2.tsx
import React from 'react';
import { ColumnProps } from '@/types';

const Column2: React.FC<ColumnProps> = ({
  title = 'Column 2 Content',
  content = 'This is the detailed content for Column 2. You can add any specific information or components here.',
  featuredItem = {
    title: 'Featured Item',
    description: 'Special content for Column 2 goes here.',
  },
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{content}</p>
      <div className="bg-gray-50 p-4 rounded">
        <h4 className="font-medium mb-2">{featuredItem.title}</h4>
        <p className="text-sm text-gray-500">{featuredItem.description}</p>
      </div>
    </div>
  );
};

export default Column2;

// src/pages/Column3.tsx
import React from 'react';
import { ColumnProps } from '@/types';

const Column3: React.FC<ColumnProps> = ({
  title = 'Column 3 Content',
  content = 'This is the detailed content for Column 3. You can add any specific information or components here.',
  featuredItem = {
    title: 'Featured Item',
    description: 'Special content for Column 3 goes here.',
  },
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{content}</p>
      <div className="bg-gray-50 p-4 rounded">
        <h4 className="font-medium mb-2">{featuredItem.title}</h4>
        <p className="text-sm text-gray-500">{featuredItem.description}</p>
      </div>
    </div>
  );
};

export default Column3;
