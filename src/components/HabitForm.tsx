
import React from 'react';
import { useHabits } from '@/contexts/HabitContext';
import { Habit } from '@/types/habit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface HabitFormProps {
  initialValues?: Habit;
  onClose: () => void;
}

const defaultColors = [
  { value: '#9b87f5', label: 'Purple' },
  { value: '#4ade80', label: 'Green' },
  { value: '#f97316', label: 'Orange' },
  { value: '#fbbf24', label: 'Yellow' },
  { value: '#f87171', label: 'Red' },
  { value: '#0ea5e9', label: 'Blue' },
];

const defaultIcons = ['🏃‍♂️', '💧', '📚', '🧘‍♀️', '🥗', '💤', '🧹', '🚶‍♂️', '💪', '✍️', '🎯', '🎸'];

export const HabitForm: React.FC<HabitFormProps> = ({ initialValues, onClose }) => {
  const { addHabit, updateHabit } = useHabits();
  
  const [name, setName] = React.useState(initialValues?.name || '');
  const [description, setDescription] = React.useState(initialValues?.description || '');
  const [icon, setIcon] = React.useState(initialValues?.icon || '🏃‍♂️');
  const [frequency, setFrequency] = React.useState<'daily' | 'weekly'>(initialValues?.frequency || 'daily');
  const [color, setColor] = React.useState(initialValues?.color || '#9b87f5');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }
    
    const habitData = {
      name,
      description,
      icon,
      frequency: frequency as 'daily' | 'weekly',
      color
    };
    
    if (initialValues) {
      updateHabit({
        ...initialValues,
        ...habitData
      });
    } else {
      addHabit(habitData);
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Habit Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Drink water"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Drink 8 glasses of water daily"
            rows={2}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Icon</Label>
          <RadioGroup 
            value={icon} 
            onValueChange={setIcon}
            className="grid grid-cols-6 gap-2"
          >
            {defaultIcons.map((emoji) => (
              <div key={emoji} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={emoji} 
                  id={`icon-${emoji}`} 
                  className="sr-only"
                />
                <Label
                  htmlFor={`icon-${emoji}`}
                  className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-md text-2xl border 
                    ${icon === emoji 
                      ? 'border-primary bg-primary/10' 
                      : 'border-muted bg-transparent hover:bg-muted/50'
                    }`}
                >
                  {emoji}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select 
              value={frequency} 
              onValueChange={(value) => setFrequency(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <RadioGroup 
              value={color} 
              onValueChange={setColor}
              className="grid grid-cols-3 gap-2"
            >
              {defaultColors.map((colorOption) => (
                <div key={colorOption.value} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={colorOption.value} 
                    id={`color-${colorOption.value}`} 
                    className="sr-only"
                  />
                  <Label
                    htmlFor={`color-${colorOption.value}`}
                    className={`h-8 w-8 cursor-pointer rounded-full border-2 
                      ${color === colorOption.value ? 'border-primary' : 'border-transparent'}`}
                    style={{ backgroundColor: colorOption.value }}
                  />
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {initialValues ? 'Update Habit' : 'Create Habit'}
        </Button>
      </DialogFooter>
    </form>
  );
};
