import {Routes, Route} from 'react-router'
import AuthPage from './views/AuthPage';
import DefaultLayout from './views/DefaultLayout';
import Home from './views/Home';
import InstructionPage from './views/InstructionPage';
import Game from './views/Game';
import Profile from './views/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import { useEffect } from 'react';

function App() {

  const { isAuthenticated, checkAuth, authChecked } = useAuth();

  const checkUserAuth = async () => {
    //console.log("Checking user authentication in App component...");
    const auth = await checkAuth();
    if (!auth) {
      console.error("User not authenticated");
    } else {
      console.log("User authenticated:", auth);
    }
  }

  useEffect(() => {
    checkUserAuth();
  }, []);

  
    return !authChecked ? <h1>Loading...</h1> : (
    <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/instructions" element={<InstructionPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path='/profile/:userId' element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile />
            </ProtectedRoute>
            }>
          </Route>
        </Route>
        <Route path='/game/:gameId' element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Game isDemo={false}/>
          </ProtectedRoute>
        } />
      <Route path='/demoGame' element={<Game isDemo={true}  />} />
      <Route path='*' element={<h1>Error 404 Not Found</h1>} />
    </Routes>)
}

export default App
