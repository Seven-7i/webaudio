
// 功能按钮
const btn_play_el = document.getElementById("btn_play");
const btn_stop_el = document.getElementById("btn_stop");
const btn_reset_el = document.getElementById("btn_reset");
const btn_status_el = document.getElementById("btn_status");

// 绘制按钮
const btn_draw_line_el = document.getElementById("btn_draw_line");
const btn_draw_bar_el = document.getElementById("btn_draw_bar");

const canvasEl = document.getElementById("canvas");
/** @type {HTMLCanvasElement} */
const canvasCtx = canvasEl.getContext("2d");

// 解码后的音频数据
let decodeBufferData;
// 创建音频上下文
let audioCtx = new AudioContext();
// 音频源节点
let sourceNode;
// 分析节点
let analyserNode;
// 频率数据数组
let dataArray;

// 绘制形状，'line'：线条，'bar'：柱状
let sharp = 'line'

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
      decodeBufferData = decodedBuffer;
      initAudio()
    })
}

const initAudio = () => {
  if (audioCtx.state !== 'closed') audioCtx.close();
  canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height); // 清空画布
  if (drawVisual) cancelAnimationFrame(drawVisual);

  audioCtx = new AudioContext()
  sourceNode = audioCtx.createBufferSource();
  sourceNode.buffer = decodeBufferData;

  analyserNode = audioCtx.createAnalyser();
  // 设置快速傅里叶变换的大小
  analyserNode.fftSize = 512;

  dataArray = new Uint8Array(analyserNode.frequencyBinCount)

  sourceNode.connect(analyserNode).connect(audioCtx.destination);
  sourceNode.start(0)
  audioCtx.suspend();

  btn_play_el.textContent = "play";
}

let drawVisual;
const draw = () => {
  console.log('在执行')
  drawVisual = requestAnimationFrame(draw);
  analyserNode.getByteFrequencyData(dataArray); // 获取频率数据
  canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height); // 清空画布
  switch (sharp) {
    case 'line':
      drawLine();
      break;
    case 'bar':
      drawBar();
      break;
    default:
      drawLine();
      break;
  }
};

const drawLine = () => {
  canvasCtx.strokeStyle = "#fff";
  canvasCtx.lineWidth = 1;
  canvasCtx.beginPath(); // 开始路径
  canvasCtx.moveTo(0, canvasEl.height / 2);
  for (let i = 0; i < dataArray.length; i++) {
    const value = dataArray[i] / 255 * canvasEl.height;
    canvasCtx.lineTo(i, value);
  }
  canvasCtx.stroke(); // 结束路径
}

const drawBar = () => {
  canvasCtx.fillStyle = "red";
  const len = dataArray.length / 2;
  const barWidth = canvasEl.width / len;
  for (let i = 0; i < len; i++) {
    const data = dataArray[i];
    const barHeight = data / 255 * canvasEl.height;
    const x = i * barWidth;
    const y = canvasEl.height - barHeight;
    canvasCtx.fillRect(x, y, barWidth - 2, barHeight);
  }
}


btn_play_el.addEventListener("click", () => {
  if (audioCtx.state === 'running') {
    audioCtx.suspend();
    cancelAnimationFrame(drawVisual);
    btn_play_el.textContent = "continue";
  } else if (audioCtx.state === 'suspended') {
    audioCtx.resume();
    draw();
    btn_play_el.textContent = "pause";
  }

});


// #region 功能按钮点击事件处理
btn_stop_el.addEventListener("click", () => {
  console.log(audioCtx);
  cancelAnimationFrame(drawVisual);
  if (audioCtx.state !== 'closed') audioCtx.close();
});

btn_reset_el.addEventListener("click", () => {
  initAudio();
});

btn_status_el.addEventListener("click", () => {
  console.log(audioCtx)
  console.log(sourceNode)
});
// #endregion

// #region 绘制按钮点击事件处理
btn_draw_line_el.addEventListener("click", () => {
  sharp = 'line'
  draw()
});

btn_draw_bar_el.addEventListener("click", () => {
  sharp = 'bar'
  draw()
});
// #endregion

init();