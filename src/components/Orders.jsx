import React from 'react'
import { useState, useEffect } from 'react'

function Orders(props) {

  const [selectedForm, setSelectedForm] = useState('closedOrders')
  const [orders, setOrders] = useState([])
  // const closedOrders = orders.filter(order => order.status === 'closed')
  // const openOrders = orders.filter(order => order.status === 'open')
  // const fills = orders.filter(order => order.status === 'filled')
  // const positions = orders.filter(order => order.status === 'position')

  useEffect(() => {
    setOrders(props.tradeHistory);
  }, [props.tradeHistory]);

  return (
    <div className='glass w-full h-full mt-[20px] p-2'>
      <div className='flex gap-4'>
        <div className='p-1 cursor-pointer select-none'>
          <h1 className={`${selectedForm === 'closedOrders' ? 'text-[#ffffff]' : 'text-[#ffffffb3]'}`} onClick={() => setSelectedForm('closedOrders')}>
            Closed Orders
          </h1>
        </div>
        <div className='p-1 cursor-pointer select-none'>
          <h1 className={`${selectedForm === 'openOrders' ? 'text-[#ffffff]' : 'text-[#ffffffb3]'}`} onClick={() => setSelectedForm('openOrders')}>
            Open Orders
          </h1>
        </div>
        <div className='p-1 cursor-pointer select-none'>
          <h1 className={`${selectedForm === 'fills' ? 'text-[#ffffff]' : 'text-[#ffffffb3]'}`} onClick={() => setSelectedForm('fills')}>
            Fills
          </h1>
        </div>  
        <div className='p-1 cursor-pointer select-none'>
          <h1 className={`${selectedForm === 'positions' ? 'text-[#ffffff]' : 'text-[#ffffffb3]'}`} onClick={() => setSelectedForm('positions')}>
            Positions
          </h1>
        </div>
      </div> 

      {selectedForm === 'closedOrders' 
      ? <div className='mt-2'>
          <div className='flex gap-2 justify-between px-2'>
            <div className=''>
              <p className='text-[#ffffffb3] uppercase font-thin text-sm'>Market</p>
            </div>
            <div className=''>
              <p className='text-[#ffffffb3] uppercase font-thin text-sm'>Side</p>
            </div>
            <div className=''>
              <p className='text-[#ffffffb3] uppercase font-thin text-sm'>Type</p>
            </div>
            <div className=''>
              <p className='text-[#ffffffb3] uppercase font-thin text-sm'>Price</p>
            </div>
            <div className=''>
              <p className='text-[#ffffffb3] uppercase font-thin text-sm'>Quantity</p>
            </div>
          </div>
          {orders.map(order => {
            if (order.status === 'closed') {
              return (
                <div className='flex gap-2 justify-between px-2 text-center'>
                  <div className=''>
                    <p className='text-[#ffffff] w-[70px] text-left'>{order.market}</p>
                  </div>
                  <div className=''>
                    <p className='text-[#ffffff] w-[70px]'>{order.type}</p>
                  </div>
                  <div className=''>
                    <p className='text-[#ffffff] w-[70px]'>{order.orderType}</p>
                  </div>
                  <div className=''>
                    <p className='text-[#ffffff] w-[70px]'>{Number(order.price).toFixed(2)}</p>
                  </div>
                  <div className=''>
                    <p className='text-[#ffffff] w-[70px] text-right'>{order.quantity}</p>
                  </div>
                </div>
              )
            }
            return null
          })
          }
        </div>
      : null}
      

    </div>
  )
}

export default Orders