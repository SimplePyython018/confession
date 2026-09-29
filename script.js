(() => {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const screens = [...document.querySelectorAll(".screen")];

  const data = [
    {
      tag: "WHAT IF",
      title: "What if…",
      text: "May gusto sana akong sabihin. Hindi ko lang alam kung paano ko sisimulan nang hindi awkward.",
      choices: ["Sabihin mo na.", "Grabe ka naman.", "Kinakabahan ako."],
      hint: "Mukhang alam mo na kung saan papunta…"
    },
    {
      tag: "WHAT IF",
      title: "What if gusto kita?",
      text: "Paano kung may mga pagkakataong gusto kitang kausapin, pero pinipigilan ko lang kasi baka maiba ang tingin mo sa’kin?",
      choices: ["Ay… 👀", "Impossible.", "Ituloy mo."],
      hint: "Okay. Medyo serious na."
    },
    {
      tag: "WHAT IF",
      title: "What if totoo na gusto kita?",
      text: "Yung tipong napapaisip ako kung dapat ko bang sabihin o itago na lang. Kasi baka hindi mo ako gustohan.",
      choices: ["Baka nga.", "Hindi kita iiwasan.", "😶"],
      hint: "Huwag ka munang kabahan… o kabahan ka."
    },
    {
      tag: "HONEST THOUGHT",
      title: "What if hindi mo pala ako gusto?",
      text: "Paano kung after kong sabihin, biglang awkward? Paano kung lumayo ka? Paano kung mas okay na lang na hindi mo alam?",
      choices: ["Awww.", "Continue.", "Hindi naman siguro."],
      hint: "Ito na yung part na usually may kaba."
    },
    {
      tag: "MIDNIGHT THOUGHT",
      title: "What if mali lang lahat ng iniisip ko?",
      text: "What if friendly ka lang talaga? What if ako lang ang nagbibigay ng meaning sa maliliit na bagay?",
      choices: ["Possible.", "Aray.", "Huwag mong isipin."],
      hint: "Breathe in. Breathe out."
    },
    {
      tag: "CONFESSION",
      title: "What if sabihin ko na?",
      text: "“May gusto ako sa’yo.” Simple lang sana. Pero ang hirap sabihin kapag may chance na iba ang sagot na maririnig ko.",
      choices: ["Sabihin mo.", "Nervous na ako.", "😳"],
      hint: "Last few steps. Promise."
    },
    {
      tag: "ALMOST",
      title: "Paano kung gusto rin kita?",
      text: "At paano kung pareho lang tayong nag-aantay ng mauunang magsabi? Ang complicated, no?",
      choices: ["WHAT IF?!", "Sige na.", "😵‍💫"],
      hint: "Okay. Hinga muna."
    },
    {
      tag: "NO TURNING BACK",
      title: "What if ngayon ko sabihin?",
      text: "Walang edit. Walang delete. Isang sentence na lang. Ready ka ba sa “to—the—point” moment?",
      choices: ["Ready.", "Hindi na.", "🥲"],
      hint: "This is the setup."
    },
    {
      tag: "FINAL",
      title: "Aamin na ako.",
      text: "Yung matagal ko nang gustong sabihin… yung baka ilang segundo mo nang hinihintay…",
      choices: ["GO.", "Please.", "😬"],
      hint: "Too late to escape."
    }
  ];

  const state = {
    index: 0,
    typingTimer: null,
    countdownTimer: null,
    choice: null
  };

  const startScreen = $("#startScreen");
  const storyScreen = $("#storyScreen");
  const pauseScreen = $("#pauseScreen");
  const revealScreen = $("#revealScreen");
  const prankScreen = $("#prankScreen");

  function showScreen(target) {
    screens.forEach(s => {
      const active = s === target;
      s.classList.toggle("active", active);
      s.hidden = !active;
    });
    window.scrollTo({top: 0, behavior: "smooth"});
  }

  function typeText(text, el, speed = 18) {
    clearInterval(state.typingTimer);
    el.textContent = "";
    let i = 0;
    state.typingTimer = setInterval(() => {
      el.textContent += text[i++] || "";
      if (i >= text.length) clearInterval(state.typingTimer);
    }, speed);
  }

  function renderStep() {
    const item = data[state.index];
    $("#metaTag").textContent = item.tag;
    $("#timeStamp").textContent = `${String(11 + Math.floor(state.index / 3)).padStart(2, "0")}:${String((11 + state.index * 7) % 60).padStart(2, "0")} PM`;
    $("#storyTitle").textContent = item.title;
    typeText(item.text, $("#storyText"), Math.max(10, 22 - state.index));
    $("#stepText").textContent = `${state.index + 1} / ${data.length}`;
    $("#progressFill").style.width = `${((state.index + 1) / data.length) * 100}%`;
    $("#hint").textContent = item.hint;

    const choices = $("#choices");
    choices.innerHTML = "";
    state.choice = null;

    item.choices.forEach((label) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice";
      b.textContent = label;
      b.addEventListener("click", () => {
        [...choices.children].forEach(c => c.classList.remove("selected"));
        b.classList.add("selected");
        state.choice = label;
        toast(label === "Sabihin mo na." || label === "Sabihin mo." ? "Oh? 👀" : "Noted…");
      });
      choices.appendChild(b);
    });
  }

  function startStory() {
    state.index = 0;
    renderStep();
    showScreen(storyScreen);
  }

  function next() {
    if (!state.choice) {
      toast("Pumili ka muna kahit isa. 👀");
      $(".story-card").classList.add("glitch");
      setTimeout(() => $(".story-card").classList.remove("glitch"), 360);
      return;
    }

    if (state.index < data.length - 1) {
      state.index++;
      renderStep();
      return;
    }

    showScreen(pauseScreen);
  }

  function startReveal() {
    showScreen(revealScreen);
    $("#countdownNumber").textContent = "3";
    $("#truthBtn").disabled = true;
    let n = 3;
    clearInterval(state.countdownTimer);
    state.countdownTimer = setInterval(() => {
      n--;
      $("#countdownNumber").textContent = n <= 0 ? "…" : String(n);
      if (n <= 0) {
        clearInterval(state.countdownTimer);
        $("#truthBtn").disabled = false;
        $("#countdownNumber").textContent = "0";
        toast("Okay. Ready na.");
      }
    }, 950);
  }

  function revealPrank() {
    showScreen(prankScreen);
    makeConfetti();
    const score = 94 + Math.floor(Math.random() * 6);
    $("#fakeScore").textContent = `${score}%`;
  }

  function makeConfetti() {
    const box = $("#confetti");
    box.innerHTML = "";
    const pieces = 75;
    for (let i = 0; i < pieces; i++) {
      const p = document.createElement("i");
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${-10 - Math.random() * 30}px`;
      p.style.setProperty("--x", `${(Math.random() - 0.5) * 180}px`);
      p.style.animationDelay = `${Math.random() * .75}s`;
      p.style.transform = `rotate(${Math.random()*360}deg)`;
      const palette = ["#ff6b9a","#9b7bff","#6ff0ff","#ffd66b","#ffffff","#b1ff8f"];
      p.style.background = palette[i % palette.length];
      box.appendChild(p);
    }
  }

  let toastTimer = null;
  function toast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1500);
  }

  $("#openBtn").addEventListener("click", startStory);
  $("#continueBtn").addEventListener("click", next);
  $("#dangerBtn").addEventListener("click", startReveal);
  $("#truthBtn").addEventListener("click", revealPrank);
  $("#againBtn").addEventListener("click", () => {
    clearInterval(state.countdownTimer);
    startStory();
  });
  $("#restartBtn").addEventListener("click", () => {
    clearInterval(state.typingTimer);
    clearInterval(state.countdownTimer);
    showScreen(startScreen);
  });
  $("#backToStory").addEventListener("click", () => showScreen(storyScreen));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (startScreen.classList.contains("active")) $("#openBtn").click();
      else if (storyScreen.classList.contains("active")) $("#continueBtn").click();
      else if (pauseScreen.classList.contains("active")) $("#dangerBtn").click();
      else if (revealScreen.classList.contains("active") && !$("#truthBtn").disabled) $("#truthBtn").click();
    }
    if (e.key === "Escape" && !startScreen.classList.contains("active")) {
      $("#restartBtn").click();
    }
  });
})();
