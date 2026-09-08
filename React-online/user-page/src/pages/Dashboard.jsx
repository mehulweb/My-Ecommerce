import React from 'react'
import Card from '../components/Card';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <div className=''>
      <Navbar/>
      <div className="grid grid-cols-5 h-screen flex items-start p-16 justify-start gap-5 ">
        <Card />
      </div>
    </div>
  )
}

export default Dashboard
