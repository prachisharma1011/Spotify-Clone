// Define audio variable in a wider scope
let audio = null;
let prevAudio = null;
let currentIndex = -1;

// Fetch songs from your API


fetch("http://localhost:5000/api/songs/Kedarnath")
  .then((response) => response.json()) // Parse JSON response
  .then((data) => {
    console.log(data); // Debug: Check what the API returns

    const songs = data.songs;
    let list = document.querySelector("#list");

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

    // Adding event listener to each song
    let MusicList = document.querySelector(".library").getElementsByTagName("li");
    let play = document.querySelector("#play");
    let timestamp = document.querySelector("#timestamp");

    // Convert seconds to mm:ss format
    function convertSecondsToMinutes(seconds) {
      const clampedSeconds = Math.max(0, Math.min(59, Math.floor(seconds)));
      const formattedSeconds = String(clampedSeconds).padStart(2, '0');
      return `00:${formattedSeconds}`;
    }

    // Function to play a song by index
    function playSong(index) {
      let song = MusicList[index].textContent.trim();
      console.log(song);

      // Update play icon
      play.src = "pause.svg";

      // If there is already an audio playing, pause it and set it as the previous audio
      if (audio) {
        audio.pause();
        audio.currentTime = 0; // Reset playback to the start of the song
        document.querySelector(".circle_bar").style.left = "-49.50%";
        prevAudio = audio; // Save the current audio as previous
      }

      // Create new audio instance for the selected song
      audio = new Audio(`songs-api/songs/${song}`);
      document.querySelector(".circle_bar").style.left = "-49.50%";
      document.querySelector(".circle_bar").style.transition = "none";

      audio.addEventListener("timeupdate", () => {
        timestamp.innerHTML = `${convertSecondsToMinutes(audio.currentTime)}/${convertSecondsToMinutes(audio.duration)}`;
        document.querySelector(".circle_bar").style.left = (((audio.currentTime / audio.duration) * 100) - 49.50) + "%";
        document.querySelector(".circle_bar").style.transition = "left 0.1s";
      });

      // Automatically play the song
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }

    // Add click event to each song item in the list
    for (let i = 0; i < MusicList.length; i++) {
      MusicList[i].addEventListener("click", () => {
        currentIndex = i; // Update the current index
        playSong(currentIndex); // Play the selected song
      });
    }

    // Play/Pause button functionality
    let pause = document.querySelector("#play");
    pause.addEventListener("click", () => {
      if (audio) {
        if (audio.paused) {
          audio.play();
          play.src = "pause.svg";
        } else {
          audio.pause();
          play.src = "play.svg";
        }
      }
    });

    // Volume control setup
    const volumeSlider = document.querySelector("#volumeRange");
    if (volumeSlider) {
      volumeSlider.addEventListener("input", (e) => {
        if (audio) {
          const volume = parseInt(e.target.value) / 100; // Convert to a value between 0 and 1
          audio.volume = volume; // Set audio volume
          console.log("Volume:", volume); // Debugging output
        }
      });
    } else {
      console.error("Volume range slider not found");
    }

    // Previous and Next song button functionality
    let prevplay = document.querySelector('#prevplay');
    prevplay.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex -= 1;
        playSong(currentIndex);
      }
    });

    let nextplay = document.querySelector('#nextplay');
    nextplay.addEventListener("click", () => {
      if (currentIndex < MusicList.length - 1) {
        currentIndex += 1;
        playSong(currentIndex);
      }
    });
  })
  .catch((error) => console.error("Error fetching songs:", error));
