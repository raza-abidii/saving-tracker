import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SavingsGoalCardProps {
  id: string;
  productName: string;
  targetPrice: number;
  weeklySavings: number;
  currentSavings: number;
  onDelete: (id: string) => void;
  onUpdateSavings: (id: string, newAmount: number) => void;
}

const SavingsGoalCard = ({
  id,
  productName,
  targetPrice,
  weeklySavings,
  currentSavings,
  onDelete,
  onUpdateSavings,
}: SavingsGoalCardProps) => {
  const [weeklyProgress, setWeeklyProgress] = useState("");
  const [spendAmount, setSpendAmount] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [showSpendInput, setShowSpendInput] = useState(false);

  const remainingAmount = targetPrice - currentSavings;
  const weeksRemaining = Math.ceil(remainingAmount / weeklySavings);
  const progressPercentage = Math.min((currentSavings / targetPrice) * 100, 100);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const handleAddProgress = () => {
    if (weeklyProgress && parseFloat(weeklyProgress) > 0) {
      const newTotal = currentSavings + parseFloat(weeklyProgress);
      onUpdateSavings(id, newTotal);
      setWeeklyProgress("");
      setShowAddInput(false);
    }
  };

  const handleSpendAmount = () => {
    if (spendAmount && parseFloat(spendAmount) > 0) {
      const newTotal = Math.max(0, currentSavings - parseFloat(spendAmount));
      onUpdateSavings(id, newTotal);
      setSpendAmount("");
      setShowSpendInput(false);
    }
  };

  return (
    <Card className="overflow-hidden border-border bg-gradient-to-br from-card to-card/80 shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-medium)] transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-semibold text-foreground">{productName}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-primary">{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2.5" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="text-xs text-muted-foreground mb-1">Target Price</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(targetPrice)}</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="text-xs text-muted-foreground mb-1">Current Savings</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(currentSavings)}</p>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-3 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Time to Goal</p>
              <p className="text-2xl font-bold text-foreground">
                {weeksRemaining} {weeksRemaining === 1 ? "week" : "weeks"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Weekly Savings</p>
              <p className="text-lg font-semibold text-primary">{formatCurrency(weeklySavings)}</p>
            </div>
          </div>
        </div>

        {remainingAmount > 0 && (
          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{formatCurrency(remainingAmount)}</span> left to save
            </p>
          </div>
        )}

        {remainingAmount > 0 && (
          <div className="rounded-lg bg-accent/10 p-3 border border-accent/20">
            {!showAddInput ? (
              <Button
                onClick={() => setShowAddInput(true)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Weekly Progress
              </Button>
            ) : (
              <div className="space-y-3">
                <Label htmlFor={`progress-${id}`} className="text-sm text-foreground">
                  Add Amount (₹)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={`progress-${id}`}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g., 500"
                    value={weeklyProgress}
                    onChange={(e) => setWeeklyProgress(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddProgress}
                    size="sm"
                    disabled={!weeklyProgress || parseFloat(weeklyProgress) <= 0}
                  >
                    Add
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddInput(false);
                      setWeeklyProgress("");
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentSavings > 0 && (
          <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20">
            {!showSpendInput ? (
              <Button
                onClick={() => setShowSpendInput(true)}
                variant="outline"
                size="sm"
                className="w-full text-destructive hover:text-destructive border-destructive/30"
              >
                <Minus className="h-4 w-4 mr-2" />
                Spend / Remove Money
              </Button>
            ) : (
              <div className="space-y-3">
                <Label htmlFor={`spend-${id}`} className="text-sm text-foreground">
                  Remove Amount (₹)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={`spend-${id}`}
                    type="number"
                    step="0.01"
                    min="0"
                    max={currentSavings}
                    placeholder={`Max: ${currentSavings}`}
                    value={spendAmount}
                    onChange={(e) => setSpendAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSpendAmount}
                    size="sm"
                    variant="destructive"
                    disabled={!spendAmount || parseFloat(spendAmount) <= 0}
                  >
                    Remove
                  </Button>
                  <Button
                    onClick={() => {
                      setShowSpendInput(false);
                      setSpendAmount("");
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavingsGoalCard;
