import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type SavingsGoal } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Convert database format to app format
const dbToApp = (dbGoal: SavingsGoal) => ({
  id: dbGoal.id,
  productName: dbGoal.product_name,
  targetPrice: dbGoal.target_price,
  weeklySavings: dbGoal.weekly_savings,
  currentSavings: dbGoal.current_savings,
});

// Convert app format to database format
const appToDb = (appGoal: any) => ({
  product_name: appGoal.productName,
  target_price: appGoal.targetPrice,
  weekly_savings: appGoal.weeklySavings,
  current_savings: appGoal.currentSavings,
});

// Fetch all savings goals
export const useSavingsGoals = () => {
  return useQuery({
    queryKey: ['savingsGoals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(dbToApp);
    },
  });
};

// Add a new savings goal
export const useAddSavingsGoal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (goal: Omit<any, 'id'>) => {
      const { data, error } = await supabase
        .from('savings_goals')
        .insert([appToDb(goal)])
        .select()
        .single();

      if (error) throw error;
      return dbToApp(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      toast({
        title: "Goal Added!",
        description: `Started tracking savings for ${data.productName}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add goal",
        variant: "destructive",
      });
    },
  });
};

// Update savings amount
export const useUpdateSavingsGoal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, currentSavings }: { id: string; currentSavings: number }) => {
      const { data, error } = await supabase
        .from('savings_goals')
        .update({ current_savings: currentSavings, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return dbToApp(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      
      if (data.currentSavings >= data.targetPrice) {
        toast({
          title: "🎉 Goal Achieved!",
          description: `Congratulations! You've reached your goal for ${data.productName}`,
        });
      } else {
        toast({
          title: "Progress Updated!",
          description: "Your savings have been updated",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update savings",
        variant: "destructive",
      });
    },
  });
};

// Delete a savings goal
export const useDeleteSavingsGoal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      toast({
        title: "Goal Removed",
        description: "Your savings goal has been deleted",
        variant: "destructive",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete goal",
        variant: "destructive",
      });
    },
  });
};
