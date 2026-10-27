// Mfumo wa Sauti Halisi za Mabasi na Malori ya Tanzania (Web Audio API Synthesizer)

class SoundSystem {
  constructor() {
    this.ctx = null
    this.engineOsc1 = null
    this.engineOsc2 = null
    this.turboOsc = null
    this.engineGain = null
    this.turboGain = null
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
      const now = this.ctx.currentTime

      // 1. Piston Rumble (Sawtooth low-end)
      this.engineOsc1 = this.ctx.createOscillator()
      this.engineOsc1.type = 'sawtooth'
      this.engineOsc1.frequency.setValueAtTime(38, now)

      // 2. Sub-bass Thud (Triangle deep low-end)
      this.engineOsc2 = this.ctx.createOscillator()
      this.engineOsc2.type = 'triangle'
      this.engineOsc2.frequency.setValueAtTime(24, now)

      // Lowpass Filter kwa sauti nzito ya dizeli
      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(150, now)

      this.engineGain = this.ctx.createGain()
      this.engineGain.gain.setValueAtTime(0.18, now)

      this.engineOsc1.connect(filter)
      this.engineOsc2.connect(filter)
      filter.connect(this.engineGain)
      this.engineGain.connect(this.ctx.destination)

      this.engineOsc1.start()
      this.engineOsc2.start()

      // 3. Turbocharger Whistle (Sauti ya filimbi ya turbo)
      this.turboOsc = this.ctx.createOscillator()
      this.turboOsc.type = 'sine'
      this.turboOsc.frequency.setValueAtTime(1200, now)

      this.turboGain = this.ctx.createGain()
      this.turboGain.gain.setValueAtTime(0.0, now)

      this.turboOsc.connect(this.turboGain)
      this.turboGain.connect(this.ctx.destination)
      this.turboOsc.start()

      this.isStarted = true
    } catch (e) {
      console.warn('Audio start error:', e)
    }
  }

  // Badilisha mngurumo na mlio wa turbo kulingana na speed na throttle
  updateEngine(speedKmH, throttle) {
    if (!this.ctx || !this.isStarted) return
    const now = this.ctx.currentTime

    // Injini ya dizeli
    const baseFreq = 38 + Math.abs(speedKmH) * 1.1 + (throttle ? 16 : 0)
    this.engineOsc1.frequency.setTargetAtTime(baseFreq, now, 0.08)
    this.engineOsc2.frequency.setTargetAtTime(baseFreq * 0.55, now, 0.08)

    const volume = this.isMuted ? 0 : 0.16 + (throttle ? 0.09 : 0)
    this.engineGain.gain.setTargetAtTime(volume, now, 0.1)

    // Turbo whistle inapokanyaga mafuta
    if (this.turboOsc && this.turboGain) {
      const turboFreq = 1100 + Math.abs(speedKmH) * 18 + (throttle ? 400 : 0)
      this.turboOsc.frequency.setTargetAtTime(turboFreq, now, 0.12)
      const turboVol = this.isMuted ? 0 : (throttle ? 0.035 : 0.005)
      this.turboGain.gain.setTargetAtTime(turboVol, now, 0.15)
    }
  }

  // Sauti ya Breki ya Upepo (Air brake dump "pssshhhh")
  playAirBrake() {
    this.init()
    if (!this.ctx || this.isMuted) return
    if (this.ctx.state === 'suspended') this.ctx.resume()

    try {
      const bufferSize = this.ctx.sampleRate * 0.38
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const output = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }

      const whiteNoise = this.ctx.createBufferSource()
      whiteNoise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 1750
      filter.Q.value = 3.2

      const gain = this.ctx.createGain()
      const now = this.ctx.currentTime
      gain.gain.setValueAtTime(0.28, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38)

      whiteNoise.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      whiteNoise.start()
    } catch (e) {
      console.warn('Airbrake error:', e)
    }
  }

  // Sauti ya Milango ya Upepo ya Basi (Pneumatic Passenger Door "pssshh-clack")
  playDoorSound() {
    this.init()
    if (!this.ctx || this.isMuted) return
    if (this.ctx.state === 'suspended') this.ctx.resume()

    try {
      const now = this.ctx.currentTime
      const bufferSize = this.ctx.sampleRate * 0.45
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const output = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1

      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 1200

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.22, now)
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.45)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      noise.start(now)
    } catch (e) {}
  }

  // Honi Nzito ya Mabasi ya Tanzania (Multi-tone Melodious Bus Air Horn / Basuri Telolet)
  playBusHorn() {
    this.init()
    if (!this.ctx || this.isMuted) return
    if (this.ctx.state === 'suspended') this.ctx.resume()

    try {
      const now = this.ctx.currentTime
      // Noti za Honi ya Basi la Mkoani: G4 (392Hz), B4 (493Hz), D5 (587Hz)
      const notes = [
        { f: 392, t: 0.0, d: 0.18 },
        { f: 493, t: 0.16, d: 0.18 },
        { f: 587, t: 0.32, d: 0.45 }
      ]

      notes.forEach(({ f, t, d }) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(f, now + t)

        const filter = this.ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(1400, now + t)

        gain.gain.setValueAtTime(0.32, now + t)
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d)

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(now + t)
        osc.stop(now + t + d)
      })
    } catch (e) {
      console.warn('Bus horn error:', e)
    }
  }

  // Fallback Lori Horn
  playHorn() {
    this.playBusHorn()
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    return this.isMuted
  }
}

export const sounds = new SoundSystem()
