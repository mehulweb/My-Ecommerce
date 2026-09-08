import {useEffect, useState } from 'react'
import api from '../services/api';
import Cart from './Cart'
import { useNavigate } from 'react-router-dom';

const Card = () => {

  const [products, setProducts] = useState([])
  // const [productId, setProductId] = useState([])
  const navigate = useNavigate()
  

  useEffect(() => {
    
    api.get('/products')
   
    .then(res => setProducts(res.data.products))
 
    .catch(err => console.error(err))
  }, [])


  const aboutProduct = (id) => {   
    navigate(`/productpage/${id}`)
  }

  const addCart = (product) => {
     const cartItems = products.filter(item => item._id === product._id)
     Cart({ cartItems: cartItems, setCartItems: setProducts })
     
  }

  return (
    products.map(product => (
    <div className='w-65 shadow-black-50 flex items-center justify-between gap-2' key={product._id}>
      <div className='w-full h-90 border-0 p-3 bg-linear-120 from-amber-500 flex items-center justify-center gap-2 flex-col rounded-2xl'>
        <header className='w-full h-22 bg-transparent flex items-start justify-evenly gap-2 rounded-2xl'>
          <div className='flex flex-col justify-center items-start '>
            <h1 className='italic font-bold text-blue-900 uppercase'>{product.name}</h1>
            <p className='italic font-medium text-black cursor-pointer' onClick={() => aboutProduct(product._id)}>{product.description}</p>
          </div>
            <span className='w-20 h-20 border-0 bg-pink-300 text-blue-900 font-bold rounded-full flex items-center justify-center'>₹{product.price}</span>
        </header>
        <center className='w-full h-57 bg-transparent flex items-center justify-center gap-2 flex-col rounded-2xl'>
            <span className='w-45 h-45 overflow-hidden bg-center rounded-full courser-pointer' onClick={() => aboutProduct(product._id)}>
            <img className='cursor-pointer' src={product.images[0]} alt={product.name} />
            </span>
        </center>
        <footer className=' w-full h-12 flex items-center justify-between p-2 gap-2 couser-pointer'>
             <span>4.5/5</span>
             
            <button className='italic bg-blue-900 border-0 h-8 rounded-full text-xs text-white py-1 px-6 hover:bg-blue-700 font-semibold cursor-pointer' onClick={() => addCart(product)}>ADD TO CART</button>
        </footer>
      </div>
    </div>
)
  ))

}

export default Card
