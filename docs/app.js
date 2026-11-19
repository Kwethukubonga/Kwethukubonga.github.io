(function(){
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var bar = document.getElementById("topbar");
  var prog = document.getElementById("progress");
  var art = document.getElementById("coverArt");
  var paperBands = document.querySelectorAll(".band-paper");
  var ticking = false;

  var onFrame = function(){
    ticking = false;
    var y = window.scrollY;

    if (bar) {
      bar.classList.toggle("is-stuck", y > 60);
      var overPaper = false;
      Array.prototype.forEach.call(paperBands, function(b){
        var r = b.getBoundingClientRect();
        if (r.top <= 46 && r.bottom >= 46) overPaper = true;
      });
      bar.classList.toggle("on-paper", overPaper && y <= 60);
    }

    if (prog) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.transform = "scaleX(" + (h > 0 ? Math.min(1, y / h) : 0) + ")";
    }

    if (art && !reduce && y < window.innerHeight * 1.2) {
      art.style.transform = "translate3d(0," + (y * 0.16) + "px,0) scale(1.08)";
    }
  };

  var onScroll = function(){
    if (!ticking) { ticking = true; requestAnimationFrame(onFrame); }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onFrame();

  var scenes = document.querySelectorAll("[data-reveal]");

  if (reduce || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(scenes, function(el){ el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.06 });
    Array.prototype.forEach.call(scenes, function(el){ io.observe(el); });

    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        Array.prototype.forEach.call(scenes, function(el){
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in");
        });
      });
    });
  }

  var settle = function(){
    if (!location.hash) return;
    var target = document.querySelector(location.hash);
    if (target) target.scrollIntoView();
  };
  window.addEventListener("load", settle);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);

  var clock = document.getElementById("clock");
  if (clock) {
    var face = clock.querySelector(".t");
    var tickClock = function(){
      try {
        face.textContent = "Cape Town " + new Date().toLocaleTimeString("en-GB", {
          timeZone: "Africa/Johannesburg", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
        });
      } catch (e) {
        clock.style.display = "none";
      }
    };
    tickClock();
    setInterval(tickClock, 1000);
  }

  var toc = document.querySelector(".toc");
  var peek = document.querySelector(".peek");
  var fine = window.matchMedia("(hover: hover)").matches && window.innerWidth > 1000;

  if (toc && peek && fine && !reduce) {
    var pic = peek.querySelector("img");
    var tx = 0, ty = 0, cx = 0, cy = 0, frame = null, shown = "";
    var follow = function(){
      cx += (tx - cx) * 0.13;
      cy += (ty - cy) * 0.13;
      var tilt = Math.max(-7, Math.min(7, (tx - cx) * 0.22));
      peek.style.transform = "translate3d(" + cx + "px," + cy + "px,0) rotate(" + tilt + "deg)";
      frame = requestAnimationFrame(follow);
    };
    toc.addEventListener("pointermove", function(e){
      tx = e.clientX + 34;
      ty = e.clientY - 170;
      if (frame === null) { cx = tx; cy = ty; frame = requestAnimationFrame(follow); }
    });
    Array.prototype.forEach.call(toc.querySelectorAll(".toc-row"), function(row){
      row.addEventListener("pointerenter", function(){
        var src = row.getAttribute("data-thumb");
        if (src && src !== shown) { pic.src = src; shown = src; }
        peek.classList.add("is-on");
      });
    });
    toc.addEventListener("pointerleave", function(){
      peek.classList.remove("is-on");
      if (frame !== null) { cancelAnimationFrame(frame); frame = null; }
    });
  }
})();
