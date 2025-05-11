(function () {
    const audio = document.getElementById('audio-control');

    if (audio) {
      window.addEventListener('load', () => {
        // Attempt muted auto-play
        audio.muted = true; // Start with muted
        audio.play()
          .then(() => {
            audio.muted = false; // Unmute after auto-play starts
            setTimeout(() => {
              audio.pause(); // Pause audio after 5 seconds
            }, 6000);
          })
          .catch(error => {
            console.error("Audio play failed:", error);
          });
      });
    }
  })();

  function showTime() {
    const container = document.getElementById("container");
    const root = document.getElementById("root");

    // Listen for animation end event
    container.addEventListener("animationend", () => {
      container.style.display = "none"; // Hide the container
      root.classList.add("show"); // Display the root content
    });
  }

  setInterval(function () {
    showTime();
  }, 4000);