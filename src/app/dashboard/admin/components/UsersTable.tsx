"use client";

import React, { useState } from "react";
import { UserListItem, updateUserRole, exportUsersToCSV } from "../actions";
import { UserRole } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    MoreVertical,
    User as UserIcon,
    GraduationCap,
    Crown,
    Download
} from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

interface UsersTableProps {
    users: UserListItem[];
}

export default function UsersTable({ users }: UsersTableProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        setIsLoading(true);
        try {
            await updateUserRole(userId, newRole);
            router.refresh();
        } catch (error) {
            console.error("Error updating role:", error);
        } finally {
            setIsLoading(false);
        }
    };



    const handleExportCSV = async () => {
        try {
            const csv = await exportUsersToCSV();
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export users:", error);
            alert("Failed to export users");
        }
    };

    const getRoleBadge = (role: UserRole) => {
        const styles = {
            ADMIN: { bg: "bg-purple-100", text: "text-purple-700", icon: <Crown className="w-3 h-3" /> },
            EXPERT: { bg: "bg-emerald-100", text: "text-emerald-700", icon: <GraduationCap className="w-3 h-3" /> },
            USER: { bg: "bg-blue-100", text: "text-blue-700", icon: <UserIcon className="w-3 h-3" /> },
        };
        const style = styles[role] || styles.USER;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                {style.icon}
                {role}
            </span>
        );
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            รายชื่อผู้ใช้งาน
                        </CardTitle>
                        <CardDescription>
                            จัดการบัญชีผู้ใช้และกำหนดสิทธิ์การเข้าถึง
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleExportCSV}>
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ผู้ใช้</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-center">รายงาน</TableHead>
                                <TableHead>สมัครเมื่อ</TableHead>
                                <TableHead className="text-right">จัดการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-medium">{u.userName}</TableCell>
                                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                                    <TableCell>{getRoleBadge(u.role)}</TableCell>
                                    <TableCell className="text-center font-bold">{u.reportCount}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {format(new Date(u.createdAt), "d MMM yyyy", { locale: th })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" disabled={isLoading}>
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => handleRoleChange(u.id, UserRole.USER)}
                                                    disabled={u.role === UserRole.USER}
                                                >
                                                    <UserIcon className="w-4 h-4 mr-2" />
                                                    Set as USER
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleRoleChange(u.id, UserRole.EXPERT)}
                                                    disabled={u.role === UserRole.EXPERT}
                                                >
                                                    <GraduationCap className="w-4 h-4 mr-2" />
                                                    Set as EXPERT
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleRoleChange(u.id, UserRole.ADMIN)}
                                                    disabled={u.role === UserRole.ADMIN}
                                                    className="text-purple-600"
                                                >
                                                    <Crown className="w-4 h-4 mr-2" />
                                                    Set as ADMIN
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card >
    );
}
