import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import socketIOClient from 'socket.io-client';

export default function ProductDetail() {
  const [product, setProduct] = useState({});
  const [currentBid, setCurrentBid] = useState('');
  const [storedBid, setStoredBid] = useState('');
  const { productId } = useParams();

  useEffect(() => {
    // Fetch product details when component mounts
    axios.get(`http://localhost:9000/products/${productId}`)
      .then(response => {
        setProduct(response.data);
        setStoredBid(response.data.current_bid);
      })
      .catch(error => console.error('Error fetching product:', error));
  }, [productId]);

  useEffect(() => {
    // Connect to Socket.IO server when component mounts
    const socket = socketIOClient('http://localhost:9000');

    // Listen for new bid events
    socket.on('newBid', (data) => {
      console.log('New bid received:', data);
      if (data.productId === productId) {
        setStoredBid(data.bid);
      }
    });

    return () => {
      // Disconnect from Socket.IO server when component unmounts
      socket.disconnect();
    };
  }, [productId]);

  const handleBidSubmit = () => {
    const bid = parseInt(currentBid);
    if (bid <= storedBid) {
      alert('Please enter a bid greater than the current bid.');
      return;
    }
    axios.post(`http://localhost:9000/bid`, { productId, bid })
      .then(response => {
        console.log('Bid submitted:', response.data);
        setCurrentBid('');
      })
      .catch(error => console.error('Error submitting bid:', error));
  };

  const handleBidChange = (e) => {
    setCurrentBid(e.target.value);
  };

  return (
        <>
          <section className='pdetail py-5'>
            <div className='container'>
              <div className='row d-flex justify-content-between'>
                <div className='col-lg-6'>
                  <img src={product.image_url} width={500} height={400} alt='' />
                </div>
                <div className='col-lg-6'>
                  <h2>Product Name: {product.title}</h2>
                  <p>Product Start Price: {product.start_price}<span>$</span></p>
                  <label className='bidValue' htmlFor='bidValue'>
                    Your Bid Value
                  </label>
                  <input
                    type='number'
                    inputMode='numeric'
                    className='form-control w-25'
                    name=''
                    id='bidValue'
                    value={currentBid}
                    onChange={handleBidChange}
                  />
                  <button className='btn btn-primary mt-2' onClick={handleBidSubmit}>
                    Bid
                  </button>
                  {storedBid && (
                    <p>Current Bid: {storedBid} <span>$</span></p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      );
}









































// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import Product from '../Product/Product';

// export default function ProductDetail() {
//   const [product, setProduct] = useState({});
//   const [currentBid, setCurrentBid] = useState('');
//   const [storedBid, setStoredBid] = useState('');
//   const { productId } = useParams();

//   useEffect(() => {
//     fetch(`http://localhost:9000/products/${productId}`)
//       .then((res) => res.json())
//       .then((product) => {
//         console.log(product);
//         setProduct(product);
//       });
//   }, [productId]);

//   useEffect(() => {
//     const bidFromLocalStorage = localStorage.getItem(`product_${productId}_bid`);
//     if (bidFromLocalStorage) {
//       setStoredBid(bidFromLocalStorage);
//     }
//   }, [productId]);

//   const handleBidChange = (e) => {
//     setCurrentBid(e.target.value);
//   };

//   const handleBidSubmit = () => {
//     const minBid = parseInt(storedBid, 10) + 99 || product.start_price + 99;
//     if (parseInt(currentBid) <= minBid) {
//       alert(`Please enter a bid at least 100 dollars greater than the previous bid.`);
//       return;
//     }
//     localStorage.setItem(`product_${productId}_bid`, currentBid);
//     setStoredBid(currentBid);
//     console.log('Bid submitted:', currentBid);
//   };

//   return (
//     <>
//       <section className='pdetail py-5'>
//         <div className='container'>
//           <div className='row d-flex justify-content-between'>
//             <div className='col-lg-6'>
//               <img src={product.image_url} width={500} height={400} alt='' />
//             </div>
//             <div className='col-lg-6'>
//               <h2>Product Name: {product.title}</h2>
//               <p>Product Start Price: {product.start_price}<span>$</span></p>
//               <label className='bidValue' htmlFor='bidValue'>
//                 Your Bid Value
//               </label>
//               <input
//                 type='number'
//                 inputMode='numeric'
//                 className='form-control w-25'
//                 name=''
//                 id='bidValue'
//                 value={currentBid}
//                 onChange={handleBidChange}
//               />
//               <button className='btn btn-primary mt-2' onClick={handleBidSubmit}>
//                 Bid
//               </button>
//               {storedBid && (
//                 <p>Current Bid: {storedBid} <span>$</span></p>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
