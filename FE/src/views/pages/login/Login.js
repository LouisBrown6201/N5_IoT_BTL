import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password,
      })
      // Kiểm tra xem đăng nhập thành công
      if (response.status === 200) {
        // Lưu thông tin người dùng vào localStorage hoặc Redux state nếu cần
        localStorage.setItem('user', JSON.stringify(response.data.user))

        // Chuyển hướng đến trang dashboard
        return navigate('/dashboard')
      }
    } catch (error) {
      setError('Username or password is incorrect')
      console.error('Error logging in:', error)
      // Xử lý lỗi đăng nhập
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CForm className="mx-auto">
              <h1>Login</h1>
              <p className="text-medium-emphasis">Sign In to your account</p>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </CInputGroup>
              <CInputGroup className="mb-4">
                <CInputGroupText>
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>
                <CFormInput
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </CInputGroup>
              <CRow>
                <CCol xs={6}>
                  <CButton color="primary" className="px-4" onClick={handleLogin}>
                    Login
                  </CButton>
                </CCol>
                {/* ... (unchanged code) */}
              </CRow>
              {<p className="text-danger mt-2">{error}</p>}
            </CForm>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
