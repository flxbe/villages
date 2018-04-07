import State from "./state.js";
import UiState from "./ui-state.js";
import { getDirection } from "./util.js";
import { getPosition } from "./movement.js";

let playedC = 0;

const musicTitles = {
    medieval_melody: { url: "ASSETS/sound/medieval_melody.mp3", played: false },
    fretless_salsa: { url: "ASSETS/sound/fretless_salsa.mp3", played: false }
};

const sounds = {
    wind1: "ASSETS/sound/wind1.wav",
    wind2: "ASSETS/sound/wind2.wav",
    wind3: "ASSETS/sound/wind3.wav",
    STAND: "ASSETS/sound/wood.wav",
    wave1: "ASSETS/sound/wave1.wav",
    wave2: "ASSETS/sound/wave2.wav",
    wave3: "ASSETS/sound/wave3.wav",
    wave4: "ASSETS/sound/wave4.wav",
    wave5: "ASSETS/sound/wave5.wav",
    chirp1: "ASSETS/sound/chirp1.wav",
    chirp2: "ASSETS/sound/chirp2.wav",
    chirp3: "ASSETS/sound/chirp3.wav",
    chirp4: "ASSETS/sound/chirp4.wav",
    chirp5: "ASSETS/sound/chirp5.wav",
    prey: "ASSETS/sound/prey.wav",
    owl: "ASSETS/sound/owl.wav",
    cricket: "ASSETS/sound/cricket.wav"
};

for (let title in musicTitles) PIXI.sound.add(title, { url: musicTitles[title].url, volume: 0.25 });
for (let sound in sounds) PIXI.sound.add(sound, { url: sounds[sound], preload: true });

export function adjustMusicVolume(delta) {
    for (let title in musicTitles) {
        PIXI.sound.volume(title, Math.round(Math.max(0, Math.min(100, 100 * (PIXI.sound.volume(title) + delta)))) / 100);
        console.log(`music volume: ${PIXI.sound.volume(title)}`);
    }
}

export function adjustSoundVolume(delta) {
    for (let sound in sounds) {
        PIXI.sound.volume(sound, Math.round(Math.max(0, Math.min(100, 100 * (PIXI.sound.volume(sound) + delta)))) / 100);
        console.log(`sound volume: ${PIXI.sound.volume(sound)}`);
    }
}

export function adjustMasterVolume(delta) {
    PIXI.sound.volumeAll = Math.round(Math.max(0, Math.min(100, 100 * (PIXI.sound.volumeAll + delta)))) / 100;
    console.log(`master volume: ${PIXI.sound.volumeAll}`);
}

function chooseRandomMusic() {
    const rand = Math.floor(Math.random() * (Object.keys(musicTitles).length - playedC));
    let titleNr = 0;
    for (let title in musicTitles) {
        if (titleNr >= rand && !musicTitles[title].played) {
            musicTitles[title].played = true;
            playedC++;
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

const objectSounds = {};

export function setObjectSound(id, action) {
    if (!objectSounds[id]) {
        if (PIXI.sound.exists(action)) {
            const speed = 0.5 + Math.random();
            const sound = PIXI.sound.play(action, { loop: true, speed: speed });
            objectSounds[id] = { action, sound };
        } else {
            objectSounds[id] = { action };
        }
        return;
    }

    if (objectSounds[id].action != action) {
        if (objectSounds[id].sound) objectSounds[id].sound.stop();

        if (PIXI.sound.exists(action)) {
            const speed = 0.5 + Math.random();
            console.log(speed);
            const sound = PIXI.sound.play(action, { loop: true, speed: speed });
            objectSounds[id] = { action, sound };
        } else {
            objectSounds[id] = { action };
        }
    }
}

export function ambientSounds() {
    const rand1 = Math.random();

    if (rand1 < 0.005) {
        const soundNr = Math.random();
        const vol = Math.random();
        if (soundNr < 0.34) PIXI.sound.play("wind1", { volume: vol, singleInstance: true });
        else if (soundNr < 0.67) PIXI.sound.play("wind2", { volume: vol, singleInstance: true });
        else PIXI.sound.play("wind3", { volume: vol, singleInstance: true });
    }

    const rand2 = Math.random();

    if (rand2 < 0.001) {
        const soundNr = Math.random();
        const vol = Math.random();
        if (soundNr < 0.2) PIXI.sound.play("chirp1", { volume: vol, singleInstance: true });
        else if (soundNr < 0.4) PIXI.sound.play("chirp2", { volume: vol, singleInstance: true });
        else if (soundNr < 0.6) PIXI.sound.play("chirp3", { volume: vol, singleInstance: true });
        else if (soundNr < 0.8) PIXI.sound.play("chirp4", { volume: vol, singleInstance: true });
        else PIXI.sound.play("chirp5", { volume: vol, singleInstance: true });
    }

    const rand3 = Math.random();

    if (rand3 < 0.0001) {
        const vol = Math.random();
        PIXI.sound.play("owl", { volume: vol, singleInstance: true });
    }

    const rand4 = Math.random();

    if (rand4 < 0.0001) {
        const vol = Math.random();
        PIXI.sound.play("prey", { volume: vol, singleInstance: true });
    }

    const rand5 = Math.random();

    if (rand5 < 0.0001) {
        const vol = Math.random();
        PIXI.sound.play("cricket", { volume: vol, singleInstance: true });
    }
}