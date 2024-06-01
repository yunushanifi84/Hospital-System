import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import MainPage from './Pages/MainPage'
import NavBar from './Pages/NavBar'
import NotFound from './Pages/NotFound'
import Admin from './Pages/Admin'
import Patient from './Pages/Patient'
import Doctor from './Pages/Doctor'
import PrivateRoute from './PrivateRoute'
import { useEffect } from 'react'
function App() {
  useEffect(() => {
    const checkToken = async () => {
      console.log("döngü")
      if (!token) return;


    };

    // Her 5 dakikada bir token'ın süresini kontrol et
    const intervalId = setInterval(checkToken, 1 * 60 * 1000);

    // Component unmount olduğunda interval'ı temizle
    return () => clearInterval(intervalId);
  }, []);




  return (
    <center>

      <Router>
        <NavBar />
        <div>
          <Routes>
            <Route path='/' element={<MainPage />} />
            {/* <Route path='*' element={<NotFound />} /> */}
            <Route path='admin/*' element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            } />
            <Route path='patient/*' element={
              <PrivateRoute>
                <Patient />
              </PrivateRoute>
            } />
            <Route path='doctor/*' element={
              <PrivateRoute>
                <Doctor />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </center>
  )
}

export default App
