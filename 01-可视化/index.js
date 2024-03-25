const audioCtx = new AudioContext();

const btn_play_el = document.getElementById("btn_play");
const btn_stop_el = document.getElementById("btn_stop");
const btn_status_el = document.getElementById("btn_status");

const canvasEl = document.getElementById("canvas");
/** @type {HTMLCanvasElement} */
const canvasCtx = canvasEl.getContext("2d");

const init = () => {
  // 加载音频文件
  btn_play_el.textContent = "正在加载音频...";
  fetch("../static/demo.mp3")
    .then((response) => {
      btn_play_el.textContent = "加载完成";
      return response.arrayBuffer();
    })
    .then((arrayBuffer) => {
      btn_play_el.textContent = "正在解码...";
      return audioCtx.decodeAudioData(arrayBuffer);
    })
    .then((decodedBuffer) => {
      btn_play_el.textContent = "解码完成, 配置音轨...";
      sourceNode = audioCtx.createBufferSource();

      sourceNode.buffer = decodedBuffer;

      analyserNode = audioCtx.createAnalyser();
      // 设置快速傅里叶变换的大小
      analyserNode.fftSize = 2048;

      dataArray = new Uint8Array(analyserNode.frequencyBinCount)

      sourceNode.connect(analyserNode).connect(audioCtx.destination);
      
      btn_play_el.textContent = "play";
    })
}

// 音频源节点
let sourceNode;
// 分析节点
let analyserNode;
// 频率数据数组
let dataArray;



let drawVisual;
const draw = () => {
  console.log('在执行')
  drawVisual = requestAnimationFrame(draw);
  analyserNode.getByteFrequencyData(dataArray); // 获取频率数据
  canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height); // 清空画布
  canvasCtx.strokeStyle = "#fff";

  canvasCtx.lineWidth = 1;
  canvasCtx.beginPath(); // 开始路径
  canvasCtx.moveTo(0, canvasEl.height / 2);
  for (let i = 0; i < dataArray.length; i++) {
    const value = dataArray[i] / 255 * canvasEl.height;
    canvasCtx.lineTo(i, value);
  }
  canvasCtx.stroke(); // 结束路径
};


btn_play_el.addEventListener("click", () => {
  console.log(sourceNode, getIsPlaying())
  // 
  if (getIsPlaying()) {
    sourceNode.stop();


  } else {
    const offset = audioCtx.currentTime % sourceNode.buffer.duration;
    sourceNode.start(0, offset);
  }
  draw();

});

btn_stop_el.addEventListener("click", () => {
  console.log(audioCtx);
  cancelAnimationFrame(drawVisual);
  audioCtx.close();
});

btn_status_el.addEventListener("click", () => {
  console.log(audioCtx)
  console.log(sourceNode)
  // 假设sourceNode是已经创建并播放的AudioBufferSourceNode对象
  

});

init();

const getIsPlaying = () => {
  console.log(audioCtx.state )
  if (audioCtx.state === 'running' && sourceNode && sourceNode.buffer) {
    if (audioCtx.currentTime > 0 && audioCtx.currentTime < sourceNode.buffer.duration) {
      return true;
    }
  }
  return false;
}

// const audioEl = document.getElementById('audio')

// let audioCtx

// audioEl.addEventListener('play', (el) => {
//   console.log('play', el)
//   audioCtx = new AudioContext()
//   const sourceNode = audioCtx.createMediaElementSource(audioEl)
//   console.log(sourceNode)
//   console.log(audioCtx)
// })

// canvasCtx.fillStyle = "red";
// canvasCtx.fillRect(10, 0, 1, 1);
// canvasCtx.fillRect(10, 1, 1, 1);
// canvasCtx.fillRect(10, 2, 1, 1);
// canvasCtx.fillRect(10, 3, 1, 1);
// canvasCtx.fillRect(10, 4, 1, 1);
// canvasCtx.fillRect(10, 5, 1, 1);
// canvasCtx.fillRect(10, 6, 1, 1);
// canvasCtx.fillRect(10, 7, 1, 1);

// canvasCtx.strokeStyle = "red";
// canvasCtx.lineWidth = 5;
// canvasCtx.beginPath(); // 开始路径
// canvasCtx.moveTo(0, 0);
// canvasCtx.bezierCurveTo(50, 50, 200, 100, 200, 50);
// canvasCtx.stroke(); // 结束路径
