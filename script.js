window.MENU_DATA = window.MENU_DATA || [];

/* FoodCosta Menu + Cart + Online Orders */

const SUPABASE_URL = "https://peyilmgpseriuyelbsde.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_XR7zqZg1a9Ch-0axfdRwaw_ppOhJT65";

function loadSupabase(){
  return new Promise((resolve,reject)=>{
    if(window.supabase) return resolve(window.supabase);
    const s=document.createElement("script");
    s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    s.onload=()=>window.supabase ? resolve(window.supabase) : reject(new Error("Supabase library did not load."));
    s.onerror=()=>reject(new Error("Could not load the order service. Check your internet connection."));
    document.head.appendChild(s);
  });
}

let sb = null;

const data = (window.MENU_DATA || []).map(group => ({
  ...group,
  items: [...group.items].sort((a,b)=>Number(a[1])-Number(b[1]))
}));

const grid = document.getElementById("menuGrid");
const search = document.getElementById("search");
const quickCats = document.getElementById("quickCats");

const imagePools = {
  "Dal & Curries": [
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1626509653291-18d5b5e7b6a5?auto=format&fit=crop&w=700&q=80"
  ],
  "Sabji Ki Bahar": [
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=700&q=80"
  ],
  "Paneer Specials": [
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=700&q=80"
  ],
  "Pizza": [
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=80"
  ],
  "Starters": [
    "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80"
  ],
  "Soups": [
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=700&q=80"
  ],
  "Momos": [
    "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=700&q=80"
  ],
  "Breads": [
    "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80"
  ],
  "Rice": [
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=700&q=80"
  ],
  "Paratha": [
    "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80"
  ],
  "Salad & Raita": [
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=700&q=80"
  ],
  "Sandwich": [
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1481070414801-51fd732d7184?auto=format&fit=crop&w=700&q=80"
  ],
  "Rolls & Wraps": [
    "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=700&q=80"
  ],
  "Pasta": [
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=700&q=80"
  ],
  "Maggi": [
    "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=700&q=80"
  ],
  "Nachos": [
    "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=700&q=80"
  ],
  "French Fries": [
    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=700&q=80"
  ],
  "Snacks": [
    "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=700&q=80"
  ],
  "Sweet Corn": [
    "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=700&q=80"
  ],
  "Potato Spirals": [
    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=700&q=80"
  ],
  "Chinese": [
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=700&q=80"
  ],
  "Noodles": [
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=700&q=80"
  ],
  "Burgers": [
    "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=700&q=80"
  ],
  "Hot Tea": [
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=700&q=80"
  ],
  "Ice Tea & Lemonades": [
    "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=700&q=80"
  ],
  "Mojito": [
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=700&q=80"
  ],
  "Shakes": [
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1553787499-6f913386027a?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=700&q=80"
  ],
  "Beverages": [
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80"
  ],
  "Desserts": [
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=700&q=80"
  ],
  "Thali": [
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=80"
  ],
  "Combos": [
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80"
  ],
  "default": [
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=700&q=80"
  ]
};

