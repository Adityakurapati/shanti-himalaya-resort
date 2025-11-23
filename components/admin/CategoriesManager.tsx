"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CategoriesManager() {
        const [categories, setCategories] = useState<string[]>([])
        const [newCategory, setNewCategory] = useState("")
        const [loading, setLoading] = useState(false)
        const { toast } = useToast()

        useEffect(() => {
                fetchCategories()
        }, [])

        const fetchCategories = async () => {
                try {
                        // For now, we'll store categories in a simple table
                        const { data, error } = await supabase
                                .from('categories')
                                .select('name')
                                .order('created_at', { ascending: true })

                        if (error && error.code !== 'PGRST116') { // PGRST116 is "relation not found"
                                throw error
                        }

                        if (data) {
                                setCategories(data.map((item: any) => item.name))
                        } else {
                                // Initialize with default categories if table doesn't exist
                                const defaultCategories = ["Trekking", "Wildlife", "Culture", "Adventure", "Pilgrimage", "Nature"]
                                setCategories(defaultCategories)

                                // Create the categories table and insert defaults
                                await initializeCategoriesTable(defaultCategories)
                        }
                } catch (error: any) {
                        console.error("Error fetching categories:", error)
                        // Fallback to default categories
                        setCategories(["Trekking", "Wildlife", "Culture", "Adventure", "Pilgrimage", "Nature"])
                }
        }

        const initializeCategoriesTable = async (defaultCategories: string[]) => {
                try {
                        // Create categories table
                        const { error: createError } = await supabase
                                .from('categories')
                                .insert(defaultCategories.map((name: any) => ({ name })))

                        if (createError) throw createError
                } catch (error) {
                        console.error("Error initializing categories:", error)
                }
        }

        const addCategory = async () => {
                if (!newCategory.trim()) return

                setLoading(true)
                try {
                        const { error } = await supabase
                                .from('categories')
                                .insert([{ name: newCategory.trim() }])

                        if (error) throw error

                        setCategories(prev => [...prev, newCategory.trim()])
                        setNewCategory("")
                        toast({
                                title: "Category added",
                                description: `${newCategory} has been added successfully.`
                        })
                } catch (error: any) {
                        console.error("Error adding category:", error)
                        toast({
                                title: "Error adding category",
                                description: error.message,
                                variant: "destructive"
                        })
                } finally {
                        setLoading(false)
                }
        }

        const deleteCategory = async (category: string) => {
                setLoading(true)
                try {
                        const { error } = await supabase
                                .from('categories')
                                .delete()
                                .eq('name', category)

                        if (error) throw error

                        setCategories(prev => prev.filter((c: any) => c !== category))
                        toast({
                                title: "Category deleted",
                                description: `${category} has been removed.`
                        })
                } catch (error: any) {
                        console.error("Error deleting category:", error)
                        toast({
                                title: "Error deleting category",
                                description: error.message,
                                variant: "destructive"
                        })
                } finally {
                        setLoading(false)
                }
        }

        return (
                <Card>
                        <CardHeader>
                                <CardTitle>Manage Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                        <Input
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                                placeholder="Enter new category name"
                                                onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                                        />
                                        <Button onClick={addCategory} disabled={loading || !newCategory.trim()}>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add
                                        </Button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {categories.map((category: any) => (
                                                <div key={category} className="flex items-center justify-between p-2 border rounded">
                                                        <span className="text-sm">{category}</span>
                                                        <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => deleteCategory(category)}
                                                                disabled={loading}
                                                        >
                                                                <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                </div>
                                        ))}
                                </div>
                        </CardContent>
                </Card>
        )
}