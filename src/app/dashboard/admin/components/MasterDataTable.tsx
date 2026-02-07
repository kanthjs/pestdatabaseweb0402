"use client";

import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";

export interface ColumnDef<T> {
    key: keyof T;
    header: string;
    render?: (item: T) => React.ReactNode;
}

interface MasterDataTableProps<T> {
    title: string;
    data: T[];
    columns: ColumnDef<T>[];
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
    onCreate: () => void;
    isLoading?: boolean;
}

export function MasterDataTable<T extends { id: string }>({
    title,
    data,
    columns,
    onEdit,
    onDelete,
    onCreate,
    isLoading
}: MasterDataTableProps<T>) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{title}</h3>
                <Button onClick={onCreate} disabled={isLoading}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead key={String(col.key)}>{col.header}</TableHead>
                            ))}
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="text-center py-8">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                                    No data found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow key={item.id}>
                                    {columns.map((col) => (
                                        <TableCell key={String(col.key)}>
                                            {col.render ? col.render(item) : String(item[col.key] || "")}
                                        </TableCell>
                                    ))}
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                                            <Edit className="w-4 h-4 text-blue-600" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
