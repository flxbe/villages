import UiState from "./ui-state.js";

const musicTitles = {
    music01: { url: "ASSETS/sound/wave1.wav", played: false },
    music02: { url: "ASSETS/sound/wave2.wav", played: false },
    music03: { url: "ASSETS/sound/wave3.wav", played: false },
    music04: { url: "ASSETS/sound/wave4.wav", played: false },
    music05: { url: "ASSETS/sound/wave5.wav", played: false },
    music06: { url: "ASSETS/sound/wind1.wav", played: false },
    music07: { url: "ASSETS/sound/wind2.wav", played: false },
    music08: { url: "ASSETS/sound/wind3.wav", played: false }
};

for (let title in musicTitles) PIXI.sound.add(title, musicTitles[title].url);

function chooseRandomMusic() {
    const rand = Math.floor(Math.random() * Object.keys(musicTitles).length);
    let titleNr = 0;
    for (let title in musicTitles) {
        if (titleNr >= rand && !musicTitles[title].played) {
            musicTitles[title].played = true;
            return title;
        }
        titleNr++;
    }

    for (let title in musicTitles) {
        musicTitles[title].played = false;
    }
    return chooseRandomMusic();
}

export function playMusic() {
    UiState.currentMusicTitle = chooseRandomMusic();
    PIXI.sound.play(UiState.currentMusicTitle, { complete: function () { playMusic(); } });
    console.log(UiState.currentMusicTitle);
}

export function stopMusic() {
    if (UiState.currentMusicTitle) {
        PIXI.sound.stop(UiState.currentMusicTitle);
        UiState.currentMusicTitle = null;
    }
    for (let title in musicTitles) {
        musicTitles[title].played = false;
    }
}