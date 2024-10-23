import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Feature1 from './pages/Feature1';
import Feature2 from './pages/Feature2';
import Feature3 from './pages/Feature3';
import Column1 from './pages/Column1';
import Column2 from './pages/Column2';
import Column3 from './pages/Column3';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="feature1" element={<Feature1 />}>
            <Route path="column1" element={<Column1 />} />
            <Route path="column2" element={<Column2 />} />
            <Route path="column3" element={<Column3 />} />
          </Route>
          <Route path="feature2" element={<Feature2 />} />
          <Route path="feature3" element={<Feature3 />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
