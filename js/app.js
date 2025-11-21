(() => {
  const categories = [
    "Men's Section",
    "Female's Section",
    "Kid's Section",
    "Gifts For Her",
    "Gifts For Him"
  ];

  const sizes = ['XS','S','M','L','XL','XXL'];

  // Generate 20 sample items per category
  const products = [];
  categories.forEach((cat,ci)=>{
    for(let i=1;i<=20;i++){
      const id = `${ci}-${i}`;
      const name = `${cat.split(' ')[0]} Item ${i}`;
      const price = (10 + Math.floor(Math.random()*90)).toFixed(2);
      const color = ['7c3aed','0ea5a4','f97316','ef4444','06b6d4'][i%5];
      // SVG placeholder image as data URI
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='480'><rect width='100%' height='100%' fill='%23${color}'/><text x='50%' y='50%' fill='%23fff' font-size='28' font-family='Arial' text-anchor='middle' dominant-baseline='middle'>${encodeURIComponent(name)}</text></svg>`;
      const img = `data:image/svg+xml;utf8,${svg}`;
      products.push({id,name,price,category:cat,img});
    }
  });

  // DOM refs
  const catButtons = document.getElementById('category-buttons');
  const productsEl = document.getElementById('products');
  const search = document.getElementById('search');
  const welcomeModal = document.getElementById('welcome-modal');
  const welcomeContinue = document.getElementById('welcome-continue');
  const welcomeLater = document.getElementById('welcome-later');
  const openWelcome = document.getElementById('open-welcome');
  const viewCategories = document.getElementById('view-categories');
  const productModal = document.getElementById('product-modal');
  const productContent = document.getElementById('product-content');
  const addCartBtn = document.getElementById('add-cart');
  const buyBtn = document.getElementById('buy-now');
  const underOverlay = document.getElementById('under-overlay');

  let currentCategory = null;
  let selectedProduct = null;
  let selectedSize = null;

  function showWelcome(){ welcomeModal.style.display = 'flex'; }
  function hideWelcome(){ welcomeModal.style.display = 'none'; }

  function createButton(label){
    const b = document.createElement('button');
    b.className = 'btn btn-outline';
    b.textContent = label;
    return b;
  }

  function renderCategoryButtons(){
    categories.forEach(cat=>{
      const b = createButton(cat);
      b.addEventListener('click', ()=>{
        selectCategory(cat);
      });
      catButtons.appendChild(b);
    });
  }

  function productTile(p){
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<img src="${p.img}" alt="${p.name}"><div class='title'>${p.name}</div><div class='meta'>${p.category}</div><div class='price-row'><div class='price'>$${p.price}</div><button class='btn btn-outline small' data-id='${p.id}'>Select</button></div>`;
    div.querySelector('button').addEventListener('click', ()=>openProduct(p));
    return div;
  }

  function renderProducts(list){
    productsEl.innerHTML = '';
    if(list.length===0){ productsEl.innerHTML = '<div class="muted">No products found.</div>'; return }
    const frag = document.createDocumentFragment();
    list.forEach(p=>frag.appendChild(productTile(p)));
    productsEl.appendChild(frag);
  }

  function selectCategory(cat){
    currentCategory = cat;
    const filtered = products.filter(p=>p.category===cat);
    renderProducts(filtered);
  }

  function openProduct(p){
    selectedProduct = p;
    selectedSize = null;
    productContent.innerHTML = '';
    const img = document.createElement('img'); img.src = p.img; img.style.width='100%'; img.style.borderRadius='8px';
    const title = document.createElement('h3'); title.textContent = p.name;
    const desc = document.createElement('p'); desc.className='muted'; desc.textContent = `${p.category} — $${p.price}`;
    const sizeLabel = document.createElement('div'); sizeLabel.textContent = 'Choose size:';
    const sizeRow = document.createElement('div'); sizeRow.style.display='flex'; sizeRow.style.flexWrap='wrap'; sizeRow.style.gap='8px'; sizeRow.style.marginTop='8px';
    sizes.forEach(s=>{
      const btn = document.createElement('button'); btn.className='btn btn-outline'; btn.textContent=s; btn.addEventListener('click', ()=>{
        selectedSize = s; // simple selection
        // highlight
        sizeRow.querySelectorAll('button').forEach(x=>x.style.borderColor='');
        btn.style.borderColor='var(--accent)';
      });
      sizeRow.appendChild(btn);
    });
    productContent.appendChild(img);
    productContent.appendChild(title);
    productContent.appendChild(desc);
    productContent.appendChild(sizeLabel);
    productContent.appendChild(sizeRow);
    productModal.style.display = 'flex';
  }

  function closeProduct(){ productModal.style.display = 'none'; selectedProduct=null; selectedSize=null; }

  addCartBtn.addEventListener('click', ()=>{
    if(!selectedProduct){ closeProduct(); return }
    if(!selectedSize){ alert('Please choose a size before adding to cart.'); return }
    closeProduct();
    alert('Added to cart. Thank you!');
    // redirect to welcome
    showWelcome();
  });

  buyBtn.addEventListener('click', ()=>{
    if(!selectedProduct){ closeProduct(); return }
    if(!selectedSize){ alert('Please choose a size before buying.'); return }
    closeProduct();
    // show under construction then redirect
    underOverlay.style.display = 'flex';
    setTimeout(()=>{
      underOverlay.style.display = 'none';
      alert('Thank you! You will be redirected to welcome.');
      showWelcome();
    }, 1600);
  });

  // welcome controls
  welcomeContinue.addEventListener('click', ()=>{ hideWelcome(); if(!currentCategory) renderProducts(products.slice(0,20)); });
  welcomeLater.addEventListener('click', ()=>{ hideWelcome(); if(!currentCategory) renderProducts(products.slice(0,20)); });
  openWelcome.addEventListener('click', ()=>{ hideWelcome(); if(!currentCategory) renderProducts(products.slice(0,20)); });
  viewCategories.addEventListener('click', ()=>{ hideWelcome(); renderCategoryButtons(); renderProducts(products.slice(0,20)); });

  // clicking outside product modal closes
  productModal.addEventListener('click', (e)=>{ if(e.target===productModal) closeProduct(); });

  // search
  search.addEventListener('input', ()=>{
    const q = search.value.trim().toLowerCase();
    let list = products;
    if(currentCategory) list = list.filter(p=>p.category===currentCategory);
    if(q) list = list.filter(p=>p.name.toLowerCase().includes(q));
    renderProducts(list);
  });

  // init page: show welcome modal
  document.addEventListener('DOMContentLoaded', ()=>{
    // pre-render category buttons so user can click at any time
    renderCategoryButtons();
    showWelcome();
  });

})();
