import { supabase } from '@/lib/supabaseClient';

export interface TntetData {
  district_name: string;
  registered: number;
  qualified: number;
}

export const TNTET_SAMPLE_MAP: Record<string, { registered: number; qualified: number }> = {
  "ARIYALUR": { registered: 22565, qualified: 2390 },
  "CHENGALPATTU": { registered: 14879, qualified: 2659 },
  "CHENNAI": { registered: 27941, qualified: 3790 },
  "CHENNAI (EXT. GCC)": { registered: 27941, qualified: 3790 },
  "COIMBATORE": { registered: 11565, qualified: 2293 },
  "CUDDALORE": { registered: 2730, qualified: 298 },
  "DHARMAPURI": { registered: 26792, qualified: 3813 },
  "DINDIGUL": { registered: 21459, qualified: 2095 },
  "ERODE": { registered: 27079, qualified: 2819 },
  "KALLAKURICHI": { registered: 10319, qualified: 1389 },
  "KANCHEEPURAM": { registered: 5580, qualified: 914 },
  "KANNIYAKUMARI": { registered: 14584, qualified: 1752 },
  "KANYAKUMARI": { registered: 14584, qualified: 1752 },
  "KARUR": { registered: 2791, qualified: 426 },
  "KRISHNAGIRI": { registered: 8136, qualified: 1316 },
  "MADURAI": { registered: 11209, qualified: 1164 },
  "MAYILADUTHURAI": { registered: 7807, qualified: 1059 },
  "NAGAPATTINAM": { registered: 2894, qualified: 473 },
  "NAMAKKAL": { registered: 22163, qualified: 4865 },
  "PERAMBALUR": { registered: 13441, qualified: 2068 },
  "PUDUKKOTTAI": { registered: 11789, qualified: 1772 },
  "RAMANATHAPURAM": { registered: 20632, qualified: 2416 },
  "RANIPET": { registered: 24292, qualified: 3177 },
  "SALEM": { registered: 16592, qualified: 2570 },
  "SIVAGANGAI": { registered: 4086, qualified: 417 },
  "TENKASI": { registered: 24485, qualified: 2624 },
  "THANJAVUR": { registered: 21370, qualified: 4018 },
  "THE NILGIRIS": { registered: 3559, qualified: 725 },
  "NILGIRIS": { registered: 3559, qualified: 725 },
  "THENI": { registered: 28039, qualified: 4082 },
  "THOOTHUKKUDI": { registered: 23541, qualified: 2036 },
  "TUTICORIN": { registered: 23541, qualified: 2036 },
  "TIRUCHIRAPPALLI": { registered: 22252, qualified: 2282 },
  "TRICHY": { registered: 22252, qualified: 2282 },
  "TIRUNELVELI": { registered: 12757, qualified: 1057 },
  "TIRUPATHUR": { registered: 2798, qualified: 318 },
  "TIRUPPUR": { registered: 21409, qualified: 4639 },
  "TIRUVALLUR": { registered: 27295, qualified: 4697 },
  "TIRUVANNAMALAI": { registered: 11723, qualified: 1458 },
  "TIRUVARUR": { registered: 26829, qualified: 2257 },
  "THIRUVARUR": { registered: 26829, qualified: 2257 },
  "VELLORE": { registered: 27845, qualified: 3852 },
  "VILLUPURAM": { registered: 22816, qualified: 3058 },
  "VILUPPURAM": { registered: 22816, qualified: 3058 },
  "VIRUDHUNAGAR": { registered: 8234, qualified: 702 }
};

export function getTntetDataForDistrict(districtName: string): { registered: number; qualified: number; passPercentage: number } {
  const upper = districtName.trim().toUpperCase();
  const found = TNTET_SAMPLE_MAP[upper] || TNTET_SAMPLE_MAP[upper.replace('THIRU', 'TIRU')] || { registered: 0, qualified: 0 };
  const passPercentage = found.registered > 0 ? Number(((found.qualified / found.registered) * 100).toFixed(1)) : 0;
  return {
    ...found,
    passPercentage
  };
}
