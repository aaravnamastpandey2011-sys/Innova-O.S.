var isN = false;
var z = 100;

function tck() {
    var c = document.getElementById('p_clk');
    var d = new Date();
    c.textContent = d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0');
}
setInterval(tck, 1000); tck();

function p_sm() {
    isN = !isN;
    document.getElementById('p_lt').innerText = isN ? "Create OS ID" : "Innova OS";
    document.querySelector('#p_af button').innerText = isN ? "Sign Up" : "Sign In";
    document.getElementById('p_tm').innerText = isN ? "Back to Login" : "New Account";
}

function p_lg() {
    var u = document.getElementById('p_em').value;
    var p = document.getElementById('p_pw').value;
    if (isN) {
        localStorage.setItem('sys_u', JSON.stringify({u:u, p:p}));
        alert("Account Created!"); p_sm();
    } else {
        var s = JSON.parse(localStorage.getItem('sys_u'));
        if ((s && s.u === u && s.p === p) || (u === "admin" && p === "admin")) {
            document.getElementById('p_ls').style.display='none';
        } else {
            alert("Error: Access Denied");
        }
    }
}

function p_app(app, ico) {
    var h = document.getElementById('p_wl');
    var w = document.createElement('div');
    var id = "w-" + Math.random().toString(36).slice(2);
    w.id = id; w.className = 'win';
    w.style.zIndex = ++z;
    w.style.top = "120px";
    w.style.left = "50%";
    w.style.transform = "translateX(-50%)";

    w.onmousedown = function() { w.style.zIndex = ++z; };

    var body = "";
    if (app === 'notepad') {
        body = '<textarea id="nt" style="width:100%; height:220px; border:none; outline:none; background:transparent; font-size:14px;">' + (localStorage.getItem('sys_n')||"") + '</textarea><button onclick="p_sn()" style="margin-top:12px; padding:6px 15px; cursor:pointer; background:#16a34a; color:white; border:none; border-radius:4px;">Save Disk</button>';
    } 
    else if (app === 'calc') {
        body = '<input id="sr" readonly style="width:100%; margin-bottom:10px; text-align:right; font-size:26px; padding:8px; background:#f9f9f9; border:1px solid #ddd; border-radius:5px;"><div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px;">';
        var k = ['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'];
        for(var i=0; i<k.length; i++) body += '<button onclick="p_mt(\''+k[i]+'\')" style="padding:15px; cursor:pointer; border-radius:5px; border:1px solid #ddd;">'+k[i]+'</button>';
        body += '</div>';
    }
    else if (app === 'camera') {
        body = '<video id="cam_v" autoplay style="width:100%; background:black; border-radius:8px;"></video><canvas id="cam_c" style="display:none;"></canvas><button onclick="p_cp()" style="margin-top:10px; width:100%; padding:8px; background:#ef4444; color:white; border:none; border-radius:4px; cursor:pointer;">Capture & Save</button>';
        setTimeout(() => {
            navigator.mediaDevices.getUserMedia({video:true}).then(s => { document.getElementById('cam_v').srcObject = s; }).catch(e => { alert("Camera error: " + e); });
        }, 100);
    }
    else if (app === 'files') {
        var n = localStorage.getItem('sys_n') ? "user_document.txt" : "No notes";
        var p = localStorage.getItem('sys_p') ? "captured_photo.jpg" : "No photos";
        body = '<div style="display:flex; height:250px;"><div style="width:35%; border-right:1px solid #ddd; padding:12px; font-size:12px; background:#f5f5f5;"><b>Quick Access</b><br><br>📂 Desktop<br>📂 Documents<br>📂 Photos</div><div style="width:65%; padding:15px;"><div onclick="p_app(\'notepad\', \'📝\')" style="cursor:pointer; padding:8px; border-bottom:1px solid #eee;">📄 '+n+'</div><div onclick="p_vp()" style="cursor:pointer; padding:5px; border-bottom:1px solid #eee;">🖼️ '+p+'</div></div></div>';
    }
    else if (app === 'browser') {
        body = '<div style="background:#eee; padding:8px; display:flex; gap:8px; border-radius:5px; margin-bottom:10px;"><input id="url" type="text" value="https://www.wikipedia.org" style="flex-grow:1; padding:4px 10px; border-radius:15px; border:1px solid #ccc;" onkeypress="if(event.key===\'Enter\')p_go(this.nextElementSibling)"><button onclick="p_go(this)">Go</button></div><div style="font-size:10px; color:#666; margin-bottom:5px;">💡 Search Tip: Some sites (Google) block embedding. Try Wikipedia or DuckDuckGo.</div><iframe src="https://www.wikipedia.org" style="width:100%; height:320px; border:none; border-radius:8px; background:white;"></iframe>';
    }
    else if (app === 'terminal') {
        body = '<div id="to" style="background:#0f172a; color:#4ade80; height:200px; padding:15px; font-family:monospace; overflow:auto; border-radius:8px; line-height:1.5;">Innova OS [Secure Shell]<br>Ready for command...</div><input id="ti" style="width:100%; background:#0f172a; color:white; border:none; outline:none; font-family:monospace; padding:10px; margin-top:5px; border-radius:4px;" onkeypress="p_rt(event)">';
    }
    else if (app === 'ai') {
        body = '<div id="ai_o" style="background:#f0f7ff; color:#000; height:200px; padding:12px; font-size:13px; overflow:auto; border-radius:8px; border:1px solid #cce;"><b>Innova Assistant:</b> Hello! I am your AI. How can I help you?</div><input id="ai_i" style="width:100%; padding:10px; margin-top:8px; border:1px solid #ccc; border-radius:5px;" placeholder="Ask me something..." onkeypress="if(event.key===\'Enter\')p_ai()">';
    }

    w.innerHTML = '<div class="h"><span>'+ico+' '+app.toUpperCase()+'</span><div><button onclick="p_sz(\''+id+'\', \'min\')">_</button><button style="background:#ef4444; color:white;" onclick="this.closest(\'.win\').remove()">X</button></div></div><div style="padding:15px;">'+body+'</div>';
    
    h.appendChild(w); p_at(app, ico, id); drag(w);
}

