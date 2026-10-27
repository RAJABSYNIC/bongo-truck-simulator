// Mfumo wa sauti wa Web Audio API (Hakuna haja ya faili za nje za mp3)

class SoundSystem {
  constructor() {
    this.ctx = null
    this.engineOsc1 = null
    this.engineOsc2 = null
    this.engineGain = null
    this.noiseNode = null
    this.isMuted = false
    this.isStarted = false
  }

  init() {
    if (this.ctx) return
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    this.ctx = new AudioContext()
  }

  startEngine() {
    this.init()
    if (!this.ctx || this.isStarted) return
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    try {
      // Osc 1: Low rumble (Piston cycle)
      this.engineOsc1 = this.ctx.createOscillator()
      this.engineOsc1.type = 'sawtooth'
      this.engineOsc1.frequency.setValueAtTime(45, this.ctx.currentTime)

      // Osc 2: Sub-bass thud
      this.engineOsc2 = this.ctx.createOscillator()
      this.engineOsc2.type = 'triangle'
      this.engineOsc2.frequency.setValueAtTime(28, this.ctx.currentTime)

      // Filter for deep muffled diesel sound
      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(140, this.ctx.currentTime)

      this.engineGain = this.ctx.createGain()
      this.engineGain.gain.setValueAtTime(0.18, this.ctx.currentTime)

      this.engineOsc1.connect(filter)
      this.engineOsc2.connect(filter)
      filter.connect(this.engineGain)
      this.engineGain.connect(this.ctx.destination)

      this.engineOsc1.start()
      this.engineOsc2.start()
      this.isStarted = true
    } catch (e) {
      console.warn('Audio start error:', e)
    }
  }

  // Badilisha mngurumo wa injini kutokana na speed / rpm
  updateEngine(speedKmH, throttle) {
    if (!this.ctx || !this.isStarted) return
    const now = this.ctx.currentTime
    const baseFreq = 42 + Math.abs(speedKmH) * 1.1 + (throttle ? 18 : 0)
    this.engineOsc1.frequency.setTargetAtTime(baseFreq, now, 0.08)
    this.engineOsc2.frequency.setTargetAtTime(baseFreq * 0.6, now, 0.08)

    const volume = this.isMuted ? 0 : 0.15 + (throttle ? 0.08 : 0)
    this.engineGain.gain.setTargetAtTime(volume, now, 0.1)
  }

  // Sauti ya Breki ya Upepo (Air brake hiss "pssshhhh")
  playAirBrake() {
    this.init()
    if (!this.ctx || this.isMuted) return
    if (this.ctx.state === 'suspended') this.ctx.resume()

    try {
      const bufferSize = this.ctx.sampleRate * 0.35
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const output = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }

      const whiteNoise = this.ctx.createBufferSource()
      whiteNoise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 1600
      filter.Q.value = 3

      const gain = this.ctx.createGain()
      const now = this.ctx.currentTime
      gain.gain.setValueAtTime(0.25, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35)

      whiteNoise.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      whiteNoise.start()
    } catch (e) {
      console.warn('Airbrake error:', e)
    }
  }

  // Honikadi ya Lori / Basi (Loud Dual Air Horn!)
  playHorn() {
    this.init()
    if (!this.ctx || this.isMuted) return
    if (this.ctx.state === 'suspended') this.ctx.resume()

    try {
      const now = this.ctx.currentTime
      const osc1 = this.ctx.createOscillator()
      const osc2 = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc1.type = 'sawtooth'
      osc2.type = 'sawtooth'
      // Dual resonant chord typical of Scania/Volvo truck air horns
      osc1.frequency.setValueAtTime(185, now) // F#3
      osc2.frequency.setValueAtTime(233, now) // Bb3

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(800, now)

      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65)

      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 0.65)
      osc2.stop(now + 0.65)
    } catch (e) {
      console.warn('Horn error:', e)
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    return this.isMuted
  }
}

export const sounds = new SoundSystem()
