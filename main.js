'use strict';

document.documentElement.addEventListener('mousedown', () => {
  if (Tone.context.state !== 'running') Tone.context.resume();
});

Tone.Transport.bpm.value = 120;//テンポ設定
Tone.Transport.scheduleRepeat(play_metronome, '16n');//"16n"が来る度に'play_metronome'関数が呼び出される

const SOUND_FILE_DIR = 'audio/';

const clave_sound = new Tone.Sampler({ C4: SOUND_FILE_DIR + 'clave.wav' }).toMaster();
const kata_sound = new Tone.Sampler({ C4: SOUND_FILE_DIR + 'kata.wav' }).toMaster();

//演奏データ：1で発声、0で無音
const metronome = [1, 0, 0, 0];

const rumba_clave = [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0];
const rumba_kata = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1];

const bembe_clave = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1];

const downbeat_4 = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
const downbeat_3 = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0];

const son_clave32 = [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0];
const son_clave23 = [0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];

let rythmToPlay = [];//演奏対象となるリズムを入れる
let rythmToPlay_sub = [];//kata、downbeatなどサブ楽器

let play_count = 0;//演奏する配列の番号、repeat関数内で参照する

function play_metronome(time) {
  const indexOfRythm = play_count % rythmToPlay.length;
  if (rythmToPlay[indexOfRythm] === 1) {
    clave_sound.triggerAttackRelease("C4", "8n", time);
  }
  if (rythmToPlay_sub[indexOfRythm]) {
    if (rythmToPlay_sub[indexOfRythm] === 1) {
      kata_sound.triggerAttackRelease("C4", "8n", time, 0.5);//velocity=0.5で音量調節
    }
  }
  play_count++;
}

$(document).ready(function () {

  $(".rythmBtn").prop("disabled", false);
  $(".stopBtn").prop("disabled", true);


  $('#metronomeBtn').click(function (e) {
    rythmToPlay = metronome;
    startPlay(this);
  });

  $('#rumbaBtn').click(function (e) {
    rythmToPlay = rumba_clave;
    startPlay(this);
  });

  $('#rumbaconkataBtn').click(function (e) {
    rythmToPlay = rumba_clave;
    rythmToPlay_sub = rumba_kata;
    startPlay(this);
  });

  $('#bembeBtn').click(function (e) {
    rythmToPlay = bembe_clave;
    startPlay(this);
  });

  $('#son32Btn').click(function (e) {
    rythmToPlay = son_clave32;
    startPlay(this);
  });

  $('#son23Btn').click(function (e) {
    rythmToPlay = son_clave23;
    startPlay(this);
  });

  $('#tempo_disp').val($('#tempo_slider').val());

  $('.stopBtn').click(function (e) {
    stop();
  });

  $('#tempo_slider').on('input', function (e) {
    const tempo = $(this).val();
    $('#tempo_disp').val(tempo);
    Tone.Transport.bpm.value = tempo;
  });

});

function startPlay(that) {
  Tone.Transport.seconds = 0;
  Tone.Transport.start();
  $(".rythmBtn").prop("disabled", true);
  $(".stopBtn").prop("disabled", false);
  $(that).prop("aria-pressed", true);

}

function stop() {
  Tone.Transport.stop();
  Tone.Transport.cancel();
  $(".rythmBtn").prop("disabled", false);
  $(".stopBtn").prop("disabled", true);
  $(".rythmBtn").prop("aria-pressed", false);
  play_count = 0;
  rythmToPlay = [];
  rythmToPlay_sub = [];
}
