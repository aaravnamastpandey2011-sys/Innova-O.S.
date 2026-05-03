var topLayer = 100;

function showClock() {
    var c = document.getElementById('time_clock');
    var d = new Date();
    c.textContent = d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0');
}
setInterval(showClock, 1000); showClock();

function handleLogin() {
    var p = document.getElementById('pass_field').value;
    if (p === 'admin') document.getElementById('lock_screen').style.display='none';
    else alert("Try 'admin'");
}

function openApp(app, ico) {
    var h = document.getElementById('win_layer');
    var w = document.createElement('div');
    var id = "win-" + Math.random().toString(36).slice(2);
    w.id = id; w.className = 'window';
    w.style.zIndex = ++topLayer;

    // CENTER THE WINDOW ON OPENING
    w.style.top = "100px";
    w.style.left = "50%";
    w.style.transform = "translateX(-50%)";

    w.onmousedown = function() { w.style.zIndex = ++topLayer; };

    var body = "";
    if (app === 'notepad') body = '<textarea id="nt" style="width:100%; height:150px; border:none; outline:none; background:transparent;">' + (localStorage.getItem('my_note')||"") + '</textarea><button onclick="saveNote()">Save</button>';
    else if (app === 'calc') {
        body = '<input id="sr" readonly style="width:100%; margin-bottom:5px; text-align:right;"><div style="display:grid; grid-template-columns:repeat(4,1fr); gap:2px;">';
        var k = ['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'];
        for(var i=0; i<k.length; i++) body += '<button onclick="math(\''+k[i]+'\')" style="padding:10px;">'+k[i]+'</button>';
        body += '</div>';
    }
    else if (app === 'terminal') body = '<div id="to" style="background:black; color:lime; height:150px; padding:5px; font-family:monospace; overflow:auto;">Terminal ready...</div><input id="ti" style="width:100%; background:black; color:white; border:none;" onkeypress="runTerm(event)">';
    else if (app === 'files') {
        var noteExists = localStorage.getItem('my_note') ? "✅ user_note.txt" : "❌ Empty";
        body = `
            <div style="display:flex; height:200px;">
                <div style="width:30%; border-right:1px solid #ddd; padding:5px; font-size:12px;">
                    <b>Quick Access</b><br>
                    📁 Desktop<br>📁 Documents<br>📁 C: Drive
                </div>
                <div style="width:70%; padding:10px;">
                    <div class="file-row" onclick="alert('Opening Documents...')">📂 My Documents</div>
                    <div class="file-row" onclick="openApp('notepad', '📝')">📄 ${noteExists}</div>
                    <div class="file-row" onclick="alert('Disk is empty')">📄 system_log.log</div>
                </div>
            </div>
        `;
    }

    w.innerHTML = `
        <div class="window-top"><span>${ico} ${app.toUpperCase()}</span>
            <div><button onclick="sz('${id}', 'min')">_</button><button style="background:red; color:white;" onclick="this.closest('.window').remove()">X</button></div>
        </div>
        <div style="padding:15px;">${body}</div>`;
    
    h.appendChild(w); addTab(app, ico, id); drag(w);

}

function sz(id, m) { var el = document.getElementById(id); if (m === 'min') el.style.display = 'none'; }

function addTab(n, i, id) {
    var b = document.getElementById('taskbar_items'); var t = document.createElement('div'); t.className = 'task-tab';
    t.innerHTML = i;
    t.onclick = function() { var el = document.getElementById(id); if(el) el.style.display = (el.style.display==='none')?'block':'none'; };
    b.appendChild(t);
}

function toggleStart() { document.getElementById('start_flyout').classList.toggle('active'); }
function saveNote() { localStorage.setItem('my_note', document.getElementById('nt').value); alert("Saved!"); }
function math(v) { var s = document.getElementById('sr'); if(v==='=') s.value=eval(s.value)||''; else if(v==='C') s.value=''; else s.value+=v; }

function drag(el) {
    var h = el.querySelector('.window-top'); h.onmousedown = function(e) {
        var ox = e.clientX, oy = e.clientY;
        document.onmousemove = function(e) {
            var dx = ox-e.clientX, dy = oy-e.clientY; ox = e.clientX; oy = e.clientY;
            el.style.top = (el.offsetTop-dy)+"px"; el.style.left = (el.offsetLeft-dx)+"px";
            el.style.transform = "none"; // Remove centering transform after drag starts
        };
        document.onmouseup = function() { document.onmousemove = null; };
    };
}
