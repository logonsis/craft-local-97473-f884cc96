import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  rate: string;
  isActive: boolean;
}

const ServiceManagement = () => {
  const [services, setServices] = useState<Service[]>([
    { id: "1", name: "Plumbing Repairs", rate: "500", isActive: true },
    { id: "2", name: "Electrical Work", rate: "600", isActive: true },
    { id: "3", name: "Carpentry", rate: "450", isActive: false },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({ name: "", rate: "", isActive: true });

  const handleAddService = () => {
    if (!formData.name || !formData.rate) {
      toast.error("Please fill in all fields");
      return;
    }

    const newService: Service = {
      id: Date.now().toString(),
      name: formData.name,
      rate: formData.rate,
      isActive: formData.isActive,
    };

    setServices([...services, newService]);
    setFormData({ name: "", rate: "", isActive: true });
    setIsAddDialogOpen(false);
    toast.success("Service added successfully");
  };

  const handleEditService = () => {
    if (!currentService || !formData.name || !formData.rate) {
      toast.error("Please fill in all fields");
      return;
    }

    setServices(
      services.map((service) =>
        service.id === currentService.id
          ? { ...service, name: formData.name, rate: formData.rate, isActive: formData.isActive }
          : service
      )
    );
    setIsEditDialogOpen(false);
    setCurrentService(null);
    setFormData({ name: "", rate: "", isActive: true });
    toast.success("Service updated successfully");
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter((service) => service.id !== id));
    setDeleteServiceId(null);
    toast.success("Service deleted successfully");
  };

  const openEditDialog = (service: Service) => {
    setCurrentService(service);
    setFormData({ name: service.name, rate: service.rate, isActive: service.isActive });
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    setFormData({ name: "", rate: "", isActive: true });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Services</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>
                Add a new service to your profile. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="service-name">Service Name</Label>
                <Input
                  id="service-name"
                  placeholder="e.g., Plumbing Repairs"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-rate">Rate per Hour (₹)</Label>
                <Input
                  id="service-rate"
                  type="number"
                  placeholder="500"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="service-active">Active</Label>
                <Switch
                  id="service-active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddService}>Add Service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {services.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8 text-muted-foreground">
              No services added yet. Click "Add Service" to get started.
            </CardContent>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h4 className="font-medium">{service.name}</h4>
                  <p className="text-sm text-muted-foreground">₹{service.rate}/hr</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={service.isActive ? "default" : "secondary"}>
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(service)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteServiceId(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update the details of your service.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-service-name">Service Name</Label>
              <Input
                id="edit-service-name"
                placeholder="e.g., Plumbing Repairs"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-service-rate">Rate per Hour (₹)</Label>
              <Input
                id="edit-service-rate"
                type="number"
                placeholder="500"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-service-active">Active</Label>
              <Switch
                id="edit-service-active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditService}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteServiceId} onOpenChange={() => setDeleteServiceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this service from your profile. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteServiceId && handleDeleteService(deleteServiceId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ServiceManagement;
