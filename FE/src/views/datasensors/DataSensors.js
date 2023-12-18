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

const DataSensors = () => {
  const [sensorData, setSensorData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchCriteria, setSearchCriteria] = useState('temperature') // Default search criteria
  const [sortColumn, setSortColumn] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const itemsPerPage = 10

  useEffect(() => {
    // Fetch data from the specified URL
    axios
      .get('http://localhost:3000/data', {
        params: {
          search: searchTerm,
          criteria: searchCriteria,
        },
      })
      .then((response) => {
        // Update the state with the retrieved data
        setSensorData(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [searchTerm, searchCriteria])

  const handleSort = (column) => {
    if (sortColumn === column) {
      // If the same column is clicked, toggle the sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // If a different column is clicked, set it as the new sorting column
      setSortColumn(column)
      setSortOrder('asc')
    }
  }

  const sortedData = [...sensorData].sort((a, b) => {
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]

    // Use localeCompare for string comparison and handle numbers
    const comparison =
      typeof aValue === 'number' ? aValue - bValue : String(aValue).localeCompare(String(bValue))

    return sortOrder === 'asc' ? comparison : -comparison
  })

  const filteredData = sortedData.filter((data) =>
    String(data[searchCriteria]).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate)
    const formattedDate = date.toLocaleDateString() // Format the date
    const formattedTime = date.toLocaleTimeString() // Format the time
    return `${formattedDate} ${formattedTime}`
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  // const paginatedData = sensorData.slice(startIndex, endIndex)
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(page)
  }

  return (
    <>
      {/* <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      /> */}
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col" onClick={() => handleSort('Date')}>
              Time {sortColumn === 'Date' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('temperature')}>
              Temperature
              {sortColumn === 'temperature' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('humidity')}>
              Humidity {sortColumn === 'humidity' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('light')}>
              Light {sortColumn === 'light' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {paginatedData.map((data, index) => (
            <CTableRow key={index}>
              <CTableHeaderCell scope="row">{formatDateTime(data.Date)}</CTableHeaderCell>
              <CTableDataCell>{data.temperature.toFixed(2)}</CTableDataCell>
              <CTableDataCell>{data.humidity.toFixed(2)}</CTableDataCell>
              <CTableDataCell>{data.light}</CTableDataCell>
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

export default DataSensors
