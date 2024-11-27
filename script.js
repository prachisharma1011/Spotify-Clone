// Define audio variable in a wider scope
let audio = null;
let currentIndex = -1;

// Fetch songs from your API
const cards = document.querySelectorAll(".card");
console.log(cards);

cards.forEach((card) => {
  card.addEventListener("click", async function () {
    console.log(this.id);
    const cardID = this.id;

    await fetch("http://localhost:5000/api/songs/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cardID: cardID }),
    })
      .then((response) => {
        console.log(response); // Log the raw response
        return response.json(); // Parse JSON response
      })
      .then((data) => {
        console.log("Data from API:", data); // Debug: Check what the API returns
        const songs = data.songs;
        let list = document.querySelector("#list");

        // Clear existing list items and reset variables
        list.innerHTML = "";
        currentIndex = -1;

        songs.forEach((song) => {
          let listItem = document.createElement("li");

          // Create an img element for the SVG
          let MusicIcon = document.createElement("img");
          MusicIcon.src = "music.svg"; // Replace with the correct path to your SVG
          MusicIcon.alt = "Song Icon";
          MusicIcon.style.width = "20px";
          MusicIcon.style.height = "20px";
          MusicIcon.style.marginRight = "10px";

          // Append SVG icon to the list item
          listItem.appendChild(MusicIcon);

          // Create a span for the song name
          let songName = document.createElement("span");
          songName.textContent = song;
          listItem.appendChild(songName);

          let PlayIcon = document.createElement("img");
          PlayIcon.src = "PlayIcon-lib.svg";
          listItem.appendChild(PlayIcon);

          // Append the list item to the <ul> or <ol> element
          list.appendChild(listItem);
        });

        // Dynamically get the updated music list
        let MusicList = document.querySelectorAll(".library li");

        // Convert seconds to mm:ss format
        function convertSecondsToMinutes(seconds) {
          const clampedSeconds = Math.max(0, Math.min(59, Math.floor(seconds)));
          const formattedSeconds = String(clampedSeconds).padStart(2, "0");
          return `00:${formattedSeconds}`;
        }

        // Function to play a song by index
        function playSong(index) {
          let song = MusicList[index].textContent.trim();
          console.log(song);

          // Update play icon
          document.querySelector("#play").src = "pause.svg";

          // If there is already an audio playing, pause it
          if (audio) {
            audio.pause();
            audio.currentTime = 0; // Reset playback to the start of the song
            document.querySelector(".circle_bar").style.left = "-49.50%";
          }

          // Create a new audio instance for the selected song
          audio = new Audio(`songs-api/${cardID}/${song}`);
          document.querySelector(".circle_bar").style.left = "-49.50%";
          document.querySelector(".circle_bar").style.transition = "none";

          audio.addEventListener("timeupdate", () => {
            let timestamp = document.querySelector("#timestamp");
            timestamp.innerHTML = `${convertSecondsToMinutes(
              audio.currentTime
            )}/${convertSecondsToMinutes(audio.duration)}`;
            document.querySelector(".circle_bar").style.left = `${
              (audio.currentTime / audio.duration) * 100 - 49.50
            }%`;
            document.querySelector(".circle_bar").style.transition = "left 0.1s";
          });

          // Automatically play the song
          audio.play().catch((error) => {
            console.error("Error playing audio:", error);
          });
        }

        // Remove existing event listeners from buttons
        const clonePlayButton = document.querySelector("#play").cloneNode(true);
        document.querySelector("#play").replaceWith(clonePlayButton);

        const clonePrevButton = document.querySelector("#prevplay").cloneNode(true);
        document.querySelector("#prevplay").replaceWith(clonePrevButton);

        const cloneNextButton = document.querySelector("#nextplay").cloneNode(true);
        document.querySelector("#nextplay").replaceWith(cloneNextButton);

        // Play/Pause button functionality
        document.querySelector("#play").addEventListener("click", () => {
          if (audio) {
            if (audio.paused) {
              audio.play();
              document.querySelector("#play").src = "pause.svg";
            } else {
              audio.pause();
              document.querySelector("#play").src = "play.svg";
            }
          }
        });

        // Previous button functionality
        document.querySelector("#prevplay").addEventListener("click", () => {
          if (currentIndex > 0) {
            currentIndex -= 1;
            playSong(currentIndex);
          }
        });

        // Next button functionality
        document.querySelector("#nextplay").addEventListener("click", () => {
          if (currentIndex < MusicList.length - 1) {
            currentIndex += 1;
            playSong(currentIndex);
          }
        });

        // Add click event to each song item in the list
        MusicList.forEach((item, index) => {
          item.addEventListener("click", () => {
            currentIndex = index; // Update the current index
            playSong(currentIndex); // Play the selected song
          });
        });
      })
      .catch((error) => console.error("Error fetching songs:", error));
  });
});
