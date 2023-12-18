import React from 'react'

const Login = React.lazy(() => import('./views/pages/login/Login'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Profile = React.lazy(() => import('./views/profile/Profile'))
const DataSensors = React.lazy(() => import('./views/datasensors/DataSensors'))
const ActionHistory = React.lazy(() => import('./views/actionhistory/ActionHistory'))

const routes = [
  { path: '/', exact: true, name: 'Home', element: Login },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/profile', name: 'Profile', element: Profile },
  { path: '/datasensors', name: 'DataSensors', element: DataSensors },
  { path: '/actionhistory', name: 'ActionHistory', element: ActionHistory },
]

export default routes
