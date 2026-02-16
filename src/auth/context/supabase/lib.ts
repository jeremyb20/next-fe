import { SUPABASE_API } from '@/config-global';
import { createClient } from '@supabase/supabase-js';

// ----------------------------------------------------------------------

export const supabase = createClient(
  `${SUPABASE_API.url}`,
  `${SUPABASE_API.key}`
);
