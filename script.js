let currentLang = 'ko';
let currentPage = 'home';
let characters = [];
let translations = {};

async function initApp() {
    try {
        const charRes = await fetch('data/characters.json');
        const transRes = await fetch('data/translations.json');
        
        if (!charRes.ok || !transRes.ok) throw new Error("JSON load failed");
        
        characters = await charRes.json();
        translations = await transRes.json();
        render(); 
    } catch (e) {
        document.getElementById('app-view').innerHTML = `<h2 style="text-align:center; color:#ff4b2b; margin-top:50px;">Data Load Failed</h2>`;
        console.error(e);
    }
}

// 사이드바 토글 (이벤트 전파 방지 추가)
function toggleSidebar(event) {
    if (event) event.stopPropagation(); 
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('main-content').classList.toggle('pushed');
}

// --- [추가: 외부 클릭 시 닫기] ---
document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggle-btn');
    
    // 사이드바가 열려있고, 클릭한 곳이 사이드바 내부가 아니며, 버튼도 아닐 때
    if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('active');
        document.getElementById('main-content').classList.remove('pushed');
    }
});

function changeLang(lang) {
    currentLang = lang;
    render();
}

function navigateTo(page) {
    currentPage = page;
    render();
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('main-content').classList.remove('pushed');
    }
}

// --- [추가: 하이라이트 위치 이동 함수] ---
function updateHighlight() {
    const activeItem = document.querySelector('.nav-item.active');
    const highlight = document.getElementById('nav-highlight');
    if (activeItem && highlight) {
        const yPos = activeItem.offsetTop;
        highlight.style.transform = `translateY(${yPos}px)`;
    }
}

