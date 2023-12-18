import React from 'react'
import { CRow, CCol, CWidgetStatsF } from '@coreui/react'
import humidIcon from 'src/assets/images/icons/humidity.png'
import temperatureIcon from 'src/assets/images/icons/temperature.png'
import sunIcon from 'src/assets/images/icons/sun.png'

const WidgetsDropdown = () => {
  return (
    <CRow>
      <CCol xs={4}>
        <CWidgetStatsF
          className="mb-3"
          color="success"
          icon={<img src={temperatureIcon} alt="Temperature Icon" height={24} />}
          title="Temperature"
          value="98F"
        />
      </CCol>
      <CCol xs={4}>
        <CWidgetStatsF
          className="mb-3"
          color="primary"
          icon={<img src={humidIcon} alt="Humidity Icon" height={24} />}
          title="Humidity"
          value="92RH"
        />
      </CCol>
      <CCol xs={4}>
        <CWidgetStatsF
          className="mb-3"
          color="warning"
          icon={<img src={sunIcon} alt="Sun Icon" height={24} />}
          title="Light"
          value="100Lux"
        />
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown
