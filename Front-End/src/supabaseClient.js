import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://asxgxisgpkanfjxnvxpp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzeGd4aXNncGthbmZqeG52eHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMzg2OTIsImV4cCI6MjA1NjcxNDY5Mn0.Haap4EYXw3nPwdNkjfeV1WSO3K5PK5jMg0aR4Gs_aGQ";
export const supabase = createClient(supabaseUrl, supabaseKey);
