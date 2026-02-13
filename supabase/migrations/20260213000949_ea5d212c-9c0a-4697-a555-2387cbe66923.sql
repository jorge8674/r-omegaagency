
-- Add assigned_to column to clients (references the user_id from profiles)
ALTER TABLE public.clients 
ADD COLUMN assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX idx_clients_assigned_to ON public.clients(assigned_to);
