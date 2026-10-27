import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ycrkwhvlpalcakojvfbs.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_OSXur_d0wPZwsofCwTg-EA_MMNAUvkC'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

// Hifadhi ya Dereva (Local fallback + Supabase Sync)
const LOCAL_STORAGE_KEY = 'bongo_driver_profile'

export function getLocalDriver() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.warn('LocalStorage error:', e)
  }
  return {
    name: 'Dereva Rajab',
    vehicle: 'truck', // 'truck' au 'bus'
    money: 150000, // TSh
    xp: 250,
    level: 1,
    distanceKm: 0,
    fuel: 100
  }
}

export function saveLocalDriver(data) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('LocalStorage save error:', e)
  }
}

// Jaribu kusawazisha na Supabase (Bila kukwama hata kama table bado)
export async function syncDriverWithSupabase(driverData) {
  saveLocalDriver(driverData)
  try {
    const { data, error } = await supabase
      .from('driver_profiles')
      .upsert({
        driver_name: driverData.name,
        money: driverData.money,
        xp: driverData.xp,
        distance_km: driverData.distanceKm,
        updated_at: new Date().toISOString()
      }, { onConflict: 'driver_name' })

    if (error) {
      // Table huenda haijaundwa bado - data inabaki salama kwenye localStorage
      console.log('Supabase sync notice:', error.message)
    }
  } catch (err) {
    console.log('Supabase offline fallback:', err)
  }
}
