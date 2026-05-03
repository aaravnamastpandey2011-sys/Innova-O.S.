var z = 100;
function tick() {
    var c = document.getElementById('time_clock'); var d = new Date();
    c.textContent = d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0');
}
setInterval(tick, 1000); tick();

function handleLogin() { if (document.getElementById('pass_field').value === 'admin') document.getElementById('lock_screen').style.display='none'; else alert("Try 'admin'"); }

function openApp(tag, ico) {
    var h = document.getElementById('win_layer'); var w = document.createElement('div');
    var id = "id-" + Math.random().toString(36).slice(2);
    w.id = id; w.className = 'window'; w.style.zIndex = ++z;
    w.style.top = "80px"; w.style.left = "50%"; w.style.transform = "translateX(-50%)";
    w.onmousedown = function() { w.style.zIndex = ++z; };

    var body = "";
    if (tag === 'notepad') body = '<textarea id="nt" style="width:100%; height:200px; border:none; outline:none;">' + (localStorage.getItem('my_note')||"") + '</textarea><button onclick="save()">Save</button>';
    else if (tag === 'calc') {
        body = '<input id="sr" readonly style="width:100%; margin-bottom:5px; text-align:right;"><div style="display:grid; grid-template-columns:repeat(4,1fr); gap:2px;">';
        var k = ['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'];
        for(var i=0; i<k.length; i++) body += '<button onclick="math(\''+k[i]+'\')" style="padding:15px;">'+k[i]+'</button>';
        body += '</div>';
    }
    else if (tag === 'browser') {
        body = '<div class="browser-bar"><input id="url" type="text" value="https://www.bing.com"><button onclick="go(this)">Go</button></div><iframe id="frame" src="https://www.bing.com" style="width:100%; height:300px; border:none;"></iframe>';
    }
    else if (tag === 'files') {
        var s = localStorage.getItem('my_note') ? "user_note.txt" : "Empty";
        body = '<div style="display:flex; height:200px;"><div style="width:30%; border-right:1px solid #ddd; font-size:11px;">📁 C:<br>📁 Docs</div><div style="width:70%; padding:10px;"><div onclick="openApp(\'notepad\', \'📝\')">📄 '+s+'</div></div></div>';
    }

    w.innerHTML = '<div class="window-top"><span>'+ico+' '+tag.toUpperCase()+'</span><div><button style="background:red; color:white;" onclick="this.closest(\'.window\').remove()">X</button></div></div><div>'+body+'</div>';
    h.appendChild(w); add(tag, ico, id); drag(w);
}

function go(btn) { var val = btn.previousElementSibling.value; btn.closest('.window').querySelector('iframe').src = val; }
function add(n, i, id) { var b = document.getElementById('taskbar_items'); var t = document.createElement('div'); t.className = 'task-tab'; t.innerHTML = i; t.onclick = function() { var el = document.getElementById(id); if(el) el.style.display = (el.style.display==='none')?'block':'none'; }; b.appendChild(t); }
function toggleStart() { document.getElementById('start_flyout').classList.toggle('active'); }
function save() { localStorage.setItem('my_note', document.getElementById('nt').value); alert("Saved!"); }
function math(v) { var s = document.getElementById('scr'); if(v==='=') s.value=eval(s.value)||''; else if(v==='C') s.value=''; else s.value+=v; }
function drag(el) {
    var h = el.querySelector('.window-top'); h.onmousedown = function(e) {
        var ox = e.clientX, oy = e.clientY;
        document.onmousemove = function(e) {
            var dx = ox-e.clientX, dy = oy-e.clientY; ox = e.clientX; oy = e.clientY;
            el.style.top = (el.offsetTop-dy)+"px"; el.style.left = (el.offsetLeft-dx)+"px"; el.style.transform = "none";
        };
        document.onmouseup = function() { document.onmousemove = null; };
    };
}