function p_go(b) {
    var u = b.previousElementSibling.value;
    if (!u.includes('.') || !u.includes('://')) u = "https://duckduckgo.com/?q=" + encodeURIComponent(u);
    else if (!u.startsWith('http')) u = "https://" + u;
    b.closest('.win').querySelector('iframe').src = u;
}

function p_cp() {
    var v = document.getElementById('cam_v');
    var c = document.getElementById('cam_c');
    if(!v) return;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    localStorage.setItem('sys_p', c.toDataURL('image/jpeg'));
    alert("Snapshot saved to Photos!");
}

function p_vp() {
    var p = localStorage.getItem('sys_p');
    if (p) {
        var w = document.createElement('div');
        w.className = 'win'; w.style.zIndex = ++z; w.style.top = "150px"; w.style.left = "55%"; w.style.transform = "translateX(-50%)";
        w.innerHTML = '<div class="h"><span>🖼️ PHOTO VIEW</span><div><button onclick="this.closest(\'.win\').remove()">X</button></div></div><div style="padding:10px;"><img src="'+p+'" style="width:100%; border-radius:5px;"></div>';
        document.getElementById('p_wl').appendChild(w); drag(w);
    } else alert("No photo found!");
}

function p_rt(e) {
    if (e.key === 'Enter') {
        var i = e.target; var o = i.previousElementSibling;
        var c = i.value.toLowerCase(); o.innerHTML += "<br>> " + c;
        if (c === 'help') o.innerHTML += "<br>cmds: help, cls, date, whoami, exit";
        else if (c === 'cls') o.innerHTML = "Shell Cleared";
        else if (c === 'date') o.innerHTML += "<br>" + new Date();
        else if (c === 'whoami') o.innerHTML += "<br>Root_Admin";
        else if (c === 'exit') i.closest('.win').remove();
        else o.innerHTML += "<br>Unknown Error: '" + c + "' not found";
        i.value = ""; o.scrollTop = o.scrollHeight;
    }
}

