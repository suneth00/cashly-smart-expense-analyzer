const fs = require('fs');
const path = require('path');

const components = ['Navbar', 'Sidebar', 'ProtectedRoute', 'StatCard', 'ExpenseForm', 'ExpenseTable', 'ChartCard'];
const pages = ['Login', 'Register', 'Dashboard', 'AddExpense', 'Expenses', 'Analytics', 'ReceiptScanner', 'Profile'];

components.forEach(x => {
  fs.writeFileSync(path.join('src', 'components', x + '.jsx'), `import React from 'react';\n\nconst ${x} = () => {\n  return <div>${x} Component</div>;\n};\n\nexport default ${x};\n`);
});

pages.forEach(x => {
  fs.writeFileSync(path.join('src', 'pages', x + '.jsx'), `import React from 'react';\n\nconst ${x} = () => {\n  return <div>${x} Page</div>;\n};\n\nexport default ${x};\n`);
});

fs.writeFileSync(path.join('src', 'api', 'axios.js'), `import axios from 'axios';\n\nconst instance = axios.create({\n  baseURL: 'http://localhost:5000/api',\n});\n\nexport default instance;\n`);

fs.writeFileSync(path.join('src', 'context', 'AuthContext.jsx'), `import React, { createContext } from 'react';\n\nexport const AuthContext = createContext();\n\nexport const AuthProvider = ({ children }) => {\n  return (\n    <AuthContext.Provider value={{}}>\n      {children}\n    </AuthContext.Provider>\n  );\n};\n`);
