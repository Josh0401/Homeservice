import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { AuthProvider } from './context/AuthContext'
import { NotificationsProvider } from './context/NotificationsContext'
import { LanguageProvider } from './context/LanguageContext' // Import the LanguageProvider

// Import API service
import { fetchProfessionals, transformProfessionalsData } from './utils/apiService'

// Import components
import Footer from './Components/FooterDiv/Footer'
import Jobs from './Components/JobDiv/Jobs' // Removed Data import
import Categories from './Components/JobDiv/Categories'
import Contact from './Components/JobDiv/Contact'
import Register from './Components/JobDiv/Register'
import Login from './Components/JobDiv/Login'
import FAQ from './Components/JobDiv/FAQ'
import About from './Components/JobDiv/About'
import NavBar from './Components/NavBar/NavBar'
import Search from './Components/SearchDiv/Search'
import Value from './Components/ValueDiv/Value'
import UserProfile from './Components/JobDiv/UserProfile'
import BookingHistory from './Components/JobDiv/BookingHistory'
import Dashboard from './Components/JobDiv/Dashboard'
import ProtectedRoute from './Components/ProtectedRoute'
import ForgotPassword from './Components/JobDiv/ForgotPassword'
import NotificationsPage from './Components/JobDiv/NotificationsPage'

// Import provider routes components
import ProviderDetails from './Components/JobDiv/ProviderDetails'
import BookingPage from './Components/JobDiv/BookingPage'
import BookingSuccess from './Components/JobDiv/BookingSuccess'
import ProviderRegistration from './Components/JobDiv/Service/ProviderRegistrationPage'
import ProviderDashboard from './Components/JobDiv/Service/ProviderDashboard'
import ProviderProfileManagement from './Components/JobDiv/Service/ProviderProfileManagement'

// Import new provider pages
import NotificationPage from './Components/JobDiv/Service/NotificationPage'
import SettingsPage from './Components/JobDiv/Service/SettingsPage'
import EarningsPage from './Components/JobDiv/Service/EarningsPage'
import AvailabilityPage from './Components/JobDiv/Service/AvailabilityPage'
import BookingDetailsPage from './Components/JobDiv/Service/BookingDetailsPage'

// Import Admin components
import AdminProfile from './Components/JobDiv/Admin/AdminProfile'
import AdminNotifications from './Components/JobDiv/Admin/AdminNotifications'
import AdminDashboard from './Components/JobDiv/Admin/AdminDashboard'
import AdminUsers from './Components/JobDiv/Admin/AdminUsers'
import AdminPayments from './Components/JobDiv/Admin/AdminPayments'
import AdminReports from './Components/JobDiv/Admin/AdminReports'
import SystemSettings from './Components/JobDiv/Admin/SystemSettings'

const App = () => {
  // State for professionals data and filtered jobs
  const [professionalsData, setProfessionalsData] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load professionals data on app start
  useEffect(() => {
    const loadProfessionalsData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const apiData = await fetchProfessionals()
        const transformedData = transformProfessionalsData(apiData)
        
        setProfessionalsData(transformedData)
        setFilteredJobs(transformedData) // Initially show all data
      } catch (err) {
        console.error('Failed to load professionals data:', err)
        setError('Failed to load professionals data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadProfessionalsData()
  }, [])

  return (
    <AuthProvider>
      <NotificationsProvider>
        <UserProvider>
          <LanguageProvider> {/* Wrap the application with LanguageProvider */}
            <Router>
              <div className='w-[85%] m-auto bg-white'>
                <NavBar />
                
                <Routes>
                  <Route path="/" element={
                    <>
                      <Search 
                        setFilteredJobs={setFilteredJobs} 
                        originalJobs={professionalsData}
                        loading={loading}
                      />
                      <Jobs 
                        filteredJobs={filteredJobs} 
                        setFilteredJobs={setFilteredJobs}
                        loading={loading}
                        error={error}
                      />
                      <Value />
                    </>
                  } />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  
                  {/* Provider routes */}
                  <Route path="/provider/:id" element={<ProviderDetails />} />
                  <Route path="/provider/:id/book" element={<BookingPage />} />
                  <Route path="/booking-success" element={<BookingSuccess />} />
                  <Route path="/ProviderRegistration" element={<ProviderRegistration />} />
                  <Route path="/" element={<ProviderDashboard />} />
                  <Route path="/provider/dashboard" element={<ProviderDashboard />} />
                  <Route path="/provider/profile" element={<ProviderProfileManagement />} />
                  
                  {/* New provider page routes */}
                  <Route path="/provider/notifications" element={<NotificationPage />} />
                  <Route path="/provider/settings" element={<SettingsPage />} />
                  <Route path="/provider/earnings" element={<EarningsPage />} />
                  <Route path="/provider/availability" element={<AvailabilityPage />} />
                  <Route path="/provider/bookings/:id" element={<BookingDetailsPage />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute>
                      <AdminUsers />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/payments" element={
                    <ProtectedRoute>
                      <AdminPayments />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/reports" element={
                    <ProtectedRoute>
                      <AdminReports />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/systems" element={
                    <ProtectedRoute>
                      <SystemSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/notifications" element={
                    <ProtectedRoute>
                      <AdminNotifications />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/profile" element={
                    <ProtectedRoute>
                      <AdminProfile />
                    </ProtectedRoute>
                  } />
                  
                  {/* Protected routes that require authentication */}
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } />
                  <Route path="/booking" element={
                    <ProtectedRoute>
                      <BookingHistory />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  {/* New notifications route */}
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  } />
                </Routes>
                
                <Footer />
              </div>
            </Router>
          </LanguageProvider>
        </UserProvider>
      </NotificationsProvider>
    </AuthProvider>
  )
}

export default App