function render() {
    const texts = translations[currentLang];
    if(!texts) return;

    const app = document.getElementById('app-view');
    const menu = document.getElementById('nav-menu');

    // 하이라이트 div를 메뉴 최상단에 추가
    menu.innerHTML = `
        <div id="nav-highlight"></div>
        <div class="nav-item ${currentPage === 'home' ? 'active' : ''}" onclick="navigateTo('home')">${texts.nav_home}</div>
        <div class="nav-item ${currentPage === 'characters' ? 'active' : ''}" onclick="navigateTo('characters')">${texts.nav_chars}</div>
        <div class="nav-item ${currentPage === 'guide' ? 'active' : ''}" onclick="navigateTo('guide')">${texts.nav_guide}</div>
        <div class="nav-item ${currentPage === 'tierlist' ? 'active' : ''}" onclick="navigateTo('tierlist')">${texts.nav_tierlist}</div>
    `;

    // 렌더링 후 하이라이트 위치 업데이트
    setTimeout(updateHighlight, 10);

    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    if(document.getElementById(`lang-${currentLang}`)) document.getElementById(`lang-${currentLang}`).classList.add('active');

    // ... (이하 기존 render 로직 유지: 홈, 캐릭터, 가이드, 티어표 등)
    if (currentPage === 'home') {
        app.innerHTML = `
            <div style="text-align: center;">
                <h1 style="font-family: 'Black Han Sans'; font-size: 4rem; color: #3b82f6; margin-bottom:20px;">${texts.home_welcome}</h1>
                <p style="font-size: 1.2rem; color: #64748b;">${texts.home_desc}</p>
                <div style="margin-top: 50px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; text-align: left;">
                    <div style="background: #161922; padding: 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);">
                        <h3 style="color: #fff;">${texts.home_update_title}</h3>
                        <p style="color: #94a3b8; font-size: 0.85rem; margin-top:10px;">${texts.home_update_1}<br>${texts.home_update_2}</p>
                    </div>
                    <div style="background: #161922; padding: 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);">
                        <h3 style="color: #fff;">${texts.home_tip_title}</h3>
                        <p style="color: #94a3b8; font-size: 0.85rem; margin-top:10px;">${texts.home_tip_desc}</p>
                    </div>
                </div>
            </div>`;
    } 
    else if (currentPage === 'characters') {
        let html = `<h1 style="font-family: 'Black Han Sans'; font-size: 3rem; margin-bottom: 40px; text-align:center;">${texts.nav_chars}</h1>`;
        const positions = [{k:'WS', n:texts.ws}, {k:'SE', n:texts.se}, {k:'MB', n:texts.mb}];
        positions.forEach(pos => {
            html += `<div style="margin-bottom: 50px; width:100%;">
                <h2 style="font-size: 1.5rem; color: #3b82f6; margin-bottom: 20px; border-bottom: 1px solid rgba(59, 130, 246, 0.2); padding-bottom: 10px; text-align:left;">${pos.n}</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 25px;">`;
            characters.filter(c => c.position === pos.k).forEach(char => {
                html += `<div class="char-card" style="width:100px; text-align:center;">
                    <div class="img-box" style="width:100px; height:125px; border-radius:15px; border:1px solid rgba(255,255,255,0.1); overflow:hidden;"><img src="images/${char.img}" style="width:100%; height:100%; object-fit:cover;"></div>
                    <div style="margin-top:10px; font-size:13px; font-weight:bold; color:#fff;">${char.name[currentLang]}</div>
                </div>`;
            });
            html += `</div></div>`;
        });
        app.innerHTML = html;
    }
    else if (currentPage === 'guide') {
        app.innerHTML = `<h1 style="font-family: 'Black Han Sans'; font-size: 3rem; margin-bottom: 40px; text-align:center;">${texts.guide_title}</h1>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
                <div style="background: #161922; padding: 30px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);">
                    <h3 style="color: #3b82f6; margin-bottom: 15px;">${texts.guide_role_title}</h3>
                    <p style="color: #94a3b8; font-size: 0.9rem; line-height:2.2;"><b>WS:</b> ${texts.guide_ws_desc}<br><b>SE:</b> ${texts.guide_se_desc}<br><b>MB:</b> ${texts.guide_mb_desc}</p>
                </div>
                <div style="background: #161922; padding: 30px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);">
                    <h3 style="color: #f9d423; margin-bottom: 15px;">${texts.guide_usage_title}</h3>
                    <p style="color: #94a3b8; font-size: 0.9rem; line-height:1.8;">${texts.guide_usage_desc}</p>
                </div>
            </div>`;
    }
    else if (currentPage === 'tierlist') {
        renderTierList(app, texts);
    }
}

function renderTierList(container, texts) {
    const tiers = ["S+", "S", "A+", "A"];
    const positions = ["WS", "SE", "MB"];
    let html = `<h1 style="width:100%; text-align:center; font-family:'Black Han Sans'; font-size:3.5rem; margin-bottom:50px; letter-spacing:-1px;">${texts.nav_tierlist}</h1>`;
    html += `<div class="table-wrapper"><table class="tier-table"><thead><tr><th style="width:120px;">${texts.tier}</th><th style="width:310px;">${texts.ws}</th><th style="width:310px;">${texts.se}</th><th style="width:310px;">${texts.mb}</th></tr></thead><tbody>`;
    tiers.forEach(t => {
        html += `<tr><td class="tier-label t-${t.replace('+', 'plus')}">${t}</td>`;
        positions.forEach(p => {
            html += `<td class="char-cell"><div class="char-grid">`;
            characters.filter(c => c.tier === t && c.position === p).forEach(char => {
                const gradeClass = char.grade.replace('+', 'plus').replace('-', 'minus');
                const tierClass = t.replace('+', 'plus');
                html += `<div class="char-card card-${tierClass}"><div class="img-box"><img src="images/${char.img}" onerror="this.src='https://via.placeholder.com/80x100'"><div class="grade-tag grade-${gradeClass}">${char.grade}</div></div><div class="char-name">${char.name[currentLang]}</div></div>`;
            });
            html += `</div></td>`;
        });
        html += `</tr>`;
    });
    container.innerHTML = html + `</tbody></table></div>`;
}

initApp();
