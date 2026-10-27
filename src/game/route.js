// Mfumo wa Njia Halisi ya Tanzania: Magufuli Bus Terminal (Dar) ➔ Msamvu (Morogoro)

export const TANZANIA_ROUTE = {
  name: 'Dar es Salaam (Magufuli) ➔ Morogoro (Msamvu)',
  totalKm: 190,
  speedScale: 8, // Huongeza kasi ya mahesabu ya km ili safari ichukue dakika 6-8 za mchezo
  milestones: [
    { km: 0, name: 'Stendi ya Magufuli (Mbezi Luis)', type: 'terminal', speedLimit: 50 },
    { km: 18, name: 'Kibamba & Kiluvya', type: 'town', speedLimit: 60 },
    { km: 45, name: 'Mlandizi Stand', type: 'town', speedLimit: 50 },
    { km: 68, name: 'Daraja la Mto Ruvu (Ruvu Bridge)', type: 'bridge', speedLimit: 80 },
    { km: 92, name: 'Mzani wa Vigwaza (Weighbridge)', type: 'weighbridge', speedLimit: 40 },
    { km: 115, name: 'Chalinze Njia Panda (Junction)', type: 'junction', speedLimit: 50 },
    { km: 152, name: 'Mashamba ya Mkonge Mikese', type: 'highway', speedLimit: 80 },
    { km: 175, name: 'Kingolwira & Milima ya Uluguru', type: 'mountain', speedLimit: 70 },
    { km: 190, name: 'Stendi Kuu ya Msamvu (Morogoro)', type: 'terminal', speedLimit: 30 }
  ]
}

export class RouteTracker {
  constructor(totalDistanceKm = 0) {
    this.currentKm = totalDistanceKm
    this.route = TANZANIA_ROUTE
    this.currentMilestoneIndex = 0
    this.isCompleted = false
  }

  update(deltaKm) {
    this.currentKm = Math.min(this.route.totalKm, this.currentKm + deltaKm * this.route.speedScale)

    // Pata milestone ya sasa
    for (let i = this.route.milestones.length - 1; i >= 0; i--) {
      if (this.currentKm >= this.route.milestones[i].km) {
        this.currentMilestoneIndex = i
        break
      }
    }

    if (this.currentKm >= this.route.totalKm) {
      this.isCompleted = true
    }

    return this.getProgress()
  }

  getProgress() {
    const currentM = this.route.milestones[this.currentMilestoneIndex]
    const nextM = this.route.milestones[Math.min(this.route.milestones.length - 1, this.currentMilestoneIndex + 1)]
    const remainingKm = Math.max(0, this.route.totalKm - this.currentKm)

    return {
      currentKm: Math.round(this.currentKm * 10) / 10,
      totalKm: this.route.totalKm,
      remainingKm: Math.round(remainingKm * 10) / 10,
      currentLocation: currentM.name,
      nextLocation: nextM ? nextM.name : 'Stendi ya Msamvu',
      distanceToNext: nextM ? Math.max(0, Math.round((nextM.km - this.currentKm) * 10) / 10) : 0,
      speedLimit: currentM.speedLimit,
      isCompleted: this.isCompleted
    }
  }
}