function p_ai() {
    var i = document.getElementById('ai_i'); var o = document.getElementById('ai_o');
    var q = i.value.toLowerCase(); o.innerHTML += "<br><br><span style='color:#0078d4'><b>You:</b> " + i.value + "</span>";
    var a = "";
    
    if (q.includes("open") || q.includes("launch")) {
        var t = "";
        if (q.includes("note")) { p_app('notepad', '📝'); t = "Notepad"; }
        else if (q.includes("calc")) { p_app('calc', '🧮'); t = "Calculator"; }
        else if (q.includes("web") || q.includes("browser")) { p_app('browser', '🌐'); t = "Browser"; }
        else if (q.includes("file")) { p_app('files', '📁'); t = "File Explorer"; }
        else if (q.includes("term") || q.includes("cmd")) { p_app('terminal', '💻'); t = "Terminal"; }
        else if (q.includes("cam")) { p_app('camera', '📷'); t = "Camera"; }
        if (t) a = "System: " + t + " process initiated. Stand by.";
    }
    else if (q.includes("background") || q.includes("theme") || q.includes("color")) {
        var c = q.split(' ').pop();
        document.body.style.background = c;
        document.body.style.backgroundImage = "none";
        a = "System: Desktop environment recalibrated to '" + c + "'.";
    }
    else if (q.includes("close all")) {
        document.querySelectorAll('.win').forEach(w => w.remove());
        document.getElementById('p_tb').innerHTML = "";
        a = "System: All processes terminated. Desktop cleared.";
    }
    else if (q.includes("health")) a = "Status: Virtual Core optimized. 0 latency detected.";
    else if (q.includes("hello")) a = "Greetings, Admin. Systems are at your command.";
    else if (q.includes("clear")) { o.innerHTML = "History purged."; return; }
    else {
        a = "Analyzing unknown query... Redirecting to global web nodes for answer.";
        p_app('browser', '🌐');
        setTimeout(() => {
            var f = document.querySelectorAll('iframe');
            var l = f[f.length-1]; if(l) l.src = "https://duckduckgo.com/?q=" + encodeURIComponent(i.value);
        }, 500);
    }

    if(a) { 
        var d = document.createElement('div'); d.innerHTML = "<b>Innova:</b> " + a;
        o.appendChild(d); o.scrollTop = o.scrollHeight;
    }
    i.value = "";
}

function p_sr(q) {
    var icons = document.querySelectorAll('.unit');
    icons.forEach(i => {
        var name = i.querySelector('span').innerText.toLowerCase();
        i.style.display = name.includes(q.toLowerCase()) ? "block" : "none";
    });
}

function p_sz(id, m) { 
    var el = document.getElementById(id); 
    var tab = document.getElementById("tab-" + id);
    if (m === 'min') {
        el.style.display = 'none'; 
        if(tab) tab.style.borderBottom = "none";
    }
}

function p_at(n, i, id) { 
    var b = document.getElementById('p_tb'); var t = document.createElement('div'); t.className = 't-t'; 
    t.innerHTML = i; t.id = "tab-" + id;
    t.onclick = function() { 
        var el = document.getElementById(id); 
        if(el) {
            var isHid = el.style.display === 'none';
            el.style.display = isHid ? 'block' : 'none';
            t.style.borderBottom = isHid ? "2px solid #0078d4" : "none";
            if(isHid) { el.style.zIndex = ++z; }
        }
    }; 
    b.appendChild(t); 
    t.style.borderBottom = "2px solid #0078d4";
}

function p_ts() { document.getElementById('p_sf').classList.toggle('active'); }
function p_sn() { localStorage.setItem('sys_n', document.getElementById('nt').value); alert("Disk Written Successfully!"); }
function p_mt(v) { var s = document.getElementById('sr'); if(v==='=') s.value=eval(s.value)||''; else if(v==='C') s.value=''; else s.value+=v; }

function p_rc(e) { 
    e.preventDefault(); var m = document.getElementById('p_cm'); 
    m.style.display="block"; m.style.left=e.clientX+"px"; m.style.top=e.clientY+"px"; 
}
document.onclick = function() { document.getElementById('p_cm').style.display="none"; }

function drag(el) {
    var h = el.querySelector('.h'); h.onmousedown = function(e) {
        var ox = e.clientX, oy = e.clientY;
        document.onmousemove = function(e) {
            var dx = ox-e.clientX, dy = oy-e.clientY; ox = e.clientX; oy = e.clientY;
            el.style.top = (el.offsetTop-dy)+"px"; el.style.left = (el.offsetLeft-dx)+"px";
            el.style.transform = "none";
        };
        document.onmouseup = function() { document.onmousemove = null; };
    };
}
