import { NavLink, Route, Routes } from 'react-router-dom';
import {
  Analytics,
  CreateTest,
  Home,
  QuestionBank,
  QuestionEditor,
  Results,
  Settings,
  TestRunner,
} from './pages';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/create-test', label: 'Create Test' },
  { to: '/test-runner', label: 'Test Runner' },
  { to: '/results', label: 'Results' },
  { to: '/question-bank', label: 'Question Bank' },
  { to: '/question-editor', label: 'Question Editor' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/settings', label: 'Settings' },
];

const App = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4">
          <span className="text-xl font-bold text-teal-300">Cybersec Quiz</span>
          <ul className="flex flex-wrap items-center gap-3 text-sm">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-1 transition ${
                      isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-test" element={<CreateTest />} />
          <Route path="/test-runner" element={<TestRunner />} />
          <Route path="/results" element={<Results />} />
          <Route path="/question-bank" element={<QuestionBank />} />
          <Route path="/question-editor" element={<QuestionEditor />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
