Certainly. I'll guide you through creating a new Next.js app with TypeScript and then incorporating our sortable table component. We'll use `npx` to create the initial app structure.

First, let's create a new Next.js app:

```bash
npx create-next-app@latest my-design-system --typescript
```

During the setup, you'll be prompted with several questions. Here are the recommended answers:

- Would you like to use ESLint? Yes
- Would you like to use Tailwind CSS? Yes
- Would you like to use `src/` directory? Yes
- Would you like to use App Router? No (we'll use Pages Router for simplicity)
- Would you like to customize the default import alias? No

After the installation is complete, navigate to your project directory:

```bash
cd my-design-system
```

Now, let's add the necessary dependencies for our sortable table component:

```bash
npm install lucide-react @radix-ui/react-slot class-variance-authority clsx tailwind-merge
```

Next, let's set up the shadcn/ui components we'll need. Run the following commands:

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add table
npx shadcn-ui@latest add button
```

Now that we have our project set up, let's create our sortable table component. 



```tsx
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

type Data = {
  id: number;
  name: string;
  age: number;
  email: string;
};

type SortableTableProps = {
  data: Data[];
};

type SortConfig = {
  key: keyof Data;
  direction: 'ascending' | 'descending';
};

const SortableTable: React.FC<SortableTableProps> = ({ data }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'ascending' });

  const sortedData = React.useMemo(() => {
    const sortableData = [...data];
    sortableData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortableData;
  }, [data, sortConfig]);

  const requestSort = (key: keyof Data) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button variant="ghost" onClick={() => requestSort('id')}>
              ID {sortConfig.key === 'id' && (sortConfig.direction === 'ascending' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />)}
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => requestSort('name')}>
              Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />)}
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => requestSort('age')}>
              Age {sortConfig.key === 'age' && (sortConfig.direction === 'ascending' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />)}
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => requestSort('email')}>
              Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />)}
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.age}</TableCell>
            <TableCell>{item.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SortableTable;

```

Save this file as `src/components/SortableTable.tsx`.

Now, let's update the `src/pages/index.tsx` file to use our new component:

```tsx
import SortableTable from '../components/SortableTable';

const Home = () => {
  const data = [
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com' },
    { id: 4, name: 'Alice Brown', age: 28, email: 'alice@example.com' },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sortable Table Example</h1>
      <SortableTable data={data} />
    </div>
  );
};

export default Home;
```

This sets up a basic Next.js application with a sortable table component. You can run your application using:

```bash
npm run dev
```

This will start your development server, typically at `http://localhost:3000`.

To expand this into a full design system, you would:

1. Create more reusable components in the `src/components` directory.
2. Establish consistent theming and styling using Tailwind CSS.
3. Create a storybook to showcase and document your components.
4. Implement a consistent way to handle props and component variants.

Certainly! I'll restructure the design system into separate files, following the Atomic Design methodology. This approach will make our system more organized and easier to maintain.



```typescript
// File: src/components/atoms/Button.tsx
import { Button as ShadcnButton } from "@/components/ui/button"

export const Button = ShadcnButton;

// File: src/components/atoms/TableCell.tsx
import { TableCell as ShadcnTableCell } from "@/components/ui/table"

export const TableCell = ShadcnTableCell;

// File: src/components/molecules/ButtonGroup.tsx
import React from 'react';
import { Button } from '../atoms/Button';

type ButtonGroupProps = {
  buttons: Array<{
    label: string;
    onClick: () => void;
  }>;
};

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ buttons }) => (
  <div className="flex space-x-2">
    {buttons.map((button, index) => (
      <Button key={index} onClick={button.onClick}>
        {button.label}
      </Button>
    ))}
  </div>
);

// File: src/components/organisms/SortableTable.tsx
import React, { useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '../atoms/Button';
import { TableCell } from '../atoms/TableCell';
import { ChevronUp, ChevronDown } from "lucide-react";

type Data = {
  id: number;
  name: string;
  age: number;
  email: string;
};

type SortableTableProps = {
  data: Data[];
};

type SortConfig = {
  key: keyof Data;
  direction: 'ascending' | 'descending';
};

export const SortableTable: React.FC<SortableTableProps> = ({ data }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'ascending' });

  const sortedData = React.useMemo(() => {
    const sortableData = [...data];
    sortableData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortableData;
  }, [data, sortConfig]);

  const requestSort = (key: keyof Data) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button variant="ghost" onClick={() => requestSort('id')}>
              ID {sortConfig.key === 'id' && (sortConfig.direction === 'ascending' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />)}
            </Button>
          </TableHead>
          {/* Repeat for other columns */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.age}</TableCell>
            <TableCell>{item.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// File: src/components/templates/DashboardLayout.tsx
import React from 'react';

type DashboardLayoutProps = {
  sidebar: React.ReactNode;
  main: React.ReactNode;
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ sidebar, main }) => (
  <div className="flex min-h-screen">
    <aside className="w-64 bg-gray-100 p-4">{sidebar}</aside>
    <main className="flex-1 p-4">{main}</main>
  </div>
);

// File: src/pages/index.tsx
import { ButtonGroup } from '@/components/molecules/ButtonGroup';
import { SortableTable } from '@/components/organisms/SortableTable';
import { DashboardLayout } from '@/components/templates/DashboardLayout';

const Home = () => {
  const tableData = [
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
    // Add more data...
  ];

  const sidebarContent = (
    <ButtonGroup
      buttons={[
        { label: 'Dashboard', onClick: () => console.log('Dashboard clicked') },
        { label: 'Settings', onClick: () => console.log('Settings clicked') },
      ]}
    />
  );

  const mainContent = (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <SortableTable data={tableData} />
    </div>
  );

  return (
    <DashboardLayout
      sidebar={sidebarContent}
      main={mainContent}
    />
  );
};

export default Home;

```

Now that we've separated our components into individual files, here's a summary of the file structure:

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button.tsx
│   │   └── TableCell.tsx
│   ├── molecules/
│   │   └── ButtonGroup.tsx
│   ├── organisms/
│   │   └── SortableTable.tsx
│   └── templates/
│       └── DashboardLayout.tsx
└── pages/
    └── index.tsx
```

This structure follows the Atomic Design methodology:

1. Atoms (`src/components/atoms/`): These are the basic building blocks of our design system. They're simple and reusable.

2. Molecules (`src/components/molecules/`): These are groups of atoms bonded together, forming slightly more complex components.

3. Organisms (`src/components/organisms/`): These are groups of molecules (and possibly atoms) joined together to form relatively complex, distinct sections of an interface.

4. Templates (`src/components/templates/`): These are page-level objects that place components into a layout and articulate the design's underlying content structure.

5. Pages (`src/pages/`): These are specific instances of templates that show what a UI looks like with real representative content in place.

This structure allows for better organization and scalability of your design system. You can easily add more components at each level and compose them to create more complex interfaces.

To expand this system further, you could:

1. Add more atomic components like Input, Label, Icon, etc.
2. Create more molecules like Form fields (combining Label, Input, and error message).
3. Develop more organisms like a Navigation menu or a Card component.
4. Implement more templates for different types of pages.
5. Create a theme file (e.g., `src/styles/theme.ts`) to manage your design tokens and ensure consistency across components.
6. Set up a Storybook to document and showcase your components.
