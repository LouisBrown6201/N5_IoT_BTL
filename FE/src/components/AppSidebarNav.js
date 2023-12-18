import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

export const AppSidebarNav = ({ items }) => {
  const navLink = (name, icon) => {
    return (
      <>
        {icon && icon}
        {name && name}
      </>
    )
  }

  const navItem = (item, index) => {
    const { component, name, icon, ...rest } = item
    const Component = component
    return (
      <Component
        {...(rest.to &&
          !rest.items && {
            component: NavLink,
          })}
        key={index}
        {...rest}
      >
        {navLink(name, icon)}
      </Component>
    )
  }

  return (
    <React.Fragment> {items && items.map((item, index) => navItem(item, index))} </React.Fragment>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
