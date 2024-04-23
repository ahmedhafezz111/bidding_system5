import React, { useState } from 'react';
import OpenAI from 'openai';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const AddProduct = () => {
  const [description, setDescription] = useState('');
  const [seedWords, setSeedWords] = useState('');
  const [generatedProduct, setGeneratedProduct] = useState('');
  const [isLoading, setIsLoading] = useState(false);



  const openai = new OpenAI({
    apiKey: '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',
    dangerouslyAllowBrowser: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You will be provided with a product description and seed words, and your task is to generate product names.',
          },
          {
            role: 'user',
            content: `Product description: ${description}\nSeed words: ${seedWords}`,
          },
        ],
        temperature: 0.8,
        max_tokens: 64,
        top_p: 1,
      });
      setGeneratedProduct(response.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [startPrice , setStartPrice] = useState(0);
    const [file, setFile] = useState('');

    const navigate = useNavigate();
  


    const formSubmit = (e) => {
      e.preventDefault();
    
      // Check if any input is empty
      if (!productName || !productDescription || !startPrice || !file) {
        alert("Please fill in all the form inputs.");
        return;
      }
    
      // Check if productName and productDescription contain at least 10 characters
      if (productName.length < 5 || productDescription.length < 5) {
        alert("Product name and description should contain at least 5 characters.");
        return;
      }
    
      // Check if startPrice exceeds the limit
      if (startPrice > 100000000) {
        alert("Start price cannot exceed 100,000,000.");
        return;
      }
    
      axios.post("http://localhost:9000/products", {
        product_name: productName,
        title: productDescription,
        image_url: file,
        start_price: startPrice
      })
      .then((data) => {
        console.log(data);
        navigate('/product');
      });
    };
    
  // const formSubmit = (e) => {
  //   e.preventDefault();
    
  //   axios.post("http://localhost:9000/products" , {
  //     product_name:productName,
  //        title:productDescription,
  //        image_url: file,
  //        start_price: startPrice
  //   })
  //   .then((data) => {
  //     console.log(data);
  //     navigate('/product')
  //   })
    
  // };

  // const handleProductSubmit = (e) => {
  //   e.preventDefault();
  //   // Set the product name, description, and start price

  // };

  // const handleChange = (e) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     setFile(URL.createObjectURL(e.target.files[0]));
  //   }
  // };
  

  return (
    <>
      <section className='userInputform'>
        <div className="container px-5">
          <div className="row">
            <div className="col-lg-6">
              <h2 className='py-2'>Add Your Antique </h2>

            <form onSubmit={formSubmit}>

                <div className='mt-3'>
                  <label htmlFor="productName" className="form-label">Product Name</label>
                  <input type="text" placeholder="Product Name..." className="form-control w-50" id="productName" onChange={(e) => setProductName(e.target.value)} />
                </div>

                <div className='mt-3'>
                  <label htmlFor="productDescription" className="form-label">Product Description</label>
                  <input type="text" placeholder="Product Description..." className="form-control w-50" id="productDescription" onChange={(e) => setProductDescription(e.target.value)}  />
                </div>

                <div className='mt-3'>
                  <label htmlFor="startPrice" className="form-label">Product Start Price</label>
                  <input type="number" placeholder="Product Start Price..." className="form-control w-50" id="startPrice" onChange={(e) => setStartPrice(parseFloat(e.target.value))} />
                </div>

                <div className="mt-1">
                  <label htmlFor="productImg" className="form-label">Product Image</label>
                  <input type="url" className='form-control' placeholder='Enter image direct link' onChange={(e) => setFile(e.target.value) }/>
                </div>

                <button className='btn btn-primary mt-3' type="submit">Submit</button>
              </form>




          <h2 className='mt-4 py-2'>Product Name Generator</h2>
              <form onSubmit={handleSubmit}>
                <div className='mt-3'>
                  <label htmlFor="Description" className="form-label">Description</label>
                  <input type="text" className="form-control w-50 " id="Description" placeholder="Description..." value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className='mt-3'>
                  <label htmlFor="seedWords" className="form-label">Seed Words</label>
                  <input type="text" placeholder="Seed Words..." className="form-control w-50" id="seedWords"  value={seedWords} onChange={(e) => setSeedWords(e.target.value)} />
                </div>
                <button className='btn btn-success mt-3' type="submit" disabled={!description || !seedWords || isLoading}>
                  {isLoading ? 'Generating...' : 'Generate'}
                </button>
              </form>
              {generatedProduct && (
                <div>
                  <h3>Generated Product Name:</h3>
                  <p>{generatedProduct}</p>
                </div>
              )}

            </div>

            {/* <div className="col-lg-4 py-5">
              <h2 className='py-3'>Your Product Card Preview</h2>
              <div className="card">
                <img src={file} className="card-img-top" alt="..." />
                <div className="card-body text-center">
                  <h5 className="card-title">{productName}</h5>
                  <p className="card-text">{productDescription}</p>
                  <p className="card-text">Start Price: ${startPrice}</p>
                  <a href="#" className="btn btn-primary">Start Bidding</a>
                </div>
              </div>
            </div> */}

          </div>
        </div>
      </section>
    </>
  );
};

export default AddProduct;
