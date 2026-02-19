import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://jqxpecaykbwflxarlbym.supabase.co'
const supabaseAnonKey = 'sb_publishable_EBKHxJHQxWV_ir-XX59qYg_mDDC-MkJ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
