"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MasterDataTable, ColumnDef } from "./MasterDataTable";
import {
    getPests, createPest, updatePest, deletePest,
    getPlants, createPlant, updatePlant, deletePlant
} from "../actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Pest {
    id: string;
    pestId: string;
    pestNameEn: string;
    pestNameTh: string | null;
    imageUrl: string | null;
}

interface Plant {
    id: string;
    plantId: string;
    plantNameEn: string;
    plantNameTh: string | null;
    imageUrl: string | null;
}

export default function MasterDataTab() {
    const [pests, setPests] = useState<Pest[]>([]);
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(false);

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<"PEST" | "PLANT">("PEST");
    const [editingItem, setEditingItem] = useState<Pest | Plant | null>(null);
    const [formData, setFormData] = useState({
        id: "",
        code: "", // pestId or plantId
        nameEn: "",
        nameTh: "",
        imageUrl: ""
    });

    const fetchPests = async () => {
        setLoading(true);
        try {
            const data = await getPests();
            setPests(data);
        } catch (error) {
            console.error(error);
            alert("Failed to fetch pests");
        } finally {
            setLoading(false);
        }
    };

    const fetchPlants = async () => {
        setLoading(true);
        try {
            const data = await getPlants();
            setPlants(data);
        } catch (error) {
            console.error(error);
            alert("Failed to fetch plants");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPests();
        fetchPlants();
    }, []);

    const handleCreate = (type: "PEST" | "PLANT") => {
        setDialogType(type);
        setEditingItem(null);
        setFormData({ id: "", code: "", nameEn: "", nameTh: "", imageUrl: "" });
        setIsDialogOpen(true);
    };

    const handleEdit = (item: Pest | Plant, type: "PEST" | "PLANT") => {
        setDialogType(type);
        setEditingItem(item);
        if (type === "PEST") {
            const p = item as Pest;
            setFormData({ id: p.id, code: p.pestId, nameEn: p.pestNameEn, nameTh: p.pestNameTh || "", imageUrl: p.imageUrl || "" });
        } else {
            const p = item as Plant;
            setFormData({ id: p.id, code: p.plantId, nameEn: p.plantNameEn, nameTh: p.plantNameTh || "", imageUrl: p.imageUrl || "" });
        }
        setIsDialogOpen(true);
    };

    const handleDelete = async (item: Pest | Plant, type: "PEST" | "PLANT") => {
        if (!confirm(`Are you sure you want to delete ${type === "PEST" ? (item as Pest).pestNameEn : (item as Plant).plantNameEn}?`)) return;

        try {
            let res;
            if (type === "PEST") res = await deletePest((item as Pest).id);
            else res = await deletePlant((item as Plant).id);

            if (res.success) {
                alert(res.message);
                if (type === "PEST") fetchPests(); else fetchPlants();
            } else {
                alert(res.message);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to delete item");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let res;
            if (dialogType === "PEST") {
                if (editingItem) {
                    res = await updatePest((editingItem as Pest).id, {
                        pestNameEn: formData.nameEn,
                        pestNameTh: formData.nameTh,
                        imageUrl: formData.imageUrl
                    });
                } else {
                    res = await createPest({
                        pestId: formData.code,
                        pestNameEn: formData.nameEn,
                        pestNameTh: formData.nameTh,
                        imageUrl: formData.imageUrl
                    });
                }
            } else {
                // PLANT
                if (editingItem) {
                    res = await updatePlant((editingItem as Plant).id, {
                        plantNameEn: formData.nameEn,
                        plantNameTh: formData.nameTh,
                        imageUrl: formData.imageUrl
                    });
                } else {
                    res = await createPlant({
                        plantId: formData.code,
                        plantNameEn: formData.nameEn,
                        plantNameTh: formData.nameTh,
                        imageUrl: formData.imageUrl
                    });
                }
            }

            if (res.success) {
                alert(res.message);
                setIsDialogOpen(false);
                if (dialogType === "PEST") fetchPests(); else fetchPlants();
            } else {
                alert(res.message);
            }
        } catch (error) {
            console.error(error);
            alert("Operation failed");
        } finally {
            setLoading(false);
        }
    };

    const pestColumns: ColumnDef<Pest>[] = [
        { key: "pestId", header: "ID" },
        { key: "pestNameEn", header: "Name (EN)" },
        { key: "pestNameTh", header: "Name (TH)" },
    ];

    const plantColumns: ColumnDef<Plant>[] = [
        { key: "plantId", header: "ID" },
        { key: "plantNameEn", header: "Name (EN)" },
        { key: "plantNameTh", header: "Name (TH)" },
    ];

    return (
        <Tabs defaultValue="pests" className="w-full">
            <TabsList>
                <TabsTrigger value="pests">Pests Management</TabsTrigger>
                <TabsTrigger value="plants">Plants Management</TabsTrigger>
            </TabsList>

            <TabsContent value="pests" className="mt-4">
                <MasterDataTable
                    title="Pests List"
                    data={pests}
                    columns={pestColumns}
                    isLoading={loading}
                    onCreate={() => handleCreate("PEST")}
                    onEdit={(item) => handleEdit(item, "PEST")}
                    onDelete={(item) => handleDelete(item, "PEST")}
                />
            </TabsContent>

            <TabsContent value="plants" className="mt-4">
                <MasterDataTable
                    title="Plants List"
                    data={plants}
                    columns={plantColumns}
                    isLoading={loading}
                    onCreate={() => handleCreate("PLANT")}
                    onEdit={(item) => handleEdit(item, "PLANT")}
                    onDelete={(item) => handleDelete(item, "PLANT")}
                />
            </TabsContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Edit" : "Add"} {dialogType === "PEST" ? "Pest" : "Plant"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">ID Code (Unique)</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                disabled={!!editingItem} // ID cannot be changed on edit
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nameEn">Name (English)</Label>
                            <Input
                                id="nameEn"
                                value={formData.nameEn}
                                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nameTh">Name (Thai)</Label>
                            <Input
                                id="nameTh"
                                value={formData.nameTh}
                                onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input
                                id="imageUrl"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={loading}>Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Tabs>
    );
}
