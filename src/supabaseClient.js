// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ntpskffttmpcbjqczlko.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cHNrZmZ0dG1wY2JqcWN6bGtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MDE4MTUsImV4cCI6MjA2MDI3NzgxNX0.hnFDlxSQCyQwnKA0l6y7auI7PER1LIo3gbFZ7VnwgQM'
export const supabase = createClient(supabaseUrl, supabaseKey)
