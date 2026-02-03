const fetch = require('node-fetch');

async function checkProducts() {
  try {
    const res = await fetch('http://localhost:4000/api/products');
    const products = await res.json();
    console.log("Total products:", products.length);
    if (products.length > 0) {
      console.log("First product image:", products[0].image);
      console.log("Last product image:", products[products.length - 1].image);
      
      // Check accessibility of the last product image
      const lastImg = products[products.length - 1].image;
      if (lastImg.startsWith('http')) {
          const imgRes = await fetch(lastImg);
          console.log(`Image ${lastImg} status:`, imgRes.status);
      } else {
          console.log("Image URL is relative/invalid:", lastImg);
      }
    }
  } catch (e) {
    console.error("Error:", e);
  }
}

checkProducts();