function dishImage(category, name){
  const pool = imagePools[category] || imagePools.default;
  let hash = 0;
  const key = `${category}|${name}`;
  for(let i=0;i<key.length;i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return pool[hash % pool.length];
}

function escapeHtml(s){return String(s ?? "").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function slug(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-");}
function money(v){return "₹"+Number(v||0).toLocaleString("en-IN");}

// ---------------- CART ----------------
let cart = JSON.parse(localStorage.getItem("foodcosta_cart") || "[]");

function saveCart(){localStorage.setItem("foodcosta_cart",JSON.stringify(cart));updateCartUI();}

function addToCart(name,price){
  const existing=cart.find(item=>item.name===name && Number(item.price)===Number(price));
  if(existing) existing.qty+=1;
  else cart.push({name,price:Number(price),qty:1});
  saveCart();
  showCartToast(`${name} added to cart`);
}
function changeQty(index,amount){if(!cart[index])return;cart[index].qty+=amount;if(cart[index].qty<=0)cart.splice(index,1);saveCart();}
function removeFromCart(index){cart.splice(index,1);saveCart();}
function cartTotals(){return {count:cart.reduce((s,i)=>s+i.qty,0),total:cart.reduce((s,i)=>s+i.price*i.qty,0)};}

function createCartUI(){
  if(document.getElementById("cartButton"))return;
  const button=document.createElement("button");
  button.id="cartButton";button.type="button";button.innerHTML=`🛒 Cart <span id="cartCount">0</span>`;
  document.body.appendChild(button);

  const overlay=document.createElement("div");overlay.id="cartOverlay";
  overlay.innerHTML=`
    <div class="cart-panel" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div class="cart-header"><div><h2>Your Cart</h2><span id="cartItemsLabel">0 items</span></div><button id="closeCart" type="button" aria-label="Close cart">×</button></div>
      <div id="cartItems" class="cart-items"></div>
      <div class="cart-footer">
        <div class="cart-total-row"><span>Total</span><strong id="cartTotal">₹0</strong></div>
        <button id="placeOrderBtn" class="place-order" type="button">Place Order</button>
        <button id="clearCart" class="clear-cart" type="button">Clear Cart</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  button.addEventListener("click",()=>overlay.classList.add("show"));
  overlay.addEventListener("click",e=>{if(e.target===overlay)overlay.classList.remove("show")});
  document.getElementById("closeCart").addEventListener("click",()=>overlay.classList.remove("show"));
  document.getElementById("clearCart").addEventListener("click",()=>{cart=[];saveCart();});
  document.getElementById("placeOrderBtn").addEventListener("click",openCheckout);

  const style=document.createElement("style");style.textContent=`
    .food-img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;background:#f1f1f1}.food-bottom{gap:10px}.food-bottom .add{white-space:nowrap;min-width:92px;padding:10px 12px;border:0;border-radius:9px;background:#111;color:#fff;font-weight:800;cursor:pointer;font-size:13px}.food-bottom .add:active{transform:scale(.97)}
    #cartButton{position:fixed;right:18px;bottom:18px;z-index:9998;border:0;border-radius:999px;padding:13px 18px;background:#111;color:#fff;font-weight:700;font-size:15px;box-shadow:0 8px 24px rgba(0,0,0,.22);cursor:pointer}
    #cartButton span{display:inline-flex;min-width:22px;height:22px;align-items:center;justify-content:center;margin-left:6px;border-radius:50%;background:#fff;color:#111;font-size:12px}
    #cartOverlay,#checkoutOverlay{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.45);display:flex;justify-content:flex-end;opacity:0;visibility:hidden;transition:.2s}
    #cartOverlay.show,#checkoutOverlay.show{opacity:1;visibility:visible}
    .cart-panel,.checkout-panel{width:min(430px,94vw);height:100%;background:#fff;display:flex;flex-direction:column;box-shadow:-10px 0 30px rgba(0,0,0,.18)}
    .cart-header,.checkout-header{display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid #eee}
    .cart-header h2,.checkout-header h2{margin:0 0 3px;font-size:22px}.cart-header span{font-size:13px;color:#777}
    #closeCart,#closeCheckout{border:0;background:#f2f2f2;width:38px;height:38px;border-radius:50%;font-size:26px;cursor:pointer}
    .cart-items{flex:1;overflow:auto;padding:14px 18px}.cart-row{display:grid;grid-template-columns:1fr auto;gap:12px;padding:14px 0;border-bottom:1px solid #eee}
    .cart-name{font-weight:700;font-size:15px;line-height:1.3}.cart-price{font-size:13px;color:#666;margin-top:4px}
    .cart-controls{display:flex;align-items:center;gap:8px}.cart-controls button{width:30px;height:30px;border:1px solid #ddd;border-radius:8px;background:#fafafa;cursor:pointer;font-size:18px}.cart-controls strong{min-width:20px;text-align:center}
    .cart-remove{border:0!important;background:transparent!important;color:#b00020!important;font-size:12px!important;width:auto!important}.cart-empty{text-align:center;color:#777;padding:60px 15px}
    .cart-footer{padding:18px;border-top:1px solid #eee;background:#fff}.cart-total-row{display:flex;justify-content:space-between;font-size:18px;margin-bottom:12px}.cart-total-row strong{font-size:21px}
    .place-order{width:100%;padding:13px;border:0;background:#111;color:#fff;border-radius:10px;cursor:pointer;font-weight:800;font-size:16px;margin-bottom:9px}.clear-cart{width:100%;padding:11px;border:1px solid #ddd;background:#fff;border-radius:10px;cursor:pointer;font-weight:700}
    .checkout-body{flex:1;overflow:auto;padding:18px}.checkout-body label{display:block;font-weight:700;font-size:13px;margin:0 0 6px}.checkout-body input,.checkout-body textarea,.checkout-body select{width:100%;box-sizing:border-box;padding:12px;border:1px solid #ddd;border-radius:10px;margin:0 0 14px;font:inherit}.checkout-body textarea{min-height:80px;resize:vertical}
    .checkout-summary{background:#f7f7f7;border-radius:12px;padding:12px;margin-bottom:16px;font-size:13px}.checkout-summary div{display:flex;justify-content:space-between;margin:5px 0}.checkout-total{font-weight:800;font-size:16px;border-top:1px solid #ddd;padding-top:8px;margin-top:8px}
    .submit-order{width:100%;padding:13px;border:0;background:#111;color:#fff;border-radius:10px;font-weight:800;font-size:16px;cursor:pointer}.submit-order:disabled{opacity:.6;cursor:wait}.order-msg{margin-top:10px;text-align:center;font-size:13px;min-height:20px}.success-msg{color:#147a35;font-weight:700}.error-msg{color:#b00020}.cart-toast{position:fixed;left:50%;bottom:85px;transform:translateX(-50%);z-index:10000;background:#111;color:#fff;padding:10px 16px;border-radius:10px;font-size:14px;box-shadow:0 5px 20px rgba(0,0,0,.2)}
    @media(max-width:600px){#cartButton{right:12px;bottom:12px}.cart-panel,.checkout-panel{width:94vw}}
  `;document.head.appendChild(style);
}

function updateCartUI(){
  const {count,total}=cartTotals();
  const countEl=document.getElementById("cartCount"),label=document.getElementById("cartItemsLabel"),totalEl=document.getElementById("cartTotal"),itemsEl=document.getElementById("cartItems");
  if(countEl)countEl.textContent=count;if(label)label.textContent=`${count} item${count===1?"":"s"}`;if(totalEl)totalEl.textContent=money(total);if(!itemsEl)return;
  if(!cart.length){itemsEl.innerHTML=`<div class="cart-empty">Your cart is empty.<br>Add some delicious food! 🍕</div>`;const p=document.getElementById("placeOrderBtn");if(p)p.disabled=true;return;}
  const p=document.getElementById("placeOrderBtn");if(p)p.disabled=false;
  itemsEl.innerHTML=cart.map((item,index)=>`<div class="cart-row"><div><div class="cart-name">${escapeHtml(item.name)}</div><div class="cart-price">${money(item.price)} × ${item.qty} = ${money(item.price*item.qty)}</div></div><div class="cart-controls"><button type="button" data-cart-action="minus" data-index="${index}">−</button><strong>${item.qty}</strong><button type="button" data-cart-action="plus" data-index="${index}">+</button><button type="button" class="cart-remove" data-cart-action="remove" data-index="${index}">Remove</button></div></div>`).join("");
  itemsEl.querySelectorAll("[data-cart-action]").forEach(btn=>btn.addEventListener("click",()=>{const i=Number(btn.dataset.index),a=btn.dataset.cartAction;if(a==="plus")changeQty(i,1);if(a==="minus")changeQty(i,-1);if(a==="remove")removeFromCart(i);}));
}
function showCartToast(message){const old=document.querySelector(".cart-toast");if(old)old.remove();const toast=document.createElement("div");toast.className="cart-toast";toast.textContent="✓ "+message;document.body.appendChild(toast);setTimeout(()=>toast.remove(),1600);}

// ---------------- CHECKOUT / SUPABASE ORDER ----------------
function openCheckout(){
  if(!cart.length){showCartToast("Cart is empty");return;}
  const old=document.getElementById("checkoutOverlay");if(old)old.remove();
  const total=cartTotals().total;
  const overlay=document.createElement("div");overlay.id="checkoutOverlay";
  overlay.innerHTML=`<div class="checkout-panel" role="dialog" aria-modal="true" aria-label="Place order">
    <div class="checkout-header"><div><h2>Place Your Order</h2><span>Enter your details</span></div><button id="closeCheckout" type="button">×</button></div>
    <div class="checkout-body">
      <div class="checkout-summary">${cart.map(i=>`<div><span>${escapeHtml(i.name)} × ${i.qty}</span><strong>${money(i.price*i.qty)}</strong></div>`).join("")}<div class="checkout-total"><span>Total</span><strong>${money(total)}</strong></div></div>
      <form id="checkoutForm">
        <label for="customerName">Name *</label><input id="customerName" required maxlength="80" placeholder="Your name">
        <label for="customerPhone">Mobile Number *</label><input id="customerPhone" required maxlength="20" inputmode="tel" placeholder="10 digit mobile number">
        <label for="orderType">Order Type *</label><select id="orderType"><option value="Delivery">Delivery</option><option value="Pickup">Pickup</option><option value="Dine-in">Dine-in</option></select>
        <label for="customerAddress">Address</label><textarea id="customerAddress" maxlength="300" placeholder="Delivery address (required for delivery)"></textarea>
        <label for="tableNo">Table Number</label><input id="tableNo" maxlength="20" placeholder="For dine-in only">
        <label for="orderNotes">Notes</label><textarea id="orderNotes" maxlength="300" placeholder="Any special instruction"></textarea>
        <button class="submit-order" id="submitOrder" type="submit">Confirm Order • ${money(total)}</button>
        <div id="orderMsg" class="order-msg"></div>
      </form>
    </div></div>`;
  document.body.appendChild(overlay);overlay.classList.add("show");
  document.getElementById("closeCheckout").onclick=()=>overlay.remove();
  overlay.addEventListener("click",e=>{if(e.target===overlay)overlay.remove()});
  document.getElementById("orderType").addEventListener("change",()=>toggleCheckoutFields());
  toggleCheckoutFields();
  document.getElementById("checkoutForm").addEventListener("submit",submitOrder);
}
function toggleCheckoutFields(){
  const type=document.getElementById("orderType")?.value;
  const address=document.getElementById("customerAddress"),table=document.getElementById("tableNo");
  if(!address||!table)return;
  address.required=type==="Delivery";table.required=type==="Dine-in";
  address.placeholder=type==="Delivery"?"Delivery address (required for delivery)":"Address (optional)";
  table.placeholder=type==="Dine-in"?"Table number (required)":"For dine-in only";
}

async function submitOrder(e){
  e.preventDefault();
  const msg=document.getElementById("orderMsg"),btn=document.getElementById("submitOrder");
  const name=document.getElementById("customerName").value.trim();
  const phone=document.getElementById("customerPhone").value.trim();
  const type=document.getElementById("orderType").value;
  const address=document.getElementById("customerAddress").value.trim();
  const table=document.getElementById("tableNo").value.trim();
  const notes=document.getElementById("orderNotes").value.trim();
  if(!name||!phone){msg.className="order-msg error-msg";msg.textContent="Name and mobile number are required.";return;}
  if(type==="Delivery"&&!address){msg.className="order-msg error-msg";msg.textContent="Please enter delivery address.";return;}
  if(type==="Dine-in"&&!table){msg.className="order-msg error-msg";msg.textContent="Please enter table number.";return;}
  if(!/^\+?[0-9\s-]{10,15}$/.test(phone)){msg.className="order-msg error-msg";msg.textContent="Please enter a valid mobile number.";return;}
  btn.disabled=true;btn.textContent="Sending Order...";msg.className="order-msg";msg.textContent="";
  try{
    if(!sb){const supabase=await loadSupabase();sb=supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);}
    const total=cartTotals().total;
    const {data:order,error:orderError}=await sb.from("orders").insert({customer_name:name,customer_phone:phone,customer_address:address,order_type:type,table_no:table,notes,total,status:"New"}).select("id").single();
    if(orderError)throw orderError;
    const items=cart.map(i=>({order_id:order.id,item_name:i.name,price:Number(i.price),quantity:Number(i.qty)}));
    const {error:itemError}=await sb.from("order_items").insert(items);
    if(itemError)throw itemError;
    cart=[];saveCart();
    msg.className="order-msg success-msg";msg.innerHTML=`Order placed successfully!<br>Order #${escapeHtml(order.id)}`;
    btn.textContent="Order Placed ✓";
    setTimeout(()=>{document.getElementById("checkoutOverlay")?.remove();document.getElementById("cartOverlay")?.classList.remove("show");},2200);
  }catch(err){
    console.error(err);msg.className="order-msg error-msg";msg.textContent=err?.message||"Order could not be placed. Please try again.";btn.disabled=false;btn.textContent=`Confirm Order • ${money(cartTotals().total)}`;
  }
}

createCartUI();

// ---------------- MENU ----------------
const allCats=data.map(x=>x.cat);
allCats.forEach(cat=>{const b=document.createElement("button");b.textContent=cat;b.dataset.cat=cat;quickCats.appendChild(b);});
quickCats.addEventListener("click",e=>{const btn=e.target.closest("button");if(!btn)return;document.querySelectorAll(".category-strip button").forEach(x=>x.classList.remove("active"));btn.classList.add("active");render(btn.dataset.cat,search.value);});
function render(selected="all",q=""){
  const term=q.trim().toLowerCase();
  const groups=data.filter(g=>selected==="all"||g.cat===selected).map(g=>({...g,items:g.items.filter(([name])=>name.toLowerCase().includes(term))})).filter(g=>g.items.length);
  if(!groups.length){grid.innerHTML=`<div class="empty">No dishes found. Try another search.</div>`;return;}
  grid.innerHTML=groups.map(g=>`<section class="menu-category" id="${slug(g.cat)}"><div class="category-title"><h3>${escapeHtml(g.cat)}</h3><span class="line"></span><span class="count">${g.items.length} items</span></div><div class="menu-grid">${g.items.map(([name,price])=>`<article class="food-card"><img class="food-img" loading="lazy" src="${dishImage(g.cat,name)}" alt="${escapeHtml(name)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=700&q=80'"><div class="food-info"><div class="food-name">${escapeHtml(name)}</div><div class="food-bottom"><span class="price">${money(price)}</span><button class="add" data-name="${escapeHtml(name)}" data-price="${price}" aria-label="Add ${escapeHtml(name)}">Add to Cart</button></div></div></article>`).join("")}</div></section>`).join("");
  grid.querySelectorAll(".add").forEach(btn=>btn.addEventListener("click",()=>addToCart(btn.dataset.name,Number(btn.dataset.price))));
}
search.addEventListener("input",()=>{const active=document.querySelector(".category-strip button.active");render(active?active.dataset.cat:"all",search.value);});
render();updateCartUI();

const menuToggle=document.querySelector(".menu-toggle");
if(menuToggle)menuToggle.addEventListener("click",()=>{const nav=document.getElementById("navLinks");const open=nav.style.display==="flex";nav.style.display=open?"none":"flex";if(!open){nav.style.position="absolute";nav.style.top="70px";nav.style.left="0";nav.style.right="0";nav.style.background="#faf8f4";nav.style.padding="20px 5vw";nav.style.flexDirection="column";nav.style.borderBottom="1px solid #e9e1d8";}});
