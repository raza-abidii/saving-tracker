import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'savingsGoals';

interface SavingsGoal {
  id: string;
  productName: string;
  targetPrice: number;
  weeklySavings: number;
  currentSavings: number;
  createdAt: string;
}

// Get goals from localStorage
const getGoalsFromStorage = (): SavingsGoal[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

// Save goals to localStorage
const saveGoalsToStorage = (goals: SavingsGoal[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Fetch all savings goals
export const useSavingsGoals = () => {
  return useQuery({
    queryKey: ['savingsGoals'],
    queryFn: async () => {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100));
      return getGoalsFromStorage();
    },
  });
};

// Add a new savings goal
export const useAddSavingsGoal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const goals = getGoalsFromStorage();
      const newGoal: SavingsGoal = {
        ...goal,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      const updatedGoals = [newGoal, ...goals];
      saveGoalsToStorage(updatedGoals);
      
      return newGoal;
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
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const goals = getGoalsFromStorage();
      const goalIndex = goals.findIndex(g => g.id === id);
      
      if (goalIndex === -1) {
        throw new Error('Goal not found');
      }
      
      goals[goalIndex].currentSavings = currentSavings;
      saveGoalsToStorage(goals);
      
      return goals[goalIndex];
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
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const goals = getGoalsFromStorage();
      const filteredGoals = goals.filter(g => g.id !== id);
      saveGoalsToStorage(filteredGoals);
      
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
