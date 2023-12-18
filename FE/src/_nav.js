import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilUser, cilHistory, cibTableau } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Profile',
    to: '/profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Data Sensors',
    to: '/datasensors',
    icon: <CIcon icon={cibTableau} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Action History',
    to: '/actionhistory',
    icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
  },
]

export default _nav
