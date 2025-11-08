import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AddGoalFormProps {
  onAddGoal: (goal: {
    productName: string;
    targetPrice: number;
    weeklySavings: number;
    currentSavings: number;
  }) => void;
}

const AddGoalForm = ({ onAddGoal }: AddGoalFormProps) => {
  const [productName, setProductName] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [weeklySavings, setWeeklySavings] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !targetPrice || !weeklySavings) {
      return;
    }

    onAddGoal({
      productName,
      targetPrice: parseFloat(targetPrice),
      weeklySavings: parseFloat(weeklySavings),
      currentSavings: currentSavings ? parseFloat(currentSavings) : 0,
    });

    setProductName("");
    setTargetPrice("");
    setWeeklySavings("");
    setCurrentSavings("");
  };

  return (
    <Card className="border-border bg-gradient-to-br from-card to-card/80 shadow-[var(--shadow-medium)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <PlusCircle className="h-5 w-5 text-primary" />
          Add New Savings Goal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-foreground">Product Name</Label>
            <Input
              id="productName"
              placeholder="e.g., New Laptop"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className="border-input bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetPrice" className="text-foreground">Target Price (₹)</Label>
            <Input
              id="targetPrice"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g., 1500"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              required
              className="border-input bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weeklySavings" className="text-foreground">Weekly Savings (₹)</Label>
            <Input
              id="weeklySavings"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g., 50"
              value={weeklySavings}
              onChange={(e) => setWeeklySavings(e.target.value)}
              required
              className="border-input bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentSavings" className="text-foreground">
              Current Savings (₹) <span className="text-muted-foreground text-sm">(optional)</span>
            </Label>
            <Input
              id="currentSavings"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g., 300"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
              className="border-input bg-background"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Goal
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddGoalForm;
