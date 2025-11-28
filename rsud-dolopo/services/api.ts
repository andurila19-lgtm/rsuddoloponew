import { supabase, isSupabaseEnabled } from './supabaseClient';
import { Doctor } from '../types';

// Types
export interface Facility {
    id: number;
    name: string;
    category: string;
    price: number;
}
export interface Room {
    id: number;
    name: string;
    class_type: string;
    total_beds: number;
    occupied_beds: number;
    price: number;
}
export interface BankAccount {
    id: number;
    bank_name: string;
    account_number: string;
    account_name: string;
    type: 'Transfer' | 'VA';
    is_active: boolean;
}

// Helper for Mock Data (used if Supabase is not connected or fails)
const getMockData = (key: string, defaultData: any[]) => {
    try {
        const stored = localStorage.getItem(key);
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.error("Error reading local storage", e);
    }
    return defaultData;
};

const setMockData = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error("Error writing to local storage", e);
    }
};

// --- MOCK DATA ---
const MOCK_DOCTORS: Doctor[] = [
  { id: 1, name: 'dr. Andi Wijaya, Sp.PD', specialty: 'Penyakit Dalam', image: 'https://picsum.photos/seed/doc1/200/200', schedule: 'Senin - Kamis, 08.00 - 12.00', available: true },
  { id: 2, name: 'dr. Sarah Utami, Sp.A', specialty: 'Anak', image: 'https://picsum.photos/seed/doc2/200/200', schedule: 'Senin - Jumat, 09.00 - 14.00', available: true },
];

/**
 * Wrapper to attempt Supabase call, fallback to Mock if it fails or is disabled.
 */
async function trySupabase<T>(
    operation: () => Promise<{ data: T | null; error: any }>, 
    fallback: () => T | Promise<T>
): Promise<T> {
    if (isSupabaseEnabled) {
        try {
            const { data, error } = await operation();
            if (!error && data !== null) {
                return data;
            }
            console.warn("Supabase operation failed or returned null, falling back to local data:", error?.message);
        } catch (err) {
            console.warn("Supabase connection error, falling back to local data:", err);
        }
    }
    return fallback();
}

