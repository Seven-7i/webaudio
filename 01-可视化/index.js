const audioEl = document.getElementById('audio')
const canvasEl = document.getElementById('canvas')

let audioCtx
/** @type {HTMLCanvasElement} */
const canvasCtx = canvasEl.getContext("2d")

audioEl.addEventListener('play', () => {
  audioCtx = new AudioContext()
  // const sourceNode = audioCtx.createMediaElementSource(audioEl)
  // console.log(sourceNode)
  console.log(audioCtx)
})



canvasCtx.fillStyle = "red"
canvasCtx.fillRect(10, 0, 1, 1)
canvasCtx.fillRect(10, 1, 1, 1)
canvasCtx.fillRect(10, 2, 1, 1)
canvasCtx.fillRect(10, 3, 1, 1)
canvasCtx.fillRect(10, 4, 1, 1)
canvasCtx.fillRect(10, 5, 1, 1)
canvasCtx.fillRect(10, 6, 1, 1)
canvasCtx.fillRect(10, 7, 1, 1)
