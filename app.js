const PETS = [
 {id:'bruno',name:'Bruno',type:'Dog',age:2,breed:'Labrador Retriever',gender:'Male',personality:'Playful, loyal, and always ready for a walk.',image:'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=85',status:'Ready to meet you'},
 {id:'luna',name:'Luna',type:'Cat',age:1,breed:'Persian',gender:'Female',personality:'A gentle soul who loves sunny windows and quiet cuddles.',image:'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=700&q=85',status:'Ready to meet you'},
 {id:'rocky',name:'Rocky',type:'Dog',age:3,breed:'Beagle',gender:'Male',personality:'Curious, kind-hearted, and happiest exploring outside.',image:'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=85',status:'Ready to meet you'},
 {id:'milo',name:'Milo',type:'Cat',age:2,breed:'Domestic Shorthair',gender:'Male',personality:'An easy-going companion with a big purr and bigger heart.',image:'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=700&q=85',status:'Ready to meet you'}
];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const read = key => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } };
const write = (key,value) => localStorage.setItem(key,JSON.stringify(value));
let currentFilter='All';
let toastTimer;
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2800);}
function currentUser(){try{return JSON.parse(localStorage.getItem('ph_user'))}catch{return null}}
function renderPets(){
 const query=($('#petSearch')?.value||'').trim().toLowerCase();
 const favorites=read('ph_favorites');
 const pets=PETS.filter(p=>(currentFilter==='All'||p.type===currentFilter)&&`${p.name} ${p.type} ${p.breed}`.toLowerCase().includes(query));
 $('#petGrid').innerHTML=pets.map(p=>`<article class="pet-card">
  <div class="pet-image-wrap"><img class="pet-image" src="${p.image}" alt="${p.name}, a ${p.breed}" loading="lazy" onerror="this.style.display='none'"><span class="pet-status">● ${p.status}</span>
  <button class="pet-heart ${favorites.includes(p.id)?'saved':''}" data-favorite="${p.id}" aria-label="${favorites.includes(p.id)?'Remove':'Save'} ${p.name}">${favorites.includes(p.id)?'♥':'♡'}</button></div>
  <div class="pet-info"><div class="pet-name-row"><h3>${p.name}</h3><span class="pet-age">${p.age} ${p.age===1?'year':'years'}</span></div>
  <p class="pet-meta">${p.breed} · ${p.gender}</p><div class="pet-card-bottom"><span>🐾 ${p.type} · Friendly</span><button data-adopt="${p.id}">Meet ${p.name} ↗</button></div></div></article>`).join('');
 $('#emptyState').classList.toggle('hidden',pets.length>0);
}
function setFilter(filter){currentFilter=filter;$$('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));renderPets();}
function openModal(content){$('#modalContent').innerHTML=content;$('#modalBackdrop').classList.remove('hidden');document.body.style.overflow='hidden';}
function closeModal(){$('#modalBackdrop').classList.add('hidden');document.body.style.overflow='';}
function updateAccountNav(){const user=currentUser();$('#navAccount').innerHTML=user?`Hi, ${escapeHtml(user.name.split(' ')[0])} <span>↗</span>`:'Sign in <span>↗</span>';$('#navAccount').href='#login';}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function showAuth(mode='login'){
 const register=mode==='register';
 openModal(`<span class="eyebrow">WELCOME TO PAWS & HEARTS</span><h2>${register?'Create your account.':'Welcome back.'}</h2><p>${register?'Join a community that puts pets first.':'Sign in to manage your adoption requests and saved pets.'}</p>
 <form class="modal-form" id="authForm">${register?`<label>Full name<input name="name" autocomplete="name" required minlength="2" placeholder="Your full name"></label>`:''}
 <label>Email address<input name="email" type="email" required autocomplete="email" placeholder="you@example.com"></label>
 <label>Password<input name="password" type="password" required minlength="6" autocomplete="${register?'new-password':'current-password'}" placeholder="At least 6 characters"></label>
 ${register?`<label>Phone (optional)<input name="phone" type="tel" pattern="[0-9+() -]{7,18}" placeholder="Phone number"></label>`:''}
 <button class="button button-dark" type="submit">${register?'Create account':'Sign in'} <span>→</span></button></form>
 <p class="modal-switch">${register?'Already have an account?':'New to Paws & Hearts?'} <a class="inline-link" href="#" id="switchAuth">${register?'Sign in':'Create an account'}</a></p>
 <p class="modal-switch">Demo note: account data is stored only in this browser.</p>`);
 $('#switchAuth').onclick=e=>{e.preventDefault();showAuth(register?'login':'register');};
 $('#authForm').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.currentTarget),email=String(fd.get('email')).trim().toLowerCase(),password=String(fd.get('password'));
 if(register){const users=read('ph_users');if(users.some(u=>u.email===email)){toast('An account with this email already exists.');return;}
 const user={name:String(fd.get('name')).trim(),email,phone:String(fd.get('phone')||'')};users.push({...user,password});write('ph_users',users);localStorage.setItem('ph_user',JSON.stringify(user));}
 else {const user=read('ph_users').find(u=>u.email===email&&u.password===password);if(!user){toast('Email or password is incorrect. Register first if this is your first visit.');return;}const {password:ignore,...safe}=user;localStorage.setItem('ph_user',JSON.stringify(safe));}
 updateAccountNav();closeModal();toast(register?'Account created successfully!':'You are signed in.');};
}
function openAdoption(petId){const pet=PETS.find(p=>p.id===petId);if(!pet)return;const user=currentUser();if(!user){toast('Please sign in to send an adoption request.');showAuth('login');return;}
 openModal(`<span class="eyebrow">A NEW CHAPTER AWAITS</span><h2>Meet ${pet.name}.</h2><img class="modal-pet" src="${pet.image}" alt="${pet.name}"><p>${pet.personality}</p><form class="modal-form" id="adoptForm"><label>Your name<input name="name" value="${escapeHtml(user.name)}" required></label><label>Email<input name="email" type="email" value="${escapeHtml(user.email)}" required></label><label>Why would you like to adopt ${pet.name}?<textarea name="message" rows="3" required minlength="10" placeholder="Tell us a little about your home and plans for pet care."></textarea></label><button class="button button-dark" type="submit">Send adoption request <span>→</span></button></form>`);
 $('#adoptForm').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.currentTarget),requests=read('ph_requests');requests.unshift({id:Date.now(),petId:pet.id,petName:pet.name,userEmail:user.email,name:String(fd.get('name')).trim(),message:String(fd.get('message')).trim(),date:new Date().toLocaleDateString(),status:'Submitted'});write('ph_requests',requests);closeModal();toast(`Your request for ${pet.name} has been saved!`);};
}
function showAccount(){const user=currentUser();if(!user){showAuth();return;}const requests=read('ph_requests').filter(r=>r.userEmail===user.email);const favorites=read('ph_favorites').map(id=>PETS.find(p=>p.id===id)).filter(Boolean);
 openModal(`<span class="eyebrow">YOUR PAWS & HEARTS SPACE</span><h2>Hello, ${escapeHtml(user.name.split(' ')[0])}.</h2><p>Manage your details, saved companions, and adoption requests.</p><div class="account-panel"><strong>Profile details</strong><p>${escapeHtml(user.name)} · ${escapeHtml(user.email)}</p><button class="inline-link" id="editProfile">Edit profile</button></div><h3>Saved pets (${favorites.length})</h3><p>${favorites.length?favorites.map(p=>escapeHtml(p.name)).join(' · '):'Tap the heart on any pet card to save a favourite.'}</p><h3>Adoption requests (${requests.length})</h3><div class="request-list">${requests.length?requests.map(r=>`<div class="request-item"><b>${escapeHtml(r.petName)} — ${escapeHtml(r.status)}</b><span>Submitted ${escapeHtml(r.date)}</span></div>`).join(''):'<p>You have not submitted an adoption request yet.</p>'}</div><button class="button button-dark" id="logoutBtn">Sign out <span>↗</span></button>`);
 $('#editProfile').onclick=()=>{openModal(`<span class="eyebrow">YOUR DETAILS</span><h2>Edit profile.</h2><form class="modal-form" id="profileForm"><label>Full name<input name="name" required value="${escapeHtml(user.name)}"></label><label>Email address<input type="email" name="email" required value="${escapeHtml(user.email)}" disabled></label><label>Phone<input name="phone" value="${escapeHtml(user.phone||'')}"></label><button class="button button-dark">Save changes →</button></form>`);$('#profileForm').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.currentTarget),updated={...user,name:String(fd.get('name')).trim(),phone:String(fd.get('phone')||'')};localStorage.setItem('ph_user',JSON.stringify(updated));const users=read('ph_users').map(u=>u.email===updated.email?{...u,...updated}:u);write('ph_users',users);updateAccountNav();showAccount();toast('Profile updated.');};};
 $('#logoutBtn').onclick=()=>{localStorage.removeItem('ph_user');updateAccountNav();closeModal();toast('You have signed out.');};
}
document.addEventListener('click',e=>{
 const filter=e.target.closest('[data-filter]');if(filter){setFilter(filter.dataset.filter);return;}
 const fav=e.target.closest('[data-favorite]');if(fav){const id=fav.dataset.favorite;let items=read('ph_favorites');items=items.includes(id)?items.filter(x=>x!==id):[...items,id];write('ph_favorites',items);renderPets();toast(items.includes(id)?'Pet saved to your favourites.':'Pet removed from favourites.');return;}
 const adopt=e.target.closest('[data-adopt]');if(adopt){openAdoption(adopt.dataset.adopt);return;}
 const nav=e.target.closest('a[href="#login"]');if(nav){e.preventDefault();showAccount();}
});
$('#petSearch').addEventListener('input',renderPets);
$('#clearFilters').addEventListener('click',e=>{e.preventDefault();$('#petSearch').value='';setFilter('All');});
$('#menuToggle').addEventListener('click',()=>$('#mainNav').classList.toggle('open'));
$$('#mainNav a').forEach(a=>a.addEventListener('click',()=>$('#mainNav').classList.remove('open')));
$('#modalClose').addEventListener('click',closeModal);
$('#modalBackdrop').addEventListener('click',e=>{if(e.target===$('#modalBackdrop'))closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
$('#newsletterForm').addEventListener('submit',e=>{e.preventDefault();const email=$('#newsletterEmail').value.trim().toLowerCase();const subs=read('ph_subscribers');if(!subs.includes(email)){subs.push(email);write('ph_subscribers',subs);}e.target.reset();toast('You are on the list — thanks for caring!');});
renderPets();updateAccountNav();
