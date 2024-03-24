const audioCtx = new AudioContext();

const btn_play_el = document.getElementById("btn_play");
const btn_stop_el = document.getElementById("btn_stop");

const canvasEl = document.getElementById("canvas");
/** @type {HTMLCanvasElement} */
const canvasCtx = canvasEl.getContext("2d");

let isPlaying = false;
let drawVisual;

加载音频文件
fetch("../static/demo.mp3")
  .then((response) => {
    console.log("加载完成", response);
    btn_play_el.textContent = "加载完成";
    return response.arrayBuffer();
  })
  .then((arrayBuffer) => {
    console.log(arrayBuffer);
    btn_play_el.textContent = "正在解码...";
    return audioCtx.decodeAudioData(arrayBuffer);
  });

btn_play_el.addEventListener("click", () => {
  btn_play_el.textContent = "正在加载音频...";
  fetch("../static/demo.mp3")
    .then((response) => {
      console.log("加载完成", response);
      btn_play_el.textContent = "加载完成";
      return response.arrayBuffer();
    })
    .then((arrayBuffer) => {
      console.log(arrayBuffer);
      btn_play_el.textContent = "正在解码...";
      return audioCtx.decodeAudioData(arrayBuffer);
    })
    .then((decodedBuffer) => {
      console.log(decodedBuffer);
      btn_play_el.textContent = "解码完成, 配置音轨...";
      // 创建音频源节点
      const sourceNode = new AudioBufferSourceNode(audioCtx, {
        buffer: decodedBuffer,
      });

      // 创建分析节点
      const analyserNode = audioCtx.createAnalyser();
      const array = new Uint8Array(analyserNode.frequencyBinCount); // 频率数组
      console.log("**********", array);

      console.log(sourceNode, analyserNode);
      sourceNode.connect(analyserNode).connect(audioCtx.destination);
      sourceNode.start(0);
      btn_play_el.textContent = "播放中";

      const draw = () => {
        drawVisual = requestAnimationFrame(draw);
        analyserNode.getByteFrequencyData(array); // 获取频率数据
        canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height); // 清空画布
        canvasCtx.strokeStyle = "#fff";
        canvasCtx.lineWidth = 1;
        canvasCtx.beginPath(); // 开始路径
        canvasCtx.moveTo(0, canvasEl.height / 2);
        for (let i = 0; i < array.length; i++) {
          const value = array[i] || canvasEl.height / 2;
          canvasCtx.lineTo(i, value);
        }
        canvasCtx.stroke(); // 结束路径
      };
      draw();
    });
});

btn_stop_el.addEventListener("click", () => {
  console.log(audioCtx);
  cancelAnimationFrame(drawVisual);
  audioCtx.close();
});

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
