import React, { useEffect, useState } from 'react'

export default function DarkToggle() {
  const [dark, setDark] = useState(localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <button className="btn ghost" onClick={() => setDark(d => !d)}>
      {dark ? 'Switch to light' : 'Switch to dark'}
    </button>
  )
}
