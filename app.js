// AMBAG starter — simple client-side prototype (no backend yet).
// Data is saved in the browser via localStorage so the demo survives refreshes.
(function () {
  "use strict";
  var MEMBERS = ["Aaron", "Chesca", "Paolo", "Marjie"];
  var KEY = "ambag.commits.v1";

  var $ = function (id) { return document.getElementById(id); };
  var commits = load();

  // --- member picker ---
  var memberSel = $("member");
  MEMBERS.forEach(function (m) {
    var o = document.createElement("option");
    o.value = m; o.textContent = m; memberSel.appendChild(o);
  });

  // --- timer ---
  var seconds = 0, ticking = false, handle = null;
  function fmt(s) {
    var m = Math.floor(s / 60), r = s % 60;
    return String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0");
  }
  function render_clock() { $("clock").textContent = fmt(seconds); }
  $("timer-toggle").addEventListener("click", function () {
    ticking = !ticking;
    this.textContent = ticking ? "Pause" : "Start";
    if (ticking) { handle = setInterval(function () { seconds++; render_clock(); }, 1000); }
    else { clearInterval(handle); }
  });
  $("timer-use").addEventListener("click", function () {
    $("minutes").value = Math.max(1, Math.round(seconds / 60)) || 1;
  });

  // --- add a commit ---
  $("commit-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var c = {
      id: Date.now(),
      member: memberSel.value,
      task: $("task").value.trim(),
      minutes: parseInt($("minutes").value, 10) || 0,
      evidence: $("evidence").value.trim(),
      at: new Date().toISOString(),
      confirmedBy: []
    };
    if (!c.task || !c.minutes) return;
    commits.unshift(c);
    save();
    this.reset();
    seconds = 0; ticking = false; clearInterval(handle);
    $("timer-toggle").textContent = "Start"; render_clock();
    draw();
  });

  // --- peer confirm ---
  function confirmCommit(id) {
    var me = memberSel.value;
    var c = commits.find(function (x) { return x.id === id; });
    if (!c) return;
    if (c.member === me) { alert("A teammate (not you) must confirm your own commit."); return; }
    if (c.confirmedBy.indexOf(me) === -1) c.confirmedBy.push(me);
    save(); draw();
  }

  // --- render ---
  function draw() {
    var feed = $("feed");
    feed.innerHTML = "";
    $("empty").style.display = commits.length ? "none" : "block";
    commits.forEach(function (c) {
      var li = document.createElement("li");
      li.className = "item";
      var confirmed = c.confirmedBy.length > 0;
      var ev = c.evidence
        ? (/^https?:\/\//.test(c.evidence)
            ? '<a href="' + c.evidence + '" target="_blank" rel="noopener">' + c.evidence + "</a>"
            : escapeHtml(c.evidence))
        : '<span class="muted">no evidence attached</span>';
      li.innerHTML =
        '<div class="row1"><span class="task">' + escapeHtml(c.task) + "</span>" +
        '<span class="badge ' + (confirmed ? "ok" : "wait") + '">' +
        (confirmed ? "Confirmed" : "Awaiting confirm") + "</span></div>" +
        '<div class="meta">' + escapeHtml(c.member) + " · " + c.minutes + " min · " +
        new Date(c.at).toLocaleString() + "</div>" +
        '<div class="ev">' + ev + "</div>" +
        '<div class="actions"><button class="confirm" data-id="' + c.id + '">Confirm</button>' +
        (confirmed ? '<span class="muted">by ' + c.confirmedBy.map(escapeHtml).join(", ") + "</span>" : "") +
        "</div>";
      feed.appendChild(li);
    });
    feed.querySelectorAll(".confirm").forEach(function (b) {
      b.addEventListener("click", function () { confirmCommit(parseInt(this.dataset.id, 10)); });
    });
    drawSummary();
  }

  function drawSummary() {
    var body = $("summary");
    body.innerHTML = "";
    MEMBERS.forEach(function (m) {
      var mine = commits.filter(function (c) { return c.member === m; });
      var conf = mine.filter(function (c) { return c.confirmedBy.length > 0; }).length;
      var mins = mine.reduce(function (a, c) { return a + c.minutes; }, 0);
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + m + "</td><td>" + mine.length + "</td><td>" + conf +
        "</td><td>" + fmt(mins * 60) + "</td>";
      body.appendChild(tr);
    });
  }

  // --- storage helpers ---
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(commits)); } catch (e) {} }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  render_clock();
  draw();
})();
