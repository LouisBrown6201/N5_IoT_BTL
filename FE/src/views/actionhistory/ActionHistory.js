import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
} from '@coreui/react'

const ActionHistory = () => {
  const [sensorData, setSensorData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    // Fetch data from the specified URL
    axios
      .get('http://localhost:3000/action')
      .then((response) => {
        // Update the state with the retrieved data
        setSensorData(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])

  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate)
    const formattedDate = date.toLocaleDateString() // Format the date
    const formattedTime = date.toLocaleTimeString() // Format the time
    return `${formattedDate} ${formattedTime}`
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = sensorData.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(page)
  }

  return (
    <>
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Time</CTableHeaderCell>
            <CTableHeaderCell scope="col">Device</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {paginatedData.map((data, index) => (
            <CTableRow key={index}>
              <CTableHeaderCell scope="row">{formatDateTime(data.Date)}</CTableHeaderCell>
              <CTableDataCell>{data.device}</CTableDataCell>
              <CTableDataCell>{data.value}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn"
        >
          &lt;&lt;
        </button>
        <p
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            margin: '0 20px',
            color: '#0078D4',
          }}
        >
          {currentPage}
        </p>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(sensorData.length / itemsPerPage)}
          className="btn"
        >
          &gt;&gt;
        </button>
      </div>
    </>
  )
}

export default ActionHistory
