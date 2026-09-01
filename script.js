(function () {
  "use strict";

  var TOTAL_Q = 7;
  var SCALE_LABELS = ["Not at all", "Rarely", "Somewhat", "Mostly", "Completely"];

  var LEAK_COPY = [
    "You can't yet say your offer in one plain sentence — that's the line prospects repeat when they refer you, so an unclear one costs you referrals.",
    "Your promised result isn't measurable yet. Vague outcomes get compared on price; specific ones get compared on results.",
    "It's not clear who this is (and isn't) for. Offers that fit everyone convert like they fit no one.",
    "Your price and payment structure aren't landing clearly. Confusion about cost is the fastest way to lose a warm lead.",
    "What happens right after someone says yes isn't obvious. Uncertainty here creates last-minute hesitation.",
    "Your proof isn't tied tightly enough to your promise. Testimonials that don't match the specific result don't convert.",
    "There isn't one obvious next step. When people have to figure out what to do, most of them do nothing."
  ];

  var state = {
    current: 0,
    answers: new Array(TOTAL_Q).fill(null)
  };

  var card = document.getElementById("scorer-card");
  var introPanel = card.querySelector('[data-panel="intro"]');
  var quizPanel = card.querySelector('[data-panel="quiz"]');
  var resultPanel = card.querySelector('[data-panel="result"]');

  var startBtn = document.getElementById("start-btn");
  var nextBtn = document.getElementById("next-btn");
  var backBtn = document.getElementById("back-btn");
  var retakeBtn = document.getElementById("retake-btn");
  var progressFill = document.getElementById("progress-fill");
  var qCount = document.getElementById("q-count");
  var questions = Array.prototype.slice.call(document.querySelectorAll(".question"));

  // Build the 1-5 scale controls for each question
  questions.forEach(function (fieldset) {
    var qIndex = Number(fieldset.getAttribute("data-q"));
    var scaleWrap = fieldset.querySelector(".scale");
    var name = scaleWrap.getAttribute("data-name");

    for (var i = 1; i <= 5; i++) {
      (function (value) {
        var label = document.createElement("label");
        label.className = "scale-opt";

        var input = document.createElement("input");
        input.type = "radio";
        input.name = name;
        input.value = String(value);

        var num = document.createElement("span");
        num.className = "scale-num";
        num.textContent = String(value);

        var text = document.createElement("span");
        text.className = "scale-label";
        text.textContent = SCALE_LABELS[value - 1];

        label.appendChild(input);
        label.appendChild(num);
        label.appendChild(text);

        input.addEventListener("change", function () {
          state.answers[qIndex] = value;
          Array.prototype.forEach.call(scaleWrap.querySelectorAll(".scale-opt"), function (opt) {
            opt.classList.remove("selected");
          });
          label.classList.add("selected");
          nextBtn.disabled = false;
        });

        scaleWrap.appendChild(label);
      })(i);
    }
  });

  function showPanel(name) {
    introPanel.hidden = name !== "intro";
    quizPanel.hidden = name !== "quiz";
    resultPanel.hidden = name !== "result";
  }

  function renderQuestion() {
    questions.forEach(function (fieldset) {
      var qIndex = Number(fieldset.getAttribute("data-q"));
      fieldset.classList.toggle("active", qIndex === state.current);
    });

    qCount.textContent = "Question " + (state.current + 1) + " of " + TOTAL_Q;
    progressFill.style.width = (((state.current + 1) / TOTAL_Q) * 100) + "%";

    backBtn.hidden = state.current === 0;
    nextBtn.disabled = state.answers[state.current] === null;
    nextBtn.textContent = state.current === TOTAL_Q - 1 ? "See my score" : "Next";
  }

  startBtn.addEventListener("click", function () {
    showPanel("quiz");
    renderQuestion();
  });

  backBtn.addEventListener("click", function () {
    if (state.current > 0) {
      state.current -= 1;
      renderQuestion();
    }
  });

  nextBtn.addEventListener("click", function () {
    if (state.answers[state.current] === null) return;

    if (state.current < TOTAL_Q - 1) {
      state.current += 1;
      renderQuestion();
    } else {
      showResult();
    }
  });

  retakeBtn.addEventListener("click", function () {
    state.current = 0;
    state.answers = new Array(TOTAL_Q).fill(null);
    Array.prototype.forEach.call(document.querySelectorAll(".scale-opt"), function (opt) {
      opt.classList.remove("selected");
    });
    Array.prototype.forEach.call(document.querySelectorAll('input[type="radio"]'), function (input) {
      input.checked = false;
    });
    renderQuestion();
    showPanel("quiz");
  });

  function getTier(score) {
    if (score <= 14) {
      return {
        label: "Major revenue leak",
        summary: "Your offer is likely losing people before they ever get to a real decision. The good news: these are fixable in an afternoon, not a rebrand."
      };
    }
    if (score <= 24) {
      return {
        label: "Foggy offer",
        summary: "Parts of your offer are clear, but the gaps are letting warm prospects cool off. A few sharper sentences would close most of this."
      };
    }
    if (score <= 30) {
      return {
        label: "Mostly clear",
        summary: "Your offer is doing its job most of the time. Tightening your lowest-scoring areas below will plug the remaining leaks."
      };
    }
    return {
      label: "Crystal clear",
      summary: "Your offer is about as clear as they come. Keep testing it against new audiences to make sure it stays that sharp."
    };
  }

  function showResult() {
    var total = state.answers.reduce(function (sum, v) { return sum + v; }, 0);
    var tier = getTier(total);

    document.getElementById("result-tier").textContent = tier.label;
    document.getElementById("score-number").textContent = String(total);
    document.getElementById("result-summary").textContent = tier.summary;

    // Rank questions by lowest score, show the weakest 3 as leak points
    var ranked = state.answers
      .map(function (value, index) { return { index: index, value: value }; })
      .sort(function (a, b) { return a.value - b.value; })
      .slice(0, 3)
      .filter(function (item) { return item.value <= 3; });

    var list = document.getElementById("leak-list");
    list.innerHTML = "";

    if (ranked.length === 0) {
      var li = document.createElement("li");
      li.textContent = "No major leak points — every area scored solidly.";
      list.appendChild(li);
    } else {
      ranked.forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = LEAK_COPY[item.index];
        list.appendChild(li);
      });
    }

    showPanel("result");
  }

  document.getElementById("year").textContent = String(new Date().getFullYear());
})();
