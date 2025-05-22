import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ulyticwzrdebhacqahid.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVseXRpY3d6cmRlYmhhY3FhaGlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODIyMzUsImV4cCI6MjA2MzQ1ODIzNX0.1sa4VAX3ePI-faJbIT2ig_JXPzKsDQczeYeZclAARpA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
