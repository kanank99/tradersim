import React from 'react'
import { useState, useEffect } from 'react'

function Orders(props) {

  const [orders, setOrders] = useState([])
  const [openOrders, setOpenOrders] = useState([])
  // const closedOrders = orders.filter(order => order.status === 'closed')
  // const openOrders = orders.filter(order => order.status === 'open')
  // const fills = orders.filter(order => order.status === 'filled')
  // const positions = orders.filter(order => order.status === 'position')

  const selectedForm = props.selectedForm
  const setSelectedForm = props.setSelectedForm

  useEffect(() => {
    setOrders(props.tradeHistory);
  }, [props.tradeHistory]);

  useEffect(() => {
    setOpenOrders(props.limitOrders);
  }, [props.limitOrders]);

  return (
    <div className='glass w-full h-full my-[20px]'>
      <div className='flex gap-4 px-2 pt-2'>
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
      ? <div className='mt-2 '>
          <div className='flex gap-2 justify-between px-4'>
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
          <div className='flex flex-col'>
          {orders.map(order => {

            let coinSymbol = order.market.split('-')[0]

            if (order.isOpen === false) {
              return (
                <div className='flex gap-2 justify-between px-4 text-center text-sm p-2 hover:bg-[#504d4d]'>
                  <div className=''>
                    <p className='text-[#ffffff] w-[70px] text-left'>{order.market}</p>
                  </div>
                  <div className=''>
                    <p className={`text-[#ffffff] w-[40px] ${order.type === 'Buy' ? 'text-green-500' : 'text-red-500'} text-right`}>{order.type}</p>
                  </div>
                  <div className=''>
                    <p className='text-[#ffffff] w-[70px] text-right'>{order.orderType}</p>
                  </div>
                  <div className=''>
                    <p className='text-[#ffffff] w-[110px]'>{Number(order.price).toFixed(2)}<span className='text-[#ffffffb3]'>USD</span></p>
                  </div>
                  <div className=''>
                    <p className='text-[#ffffff] w-[70px] text-right'>{order.quantity}<span className='text-[#ffffffb3]'>{coinSymbol}</span></p>
                  </div>
                </div>
              )
            }
            return null
          })
          }
           </div>
        </div>
      : null}
      {selectedForm === 'openOrders' 
      ? <div className='mt-2 '>
          <div className='flex gap-2 justify-between px-4'>
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
              <p className='text-[#ffffffb3] uppercase font-thin text-sm'>Status</p>
            </div>
            <div className=''>
              <p className='text-[#ffffffb3] uppercase font-thin text-sm'>Quantity</p>
            </div>
          </div>
          <div className='flex flex-col'>
          {openOrders.map(order => {
              
              let coinSymbol = order.market.split('-')[0]
  
              if (order.isOpen === true) {
                return (
                  <div className='flex gap-2 justify-between px-4 text-center text-sm p-2 hover:bg-[#504d4d]'>
                    <div className=''>
                      <p className='text-[#ffffff] w-[70px] text-left'>{order.market}</p>
                    </div>
                    <div className=''>
                      <p className={`text-[#ffffff] w-[40px] ${order.type === 'Buy' ? 'text-green-500' : 'text-red-500'} text-right`}>{order.type}</p>
                    </div>
                    <div className=''>
                      <p className='text-[#ffffff] w-[70px] text-right'>{order.orderType}</p>
                    </div>
                    <div className=''>
                      <p className='text-[#ffffff] w-[110px]'>{Number(order.limitPrice).toFixed(2)}<span className='text-[#ffffffb3]'>USD</span></p>
                    </div>
                    <div className=''>
                      <p className='text-[#ffffff] w-[70px] text-left'>{order.status}</p>
                    </div>
                    <div className=''>
                      <p className='text-[#ffffff] w-[70px] text-right'>{order.quantity}<span className='text-[#ffffffb3]'>{coinSymbol}</span></p>
                    </div>
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
      : null}
          
      

    </div>
  )
}

export default Orders