
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users manage own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users manage own goals" ON public.goals;
DROP POLICY IF EXISTS "Users manage own review notes" ON public.review_notes;

-- Create PERMISSIVE policies for tasks
CREATE POLICY "Users can select own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- Create PERMISSIVE policies for goals
CREATE POLICY "Users can select own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- Create PERMISSIVE policies for review_notes
CREATE POLICY "Users can select own review_notes" ON public.review_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own review_notes" ON public.review_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own review_notes" ON public.review_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own review_notes" ON public.review_notes FOR DELETE USING (auth.uid() = user_id);
