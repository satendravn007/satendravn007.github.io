const data = (window.MENU_DATA || []).map(group => ({
  ...group,
  items: [...group.items].sort((a, b) => Number(a[1]) - Number(b[1]))
}));
const grid = document.getElementById("menuGrid");
const search = document.getElementById("search");
const quickCats = document.getElementById("quickCats");

const imageMap = {
  "Pizza":"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80",
  "Burgers":"https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80",
  "Momos":"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80",
  "Noodles":"https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=700&q=80",
  "Chinese":"https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=700&q=80",
  "Rice":"https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=700&q=80",
  "Dal & Curries":"https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=700&q=80",
  "Paneer Specials":"https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80",
  "Sandwich":"https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80",
  "Pasta":"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=80",
  "French Fries":"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80",
  "Shakes":"https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80",
  "Mojito":"https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=700&q=80",
  "Desserts":"https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=700&q=80",
  "Beverages":"https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=700&q=80",
  "Soups":"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80",
  "default":"https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=700&q=80"
};

const allCats = data.map(x => x.cat);
allCats.forEach(cat => {
  const b = document.createElement("button");
  b.textContent = cat;
  b.dataset.cat = cat;
  quickCats.appendChild(b);
});
quickCats.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if(!btn) return;
  document.querySelectorAll(".category-strip button").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");
  render(btn.dataset.cat, search.value);
});

function escapeHtml(s){
  return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,"-");}

function render(selected="all", q=""){
  const term = q.trim().toLowerCase();
  const groups = data.filter(g => selected==="all" || g.cat===selected).map(g=>{
    const items = g.items.filter(([name])=>name.toLowerCase().includes(term));
    return {...g,items};
  }).filter(g=>g.items.length);

  if(!groups.length){
    grid.innerHTML = `<div class="empty">No dishes found. Try another search.</div>`;
    return;
  }

  grid.innerHTML = groups.map(g => `
    <section class="menu-category" id="${slug(g.cat)}">
      <div class="category-title"><h3>${escapeHtml(g.cat)}</h3><span class="line"></span><span class="count">${g.items.length} items</span></div>
      <div class="menu-grid">
      ${g.items.map(([name,price],i)=>`
        <article class="food-card">
          <img class="food-img" loading="lazy" src="${imageMap[g.cat]||imageMap.default}" alt="${escapeHtml(name)}">
          <div class="food-info">
            <div class="food-name">${escapeHtml(name)}</div>
            <div class="food-bottom"><span class="price">₹${price}</span><button class="add" aria-label="Add ${escapeHtml(name)}">+</button></div>
          </div>
        </article>`).join("")}
      </div>
    </section>`).join("");
}
search.addEventListener("input",()=>render(document.querySelector(".category-strip button.active").dataset.cat,search.value));
render();

document.querySelector(".menu-toggle").addEventListener("click",()=>{
  const nav=document.getElementById("navLinks");
  const open=nav.style.display==="flex";
  nav.style.display=open?"none":"flex";
  if(!open){nav.style.position="absolute";nav.style.top="70px";nav.style.left="0";nav.style.right="0";nav.style.background="#faf8f4";nav.style.padding="20px 5vw";nav.style.flexDirection="column";nav.style.borderBottom="1px solid #e9e1d8";}
});
