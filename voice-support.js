// Browser-native speech helpers. No credentials, audio recording, or AI service.
export function preferredVoice(voices) {
  const english = voices.filter((voice) => /^en(?:-|_|$)/i.test(voice.lang));
  const score = (voice) => {
    const name = voice.name.toLowerCase();
    return (
      (/premium|enhanced|natural|neural/.test(name) ? 100 : 0) +
      (/siri|ava|samantha|karen|serena/.test(name) ? 35 : 0) +
      (/google us english|jenny|aria/.test(name) ? 30 : 0) +
      (/en-us/i.test(voice.lang) ? 10 : 0) +
      (voice.default ? 3 : 0) +
      (voice.localService ? 2 : 0) -
      (/compact|espeak|robot|novelty/.test(name) ? 80 : 0)
    );
  };
  return english.sort((a, b) => score(b) - score(a))[0] || null;
}

export function recognitionError(error) {
  return {
    "not-allowed": "Microphone access was blocked. Allow the microphone for this site in your browser, then try again. You can also type your question.",
    "service-not-allowed": "This browser isn’t allowing its speech service. Try a supported browser or use your keyboard’s dictation.",
    "audio-capture": "The microphone couldn’t be reached. Check your input device and whether another app is using it, then try again.",
    "network": "The browser’s speech service couldn’t connect. Check your connection or use your keyboard’s dictation.",
    "no-speech": "No speech was detected. Tap the microphone and try again, or type your question.",
    "language-not-supported": "English voice typing isn’t available in this browser. Use your keyboard’s dictation or type a question.",
    "aborted": "Voice input stopped. Your question is still here.",
  }[error] || "Voice input couldn’t complete. Try again or type your question.";
}

export function createDictationController({ Recognition, onState, onTranscript, onNotice, secure = true, timer = setTimeout, cancelTimer = clearTimeout }) {
  let active = null;
  function reset(session) {
    if (active !== session) return;
    cancelTimer(session.timeout);
    active = null;
    onState("idle");
  }
  function abort() {
    const session = active;
    if (!session) return;
    reset(session);
    try { session.recognition.abort(); } catch { /* Already ended. */ }
  }
  function toggle(seed = "") {
    if (active) {
      if (active.started) {
        try { active.recognition.stop(); } catch { abort(); }
      }
      else abort();
      return;
    }
    if (!Recognition || !secure) {
      onNotice("Voice typing needs a supported browser and a secure connection. You can use your keyboard’s dictation or type a question.");
      return;
    }
    let instance;
    try { instance = new Recognition(); } catch {
      onNotice("This browser couldn’t initialize voice input. Use your keyboard’s dictation or type a question.");
      return;
    }
    const session = { recognition: instance, started: false, result: false, error: false, timeout: null };
    const recognition = session.recognition;
    active = session;
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    onState("starting");
    onNotice("Starting voice input. Your browser may ask for microphone permission.");
    recognition.onstart = () => {
      if (active !== session) return;
      session.started = true;
      cancelTimer(session.timeout);
      onState("listening");
      onNotice("Listening… tap the microphone to stop. Review your words before sending.");
    };
    recognition.onresult = (event) => {
      if (active !== session) return;
      const transcript = Array.from(event.results).map((result) => result[0].transcript).join(" ").trim();
      if (transcript) {
        session.result = true;
        onTranscript([seed.trim(), transcript].filter(Boolean).join(" ").slice(0, 500));
      }
    };
    recognition.onerror = (event) => {
      if (active !== session) return;
      session.error = true;
      onNotice(recognitionError(event.error));
      // Some engines never send an end event after an error.
      reset(session);
      try { recognition.abort(); } catch { /* Already ended. */ }
    };
    recognition.onend = () => {
      if (active !== session) return;
      reset(session);
      if (!session.error) onNotice(session.result ? "Voice input complete. Review your question, then send it." : recognitionError("no-speech"));
    };
    session.timeout = timer(() => {
      if (active !== session || session.started) return;
      abort();
      onNotice("Voice input didn’t start. Check microphone access, or try again after another voice app finishes.");
    }, 12000);
    try {
      recognition.start();
    } catch {
      abort();
      onNotice("Voice input couldn’t start. Try again after another voice app finishes, or type your question.");
    }
  }
  return { toggle, abort };
}
