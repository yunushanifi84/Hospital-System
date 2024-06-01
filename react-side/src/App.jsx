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
import axiosInstance from './axiosInstance'
function App() {
  useEffect(() => {
    const checkToken = async () => {
      console.log("döngü")
      const token = localStorage.getItem('token');
      if (!token) return;

      axiosInstance.get('/checkToken').then(res => {
        console.log(res);
        return;
      }).catch(err => {
        console.log(err);
        localStorage.removeItem('token');
      })

      // try {
      //   const response = await axios.get('/checkToken', {
      //     headers: { Authorization: `Bearer ${token}` }
      //   });
      //   console.log(response)

      //   if (response.status !== 200) {
      //     localStorage.removeItem('token');
      //   }
      // } catch (error) {
      //   if (error.response && error.response.status === 403) {
      //     localStorage.removeItem('token');
      //   }
      // }
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
