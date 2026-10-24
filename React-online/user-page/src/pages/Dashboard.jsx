import React from 'react'
import Card from '../components/Card';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <div className=''>
      <Navbar/>
      <div className="w-full h-full flex items-start p-16 justify-center gap-5 ">
        <Card />
      </div>
    </div>
  )
}

export default Dashboard
