// ============================================
// Public Holidays API
// ============================================

import axios from 'axios';
import { supabase } from '@/lib/supabase';
import type { PublicHoliday } from '@/types/models';

const HOLIDAYS_API_URL = import.meta.env.VITE_HOLIDAYS_API_URL || 'https://date.nager.at/api/v3';

// ============================================
// GET HOLIDAYS FROM DATABASE
// ============================================

export const getPublicHolidays = async (year?: number): Promise<PublicHoliday[]> => {
  const targetYear = year || new Date().getFullYear();

  const { data, error } = await supabase
    .from('public_holidays')
    .select('*')
    .eq('year', targetYear)
    .eq('is_active', true)
    .order('date');

  if (error) throw error;
  return data as any as PublicHoliday[];
};

export const getHolidaysInRange = async (
  startDate: string,
  endDate: string
): Promise<PublicHoliday[]> => {
  const { data, error } = await supabase
    .from('public_holidays')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .eq('is_active', true)
    .order('date');

  if (error) throw error;
  return data as any as PublicHoliday[];
};

export const isHoliday = async (date: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('public_holidays')
    .select('id')
    .eq('date', date)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return false;
    throw error;
  }
  return !!data;
};

// ============================================
// SYNC FROM NAGER.DATE API
// ============================================

const fetchHolidaysFromAPI = async (year: number) => {
  try {
    const response = await axios.get(`${HOLIDAYS_API_URL}/PublicHolidays/${year}/NG`);
    return response.data;
  } catch (error) {
    console.error('Error fetching holidays from API:', error);
    throw new Error('Failed to fetch holidays from Nager.Date API');
  }
};

export const syncHolidaysFromAPI = async (year: number) => {
  const apiHolidays = await fetchHolidaysFromAPI(year);

  const holidaysToInsert = apiHolidays.map((holiday: any) => ({
    date: holiday.date,
    name: holiday.localName || holiday.name,
    year,
    is_active: true,
    source: 'nager.date',
  }));

  const { data, error } = await supabase
    .from('public_holidays')
    .upsert(holidaysToInsert, { onConflict: 'date' })
    .select();

  if (error) throw error;

  const syncedAt = new Date().toISOString();
  await supabase
    .from('system_settings')
    .update({ value: JSON.stringify(syncedAt) })
    .eq('key', 'holidays_last_sync');

  return { year, synced_count: data.length, holidays: data, synced_at: syncedAt };
};

// ============================================
// MANUAL MANAGEMENT (Admin)
// ============================================

export const addHoliday = async (date: string, name: string): Promise<PublicHoliday> => {
  const year = new Date(date).getFullYear();

  const { data, error } = await supabase
    .from('public_holidays')
    .insert({ date, name, year, is_active: true, source: 'manual' })
    .select()
    .single();

  if (error) throw error;
  return data as any as PublicHoliday;
};

export const deleteHoliday = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('public_holidays')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw error;
};

export const ensureHolidaysLoaded = async (year: number): Promise<void> => {
  const { count } = await supabase
    .from('public_holidays')
    .select('*', { count: 'exact', head: true })
    .eq('year', year)
    .eq('is_active', true);

  if (!count || count === 0) {
    console.log(`No holidays found for ${year}, syncing from API...`);
    try {
      await syncHolidaysFromAPI(year);
    } catch (error) {
      console.error(`Failed to sync holidays:`, error);
    }
  }
};