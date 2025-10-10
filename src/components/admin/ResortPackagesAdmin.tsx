import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Package } from "lucide-react";

interface ResortPackage {
  id: string;
  name: string;
  duration: string;
  price: string;
  original_price: string;
  description: string;
  includes: string[];
  features: string[];
  badge: string;
}

export const ResortPackagesAdmin = () => {
  const [packages, setPackages] = useState<ResortPackage[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ResortPackage | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price: "",
    original_price: "",
    description: "",
    includes: "",
    features: "",
    badge: ""
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const { data, error } = await supabase
      .from("resort_packages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching packages",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setPackages(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const packageData = {
      name: formData.name,
      duration: formData.duration,
      price: formData.price,
      original_price: formData.original_price,
      description: formData.description,
      includes: formData.includes.split("\n").filter(item => item.trim()),
      features: formData.features.split("\n").filter(item => item.trim()),
      badge: formData.badge
    };

    if (editingPackage) {
      const { error } = await supabase
        .from("resort_packages")
        .update(packageData)
        .eq("id", editingPackage.id);

      if (error) {
        toast({
          title: "Error updating package",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({ title: "Package updated successfully!" });
        fetchPackages();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from("resort_packages")
        .insert([packageData]);

      if (error) {
        toast({
          title: "Error creating package",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({ title: "Package created successfully!" });
        fetchPackages();
        resetForm();
      }
    }
  };

  const handleEdit = (pkg: ResortPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      duration: pkg.duration,
      price: pkg.price,
      original_price: pkg.original_price,
      description: pkg.description,
      includes: pkg.includes.join("\n"),
      features: pkg.features.join("\n"),
      badge: pkg.badge
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      const { error } = await supabase
        .from("resort_packages")
        .delete()
        .eq("id", id);

      if (error) {
        toast({
          title: "Error deleting package",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({ title: "Package deleted successfully!" });
        fetchPackages();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      duration: "",
      price: "",
      original_price: "",
      description: "",
      includes: "",
      features: "",
      badge: ""
    });
    setEditingPackage(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="w-6 h-6" />
          Resort Packages Management
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPackage ? "Edit Package" : "Add New Package"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Package Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 2 Days / 1 Night"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., ₹8,999"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="original_price">Original Price</Label>
                  <Input
                    id="original_price"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    placeholder="e.g., ₹12,999"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="includes">Includes (one per line)</Label>
                <Textarea
                  id="includes"
                  value={formData.includes}
                  onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                  rows={4}
                  placeholder="Accommodation&#10;All Meals&#10;Activities"
                  required
                />
              </div>
              <div>
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  rows={4}
                  placeholder="Adventure Package&#10;Nature Walks&#10;Wellness Included"
                  required
                />
              </div>
              <div>
                <Label htmlFor="badge">Badge</Label>
                <Input
                  id="badge"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g., Popular, Exclusive, Festival Special"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingPackage ? "Update" : "Create"} Package
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <CardTitle className="text-lg">{pkg.name}</CardTitle>
              <div className="text-sm text-muted-foreground">{pkg.duration}</div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">{pkg.price}</span>
                <span className="text-sm text-muted-foreground line-through">{pkg.original_price}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>
              <div className="text-xs space-y-1 mb-2">
                <strong>Includes:</strong> {pkg.includes.join(", ")}
              </div>
              <div className="text-xs space-y-1 mb-3">
                <strong>Features:</strong> {pkg.features.join(", ")}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(pkg)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(pkg.id)}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
