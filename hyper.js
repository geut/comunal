const hyperdrive = require('@geut/hyperdrive-promise')
const http = require('http')
const { json, stream } = require('http-responders')

const createServer = ({ drive }) => {
  const streamingServer = http.createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Request-Method', '*')
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
    response.setHeader('Access-Control-Allow-Headers', '*')
    if (request.method === 'OPTIONS') {
      response.writeHead(200)
      response.end()
      return
    }

    json(response, { hola: 'mundo', version: drive.version })
  })

  return streamingServer
}

exports.startHyper = async (opts = {}) => {
  const drive = hyperdrive(`./streams/broadcasted/${Date.now()}`)
  await drive.ready()
  const streamingServer = createServer({ drive })
  streamingServer.listen(opts.port || 3000)
}

/*
var fs = require('fs')
var recorder = require('media-recorder-stream')
var hyperdiscovery = require('hyperdiscovery')
var pump = require('pump')
var cluster = require('webm-cluster-stream')

exports.start = start
exports.stop = stop

function start (startCallback, peerCallback, audioOnly) {
  var swarm,
    block = 0
  var mimeType = audioOnly
    ? 'audio/webm;codecs=opus'
    : 'video/webm;codecs=vp9,opus'
  var mediaRecorder = recorder(window.stream, {
    mimeType,
    videoBitsPerSecond: 600000,
    audioBitsPerSecond: 32000
  })

  window.recorder = mediaRecorder

  var feed = hyperdrive(`./streams/broadcasted/${Date.now()}`)

  feed.on('ready', function () {
    swarm = hyperdiscovery(feed, { live: true })
    startCallback(feed.key.toString('hex'))

    fs.readFile(`${__dirname}/viewer.html`, function (err, data) {
      if (err) console.log('error reading viewer.html', err)

      feed.writeFile('mime.js', `var mime = "${mimeType}";`, function (err) {
        if (err) console.log('error copying mime.js', err)
      })

      feed.writeFile('index.html', data.toString(), function (err) {
        if (err) console.log('error copying viewer.html', err)
      })
    })

    var stream = pump(mediaRecorder, cluster(), function (err) {
      if (err) console.log('error closing stream pump: ', err)

      swarm.close()
      feed.close(function (err) {
        if (err) console.log('error closing feed: ', err)
      })
    })

    stream.on('data', function (data) {
      console.log(`writing block ${block}`)
      feed.writeFile(block + '.buffer', data, function (err) {
        if (err) console.log('block write error', err)
      })

      console.log(`Streaming to ${swarm.connections.length} peers`)

      peerCallback(swarm.connections.length)

      block++
    })
  })
}

function stop (cb) {
  window.recorder.stop()
  cb()
}

*/
