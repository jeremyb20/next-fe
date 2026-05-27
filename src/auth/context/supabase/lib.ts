import { createClient } from '@supabase/supabase-js';

import { SUPABASE_API } from '@/config-global';

// ----------------------------------------------------------------------

export const supabase = createClient(
  `${SUPABASE_API.url}`,
  `${SUPABASE_API.key}`
);
