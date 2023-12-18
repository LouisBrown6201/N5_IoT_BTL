import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import debounce from 'lodash.debounce'

import { CCard, CCardBody, CCol, CRow, CWidgetStatsF, CFormSwitch } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import humidIcon from 'src/assets/images/icons/humidity.png'
import temperatureIcon from 'src/assets/images/icons/temperature.png'
import sunIcon from 'src/assets/images/icons/sun.png'
import bulbOff from 'src/assets/images/icons/lightbulboff.png'
import bulbOn from 'src/assets/images/icons/lightbulbon.gif'
import fanOff from 'src/assets/images/icons/fanoff.png'
import fanOn from 'src/assets/images/icons/fanon.gif'

const Dashboard = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Temperature',
        yAxisID: 'y1',
        backgroundColor: 'transparent',
        borderColor: getStyle('--cui-success'),
        pointHoverBackgroundColor: getStyle('--cui-success'),
        borderWidth: 2,
        data: [],
        fill: true,
      },
      {
        label: 'Humidity',
        yAxisID: 'y1',
        backgroundColor: 'transparent',
        borderColor: getStyle('--cui-info'),
        pointHoverBackgroundColor: getStyle('--cui-info'),
        borderWidth: 2,
        data: [],
      },
      {
        label: 'Light',
        yAxisID: 'y2',
        backgroundColor: 'transparent',
        borderColor: getStyle('--cui-danger'),
        pointHoverBackgroundColor: getStyle('--cui-danger'),
        borderWidth: 2,
        data: [],
      },
    ],
  })
  const [temperatureValue, setTemperatureValue] = useState(0)
  const [humidityValue, setHumidityValue] = useState(0)
  const [lightValue, setLightValue] = useState(0)

  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate)
    const formattedTime = date.toLocaleTimeString() // Format the time
    return `${formattedTime}`
  }

  const fetchLatestData = () => {
    axios
      .get('http://localhost:3000/data')
      .then((response) => {
        const latestData = response.data[0]
        console.log(latestData)
        // Extract the latest values
        const latestTemperatureValue = latestData.temperature.toFixed(2)
        const latestHumidityValue = latestData.humidity.toFixed(2)
        const latestLightValue = latestData.light

        // Update the widget values
        setTemperatureValue(latestTemperatureValue)
        setHumidityValue(latestHumidityValue)
        setLightValue(latestLightValue)

        // Update the chart data
        const newLabel = formatDateTime(latestData.Date)
        const updatedLabels = [...chartData.labels, newLabel]
        const newData = chartData.datasets.map((dataset, index) => ({
          ...dataset,
          data: [...dataset.data, latestData[dataset.label.toLowerCase()]],
        }))
        if (updatedLabels.length > 10) {
          updatedLabels.shift()
          newData.forEach((dataset) => {
            dataset.data.shift()
          })
        }
        setChartData({ labels: updatedLabels, datasets: newData })
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }
  const debouncedFetchLatestData = debounce(fetchLatestData, 500)

  useEffect(() => {
    // Update labels every second (adjust interval as needed)
    // const interval = setInterval(fetchLatestData, 5000)
    const interval = setInterval(debouncedFetchLatestData, 5000)
    return () => {
      clearInterval(interval)
    }
    // eslint-disable-next-line
  }, [chartData])
  //button control
  const [isBulbOn, setIsBulbOn] = useState(false)

  const toggleBulb = () => {
    const newIsBulbOn = !isBulbOn
    setIsBulbOn(newIsBulbOn)
    // Send a POST request to update the bulb state
    axios
      .post('http://localhost:3000/action', { item: 'bulb', value: newIsBulbOn })
      .then((response) => {
        console.log('Bulb state updated:', response.data)
      })
      .catch((error) => {
        console.error('Error updating bulb state:', error)
      })
  }

  const [isFanOn, setIsFanOn] = useState(false)

  const toggleFan = () => {
    const newIsFanOn = !isFanOn
    setIsFanOn(newIsFanOn)
    // Send a POST request to update the bulb state
    axios
      .post('http://localhost:3000/action', { item: 'fan', value: newIsFanOn })
      .then((response) => {
        console.log('Fan state updated:', response.data)
      })
      .catch((error) => {
        console.error('Error updating fan state:', error)
      })
  }

  return (
    <>
      <CRow>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            // color="success"
            icon={<img src={temperatureIcon} alt="Humidity Icon" height={24} />}
            title="Temperature"
            value={temperatureValue}
            style={{ color: temperatureValue > 32 ? 'red' : 'green' }}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            // color="primary"
            icon={<img src={humidIcon} alt="Humidity Icon" height={24} />}
            title="Humidity"
            value={humidityValue}
            style={{ color: humidityValue > 60 ? 'blue' : 'orange' }}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            // color="warning"
            icon={<img src={sunIcon} alt="Humidity Icon" height={24} />}
            title="Light"
            value={lightValue}
            style={{ color: lightValue > 800 ? 'purple' : 'darkred' }}
          />
        </CCol>
      </CRow>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol xs={8}>
              <CChartLine
                style={{ height: '350px', marginTop: '10px' }}
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: getStyle('--cui-body-color'),
                      },
                    },
                  },
                  responsive: true,
                  scales: {
                    x: {
                      grid: {
                        color: getStyle('--cui-border-color-translucent'),
                      },
                      ticks: {
                        color: getStyle('--cui-body-color'),
                      },
                    },
                    y1: {
                      position: 'left',
                      grid: {
                        color: getStyle('--cui-border-color-translucent'),
                      },
                      ticks: {
                        beginAtZero: true,
                        color: getStyle('--cui-body-color'),
                      },
                    },
                    y2: {
                      position: 'right',
                      grid: {
                        color: getStyle('--cui-border-color-translucent'),
                      },
                      ticks: {
                        color: getStyle('--cui-body-color'),
                      },
                    },
                  },
                }}
              />
            </CCol>
            <CCol xs={4}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CCard style={{ flex: '1', alignItems: 'center', padding: '10px' }}>
                  <img
                    src={isBulbOn ? bulbOn : bulbOff}
                    alt="Sun Icon"
                    style={{ height: '100px' }}
                  />
                  <div
                    style={{
                      flex: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <CFormSwitch onClick={toggleBulb} style={{ width: '60px', height: '30px' }} />
                  </div>
                </CCard>
                <CCard
                  style={{ flex: '1', marginTop: '20px', alignItems: 'center', padding: '10px' }}
                >
                  <img
                    src={isFanOn ? fanOn : fanOff}
                    alt="Sun Icon"
                    style={{ height: '100px', transition: 'all 3s' }}
                  />
                  <div
                    style={{
                      flex: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <CFormSwitch onClick={toggleFan} style={{ width: '60px', height: '30px' }} />
                  </div>
                </CCard>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
