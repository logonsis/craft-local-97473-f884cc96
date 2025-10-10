import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Trash2 } from "lucide-react";

interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

const TimeManagement = () => {
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({
    monday: { enabled: true, slots: [{ id: "1", start: "09:00", end: "17:00" }] },
    tuesday: { enabled: true, slots: [{ id: "2", start: "09:00", end: "17:00" }] },
    wednesday: { enabled: true, slots: [{ id: "3", start: "09:00", end: "17:00" }] },
    thursday: { enabled: true, slots: [{ id: "4", start: "09:00", end: "17:00" }] },
    friday: { enabled: true, slots: [{ id: "5", start: "09:00", end: "17:00" }] },
    saturday: { enabled: false, slots: [] },
    sunday: { enabled: false, slots: [] },
  });

  const toggleDay = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        slots: !prev[day].enabled && prev[day].slots.length === 0 
          ? [{ id: Date.now().toString(), start: "09:00", end: "17:00" }]
          : prev[day].slots,
      },
    }));
  };

  const addTimeSlot = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [
          ...prev[day].slots,
          { id: Date.now().toString(), start: "09:00", end: "17:00" },
        ],
      },
    }));
  };

  const removeTimeSlot = (day: string, slotId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((slot) => slot.id !== slotId),
      },
    }));
  };

  const updateTimeSlot = (day: string, slotId: string, field: "start" | "end", value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot) =>
          slot.id === slotId ? { ...slot, [field]: value } : slot
        ),
      },
    }));
  };

  const daysOfWeek = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Weekly Availability</h3>
        </div>
        <Badge variant="secondary">
          {Object.values(schedule).filter((day) => day.enabled).length} days active
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Set your working hours for each day. You can add multiple time slots per day.
      </p>

      <div className="space-y-3">
        {daysOfWeek.map(({ key, label }) => (
          <Card key={key} className={!schedule[key].enabled ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={schedule[key].enabled}
                      onCheckedChange={() => toggleDay(key)}
                    />
                    <Label className="font-medium cursor-pointer" onClick={() => toggleDay(key)}>
                      {label}
                    </Label>
                  </div>
                  {schedule[key].enabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addTimeSlot(key)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Slot
                    </Button>
                  )}
                </div>

                {schedule[key].enabled && schedule[key].slots.length > 0 && (
                  <div className="space-y-2 pl-10">
                    {schedule[key].slots.map((slot) => (
                      <div key={slot.id} className="flex items-center gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateTimeSlot(key, slot.id, "start", e.target.value)}
                            className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                          />
                          <span className="text-muted-foreground">to</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateTimeSlot(key, slot.id, "end", e.target.value)}
                            className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                          />
                        </div>
                        {schedule[key].slots.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => removeTimeSlot(key, slot.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline">Reset to Default</Button>
        <Button>Save Schedule</Button>
      </div>
    </div>
  );
};

export default TimeManagement;
