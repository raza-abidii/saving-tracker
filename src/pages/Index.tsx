import { PiggyBank } from "lucide-react";
import AddGoalForm from "@/components/AddGoalForm";
import SavingsGoalCard from "@/components/SavingsGoalCard";
import { 
  useSavingsGoals, 
  useAddSavingsGoal, 
  useUpdateSavingsGoal, 
  useDeleteSavingsGoal 
} from "@/hooks/useSavingsGoals";

interface SavingsGoal {
  id: string;
  productName: string;
  targetPrice: number;
  weeklySavings: number;
  currentSavings: number;
}

const Index = () => {
  const { data: goals = [], isLoading } = useSavingsGoals();
  const addGoalMutation = useAddSavingsGoal();
  const updateGoalMutation = useUpdateSavingsGoal();
  const deleteGoalMutation = useDeleteSavingsGoal();

  const handleAddGoal = (goal: Omit<SavingsGoal, "id">) => {
    addGoalMutation.mutate(goal);
  };

  const handleDeleteGoal = (id: string) => {
    deleteGoalMutation.mutate(id);
  };

  const handleUpdateSavings = (id: string, currentSavings: number) => {
    updateGoalMutation.mutate({ id, currentSavings });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-[var(--shadow-soft)]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-primary to-accent p-3 shadow-[var(--shadow-soft)]">
              <PiggyBank className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Savings Tracker
              </h1>
              <p className="text-sm text-muted-foreground">Plan your purchases, reach your goals</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* Form Section */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <AddGoalForm onAddGoal={handleAddGoal} />
          </div>

          {/* Goals Section */}
          <div>
            {isLoading ? (
              <div className="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 p-8">
                <div className="text-center">
                  <div className="mx-auto mb-4 rounded-full bg-secondary/50 p-6 w-fit">
                    <PiggyBank className="h-12 w-12 text-muted-foreground animate-pulse" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Loading...</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Fetching your savings goals
                  </p>
                </div>
              </div>
            ) : goals.length === 0 ? (
              <div className="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 p-8">
                <div className="text-center">
                  <div className="mx-auto mb-4 rounded-full bg-secondary/50 p-6 w-fit">
                    <PiggyBank className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">No Savings Goals Yet</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Start by adding your first savings goal to track your progress toward your dream purchase!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Your Goals</h2>
                  <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                    {goals.length} {goals.length === 1 ? "Goal" : "Goals"}
                  </span>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {goals.map((goal) => (
                    <SavingsGoalCard
                      key={goal.id}
                      id={goal.id}
                      productName={goal.productName}
                      targetPrice={goal.targetPrice}
                      weeklySavings={goal.weeklySavings}
                      currentSavings={goal.currentSavings}
                      onDelete={handleDeleteGoal}
                      onUpdateSavings={handleUpdateSavings}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
