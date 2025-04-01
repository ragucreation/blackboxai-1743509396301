// Shared music data
const musicData = {
    songs: [
        {
            id: 1,
            title: "Blinding Lights",
            artist: "The Weeknd",
            album: "After Hours",
            duration: "3:20",
            cover: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
            audio: "blinding-lights.mp3"
        },
        {
            id: 2,
            title: "Summer",
            artist: "Calvin Harris",
            album: "Motion",
            duration: "3:42",
            cover: "https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg",
            audio: "summer.mp3"
        },
        {
            id: 3,
            title: "God's Plan",
            artist: "Drake",
            album: "Scorpion",
            duration: "3:18",
            cover: "https://images.pexels.com/photos/164727/pexels-photo-164727.jpeg",
            audio: "gods-plan.mp3"
        }
    ],
    playlists: [
        {
            id: 1,
            name: "Workout Mix",
            songs: [1, 2],
            cover: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg",
            duration: "2:36"
        },
        {
            id: 2,
            name: "Chill Vibes",
            songs: [3],
            cover: "https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg",
            duration: "1:45"
        }
    ]
};

// Player functionality
let currentSong = null;
let isPlaying = false;
const audioPlayer = new Audio();

function playSong(songId) {
    const song = musicData.songs.find(s => s.id === songId);
    if (song) {
        currentSong = song;
        audioPlayer.src = song.audio;
        audioPlayer.play();
        isPlaying = true;
        updatePlayerUI();
    }
}

function updatePlayerUI() {
    // Update player bar on all pages
    document.querySelectorAll('.player-bar').forEach(player => {
        player.querySelector('.player-cover').src = currentSong.cover;
        player.querySelector('.player-title').textContent = currentSong.title;
        player.querySelector('.player-artist').textContent = currentSong.artist;
        player.querySelector('.play-btn i').className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    });
}

// Initialize player controls
document.addEventListener('DOMContentLoaded', function() {
    // Play/pause button
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (isPlaying) {
                audioPlayer.pause();
            } else if (currentSong) {
                audioPlayer.play();
            } else {
                playSong(1); // Play first song if none selected
            }
            isPlaying = !isPlaying;
            updatePlayerUI();
        });
    });

    // Next/previous buttons
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentSong) {
                const currentIndex = musicData.songs.findIndex(s => s.id === currentSong.id);
                const nextIndex = (currentIndex + 1) % musicData.songs.length;
                playSong(musicData.songs[nextIndex].id);
            }
        });
    });

    // Volume control
    document.querySelectorAll('.volume-slider').forEach(slider => {
        slider.addEventListener('input', function() {
            audioPlayer.volume = this.value / 100;
        });
    });
});

// Shared functions for all pages
function renderSongs() {
    const songList = document.querySelector('.song-list');
    if (songList) {
        songList.innerHTML = musicData.songs.map(song => `
            <tr class="song-item hover:bg-gray-800" data-id="${song.id}">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${song.id}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <img src="${song.cover}" class="h-10 w-10 rounded mr-3">
                        <div>
                            <div class="text-sm font-medium text-white">${song.title}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${song.artist}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${song.album}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${song.duration}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <button class="play-song-btn text-purple-400 hover:text-purple-300 mr-3">
                        <i class="fas fa-play"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Add event listeners to play buttons
        document.querySelectorAll('.play-song-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const songId = parseInt(this.closest('.song-item').dataset.id);
                playSong(songId);
            });
        });
    }
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Audio player event listeners
audioPlayer.addEventListener('timeupdate', function() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    document.querySelectorAll('.progress-bar').forEach(bar => {
        bar.style.width = `${progress}%`;
    });
    document.querySelectorAll('.current-time').forEach(time => {
        time.textContent = formatTime(audioPlayer.currentTime);
    });
});

audioPlayer.addEventListener('loadedmetadata', function() {
    document.querySelectorAll('.duration').forEach(time => {
        time.textContent = formatTime(audioPlayer.duration);
    });
});

audioPlayer.addEventListener('ended', function() {
    const currentIndex = musicData.songs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % musicData.songs.length;
    playSong(musicData.songs[nextIndex].id);
});

// Initialize all pages
document.addEventListener('DOMContentLoaded', function() {
    renderSongs();
    
    // Add click handlers to all song items
    document.querySelectorAll('.song-item').forEach(item => {
        item.addEventListener('click', function() {
            const songId = parseInt(this.dataset.id);
            playSong(songId);
        });
    });
    
    // Initialize volume
    audioPlayer.volume = 0.7;
});