export const api = {
  // --- Public APIs ---

  checkNik: async (nik: string) => {
    return trySupabase(
        async () => {
             const { data, error } = await supabase.from('registrations').select('id').eq('nik', nik);
             return { data: data && data.length > 0, error };
        },
        () => {
            const regs = getMockData('registrations', []);
            return regs.some((r: any) => r.nik === nik);
        }
    );
  },

  getDoctors: async (): Promise<Doctor[]> => {
    return trySupabase(
        async () => {
             const { data, error } = await supabase.from('doctors').select('*');
             return { data: data as Doctor[], error };
        },
        () => getMockData('doctors', MOCK_DOCTORS)
    );
  },

  loginPatient: async (nik: string) => {
    return trySupabase(
        async () => {
            const { data, error } = await supabase.from('registrations').select('*').eq('nik', nik);
            if (error) return { data: null, error };
            return { data: { found: true, data: data || [] }, error: null };
        },
        () => {
            const regs = getMockData('registrations', []);
            const patientRegs = regs.filter((r: any) => r.nik === nik);
            // Allow login if regs exist or just to simulate valid login for demo
            if (patientRegs.length > 0) return { found: true, data: patientRegs };
            if (nik.length >= 10) return { found: true, data: [] }; // Demo: Allow entry for new users
            throw new Error('NIK tidak ditemukan');
        }
    );
  },

  registerPatient: async (data: any) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `REG-${randomNum}`;
    const newData = {
        ...data,
        bookingCode, 
        booking_code: bookingCode,
        payment_status: data.payment === 'bpjs' ? 'Paid' : 'Unpaid',
        payment_detail: data.payment === 'bpjs' ? 'BPJS Kesehatan' : (data.payment_detail || 'Tunai'),
        cost: 0,
        status: 'Pending',
        created_at: new Date().toISOString()
    };

    return trySupabase(
        async () => {
            const { data: resData, error } = await supabase.from('registrations').insert([newData]).select();
            return { data: { message: 'success', data: { ...newData, ...(resData ? resData[0] : {}) } }, error };
        },
        () => {
            const regs = getMockData('registrations', []);
            const savedData = { id: Date.now(), ...newData };
            regs.push(savedData);
            setMockData('registrations', regs);
            return { message: 'success', data: savedData };
        }
    );
  },

  sendMessage: async (data: any) => {
    return trySupabase(
        async () => {
            const { error } = await supabase.from('messages').insert([{ ...data, is_read: false }]);
            return { data: { message: 'success' }, error };
        },
        () => {
            const msgs = getMockData('messages', []);
            msgs.push({ id: Date.now(), ...data, is_read: false, created_at: new Date() });
            setMockData('messages', msgs);
            return { message: 'success' };
        }
    );
  },

  // --- Admin APIs ---

  getRegistrations: async () => {
    return trySupabase(
        async () => {
            const { data, error } = await supabase.from('registrations').select('*').order('created_at', { ascending: false });
            return { data, error };
        },
        () => getMockData('registrations', [])
    );
  },

  updateRegistration: async (
      id: number, 
      status: string, 
      payment_status?: string, 
      cost?: number, 
      payment_detail?: string, 
      payment_proof?: string,
      class_type?: string,
      facility_notes?: string
  ) => {
    const updates: any = { status };
    if (payment_status) updates.payment_status = payment_status;
    if (cost !== undefined) updates.cost = cost;
    if (payment_detail) updates.payment_detail = payment_detail;
    if (payment_proof) updates.payment_proof = payment_proof;
    if (class_type !== undefined) updates.class_type = class_type;
    if (facility_notes !== undefined) updates.facility_notes = facility_notes;

    return trySupabase(
        async () => {
            const { error } = await supabase.from('registrations').update(updates).eq('id', id);
            return { data: true, error };
        },
        () => {
            const regs = getMockData('registrations', []);
            const idx = regs.findIndex((r: any) => r.id === id);
            if (idx !== -1) {
                regs[idx] = { ...regs[idx], ...updates };
                setMockData('registrations', regs);
            }
            return true;
        }
    );
  },

  getMessages: async () => {
     return trySupabase(
        async () => {
            const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
            return { data, error };
        },
        () => getMockData('messages', [])
     );
  },
  
  updateMessage: async (id: number, data: any) => {
    return trySupabase(
        async () => {
            const { error } = await supabase.from('messages').update(data).eq('id', id);
            return { data: true, error };
        },
        () => {
            const msgs = getMockData('messages', []);
            const idx = msgs.findIndex((m: any) => m.id === id);
            if (idx !== -1) {
                msgs[idx] = { ...msgs[idx], ...data };
                setMockData('messages', msgs);
            }
            return true;
        }
    );
  },

  // Doctors CRUD
  addDoctor: async (data: any) => {
    return trySupabase(
        async () => {
            const { error } = await supabase.from('doctors').insert([data]);
            return { data: true, error };
        },
        () => {
            const docs = getMockData('doctors', MOCK_DOCTORS);
            docs.push({ id: Date.now(), ...data });
            setMockData('doctors', docs);
            return true;
        }
    );
  },
  updateDoctor: async (id: number, data: any) => {
    return trySupabase(
        async () => {
            const { error } = await supabase.from('doctors').update(data).eq('id', id);
            return { data: true, error };
        },
        () => {
            const docs = getMockData('doctors', MOCK_DOCTORS);
            const idx = docs.findIndex((d: any) => d.id === id);
            if (idx !== -1) {
                docs[idx] = { ...docs[idx], ...data };
                setMockData('doctors', docs);
            }
            return true;
        }
    );
  },
  deleteDoctor: async (id: number) => {
    return trySupabase(
        async () => {
             const { error } = await supabase.from('doctors').delete().eq('id', id);
             return { data: true, error };
        },
        () => {
            const docs = getMockData('doctors', MOCK_DOCTORS);
            setMockData('doctors', docs.filter((d: any) => d.id !== id));
            return true;
        }
    );
  },

  // Users CRUD
  getUsers: async () => { 
     return trySupabase(
        async () => {
            const { data, error } = await supabase.from('users').select('*');
            return { data, error };
        },
        () => getMockData('users', [])
     );
  },
  addUser: async (data: any) => { 
      return trySupabase(
        async () => {
             const { error } = await supabase.from('users').insert([data]);
             return { data: true, error };
        },
        () => {
             const d = getMockData('users', []); d.push({id: Date.now(), ...data}); setMockData('users', d); return true;
        }
      );
  },
  updateUser: async (id: number, data: any) => { 
      return trySupabase(
        async () => {
            const { error } = await supabase.from('users').update(data).eq('id', id);
            return { data: true, error };
        },
        () => {
            const d = getMockData('users', []); const i = d.findIndex((x:any)=>x.id===id); if(i!==-1) d[i]={...d[i],...data}; setMockData('users', d); return true;
        }
      );
  },
  deleteUser: async (id: number) => { 
      return trySupabase(
        async () => {
            const { error } = await supabase.from('users').delete().eq('id', id);
            return { data: true, error };
        },
        () => {
            const d = getMockData('users', []); setMockData('users', d.filter((x:any)=>x.id!==id)); return true;
        }
      );
  },

  // BPJS CRUD
  getBPJS: async () => { 
      return trySupabase(
        async () => {
            const { data, error } = await supabase.from('bpjs_data').select('*');
            return { data, error };
        },
        () => getMockData('bpjs_data', [])
      );
  },
  addBPJS: async (data: any) => { 
      return trySupabase(
        async () => { const { error } = await supabase.from('bpjs_data').insert([data]); return { data: true, error }; },
        () => { const d = getMockData('bpjs_data', []); d.push({id: Date.now(), ...data}); setMockData('bpjs_data', d); return true; }
      );
  },
  updateBPJS: async (id: number, data: any) => { 
      return trySupabase(
        async () => { const { error } = await supabase.from('bpjs_data').update(data).eq('id', id); return { data: true, error }; },
        () => { const d = getMockData('bpjs_data', []); const i = d.findIndex((x:any)=>x.id===id); if(i!==-1) d[i]={...d[i],...data}; setMockData('bpjs_data', d); return true; }
      );
  },
  deleteBPJS: async (id: number) => { 
      return trySupabase(
        async () => { const { error } = await supabase.from('bpjs_data').delete().eq('id', id); return { data: true, error }; },
        () => { const d = getMockData('bpjs_data', []); setMockData('bpjs_data', d.filter((x:any)=>x.id!==id)); return true; }
      );
  },

  // Facilities
  getFacilities: async () => { 
      return trySupabase(
        async () => { const { data, error } = await supabase.from('facilities').select('*'); return { data, error }; },
        () => getMockData('facilities', [])
      );
  },
  addFacility: async (data: any) => { 
      return trySupabase(
        async () => { const { error } = await supabase.from('facilities').insert([data]); return { data: true, error }; },
        () => { const d = getMockData('facilities', []); d.push({id: Date.now(), ...data}); setMockData('facilities', d); return true; }
      );
  },
  updateFacility: async (id: number, data: any) => { 
      return trySupabase(
        async () => { const { error } = await supabase.from('facilities').update(data).eq('id', id); return { data: true, error }; },
        () => { const d = getMockData('facilities', []); const i = d.findIndex((x:any)=>x.id===id); if(i!==-1) d[i]={...d[i],...data}; setMockData('facilities', d); return true; }
      );
  },
  deleteFacility: async (id: number) => { 
      return trySupabase(
        async () => { const { error } = await supabase.from('facilities').delete().eq('id', id); return { data: true, error }; },
        () => { const d = getMockData('facilities', []); setMockData('facilities', d.filter((x:any)=>x.id!==id)); return true; }
      );
  },

  // Rooms
  getRooms: async () => { 
      return trySupabase(
        async () => { const { data, error } = await supabase.from('rooms').select('*'); return { data, error }; },
        () => getMockData('rooms', [])
      );
  },
  addRoom: async (data: any) => { 
      return trySupabase(
        async () => { const { error } = await supabase.from('rooms').insert([data]); return { data: true, error }; },
        () => { const d = getMockData('rooms', []); d.push({id: Date.now(), ...data}); setMockData('rooms', d); return true; }
      );
  },
  updateRoom: async (id: number, data: any) => { 
      return trySupabase(
        async () => { const { error } = await supabase.from('rooms').update(data).eq('id', id); return { data: true, error }; },
        () => { const d = getMockData('rooms', []); const i = d.findIndex((x:any)=>x.id===id); if(i!==-1) d[i]={...d[i],...data}; setMockData('rooms', d); return true; }
      );
  },
  deleteRoom: async (id: number) => { 
      return trySupabase(
        async () => { const { error } = await supabase.from('rooms').delete().eq('id', id); return { data: true, error }; },
        () => { const d = getMockData('rooms', []); setMockData('rooms', d.filter((x:any)=>x.id!==id)); return true; }
      );
  },

  // Banks
  getBanks: async (): Promise<BankAccount[]> => { 
      return trySupabase(
        async () => {
            const { data, error } = await supabase.from('bank_accounts').select('*');
            return { data: (data as BankAccount[]) || [], error };
        },
        () => getMockData('bank_accounts', [])
      );
  },
  addBank: async (data: any) => { 
      return trySupabase(
        async () => { const { error } = await supabase.from('bank_accounts').insert([data]); return { data: true, error }; },
        () => { const d = getMockData('bank_accounts', []); d.push({id: Date.now(), ...data}); setMockData('bank_accounts', d); return true; }
      );
  },
  updateBank: async (id: number, data: any) => { 
      return trySupabase(
        async () => { const { error } = await supabase.from('bank_accounts').update(data).eq('id', id); return { data: true, error }; },
        () => { const d = getMockData('bank_accounts', []); const i = d.findIndex((x:any)=>x.id===id); if(i!==-1) d[i]={...d[i],...data}; setMockData('bank_accounts', d); return true; }
      );
  },
  deleteBank: async (id: number) => { 
      return trySupabase(
        async () => { const { error } = await supabase.from('bank_accounts').delete().eq('id', id); return { data: true, error }; },
        () => { const d = getMockData('bank_accounts', []); setMockData('bank_accounts', d.filter((x:any)=>x.id!==id)); return true; }
      );
  }
};