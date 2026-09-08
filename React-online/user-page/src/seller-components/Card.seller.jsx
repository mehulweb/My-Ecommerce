import {useEffect, useState } from 'react'
import api from '../services/api.js'


const SellerCard = () => {

  const [products, setProducts] = useState([])
  

  useEffect(() => {
    
    api.get('/seller/get-seller-products/:sellerId')

    // .then(res => console.log(res.data))
    .then(res => {setProducts(res.data.products)
      console.log(res.data.products);
      
    })

    .catch(err => console.error(err))
  }, [])

  

  return (
    products.map(product => (
    <div className='shadow-black-50 flex flex-row items-center justify-between gap-2' key={product._id}>
      <div className='w-73 h-90 border-0 p-3 bg-linear-120 from-amber-500 flex items-center justify-center gap-2 flex-col rounded-2xl'>
        <header className='w-full h-22 bg-transparent flex items-start justify-evenly gap-2 rounded-2xl'>
          <div className='flex flex-col justify-center items-start '>
            <h1 className='italic font-bold text-blue-900 uppercase'>{product.productName}</h1>
            <p className='italic font-medium text-black'>{product.description}</p>
          </div>
            <span className='w-20 h-20 border-0 bg-pink-300 text-blue-900 font-bold rounded-full flex items-center justify-center'>${product.price}</span>
        </header>
        <center className='w-full h-57 bg-transparent flex items-center justify-center gap-2 flex-col rounded-2xl'>
            <span className='w-45 h-45 overflow-hidden  rounded-full'>
            <img className='' src="" alt={product.productName} />
            </span>
        </center>
        <footer className=' w-full h-12 flex items-center justify-between p-2 gap-2'>
             <span>4.5/5</span>
             
            <button className='italic bg-blue-900 border-0 h-8 rounded-full text-xs text-white py-1 px-6 hover:bg-blue-700 font-semibold cursor-pointer' onClick={() => addCart(product)}>ADD TO CART</button>
        </footer>
      </div>
    </div>
)
  ))

}

export default SellerCard
