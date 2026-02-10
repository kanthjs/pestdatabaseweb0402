"use client";

import React, { useState } from "react";
import { UserListItem, updateUserRole, exportUsersToCSV, approveExpertRequest, rejectExpertRequest } from "../actions";
import { UserRole, ExpertStatus } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
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
    CheckCircle,
    FileText,
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
    const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);

    const handleExpertAction = async (userId: string, action: 'approve' | 'reject') => {
        setIsLoading(true);
        try {
            if (action === 'approve') {
                await approveExpertRequest(userId);
            } else {
                await rejectExpertRequest(userId);
            }
            setSelectedUser(null);
            router.refresh();
        } catch (error) {
            console.error(`Error ${action}ing request:`, error);
        } finally {
            setIsLoading(false);
        }
    };

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
                                <TableHead className="text-center">Expert Request</TableHead>
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
                                    <TableCell className="text-center">
                                        {u.expertRequest === ExpertStatus.PENDING ? (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="h-7 text-xs bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200"
                                                onClick={() => setSelectedUser(u)}
                                            >
                                                ตรวจสอบคำขอ
                                            </Button>
                                        ) : u.expertRequest === ExpertStatus.APPROVED ? (
                                            <span className="text-xs text-green-600 font-medium flex justify-center items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Approved
                                            </span>
                                        ) : u.expertRequest === ExpertStatus.REJECTED ? (
                                            <span className="text-xs text-red-500 font-medium">Rejected</span>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
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


            {/* Expert Request Review Dialog */}
            <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>ตรวจสอบคำขอเป็นผู้เชี่ยวชาญ</DialogTitle>
                        <DialogDescription>
                            Review expert status request for {selectedUser?.userName}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedUser && (
                        <div className="space-y-6">
                            {/* User Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground block mb-1">Full Name:</span>
                                    <span className="font-medium text-lg">{selectedUser?.userName}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block mb-1">Email:</span>
                                    <span className="font-medium text-lg">{selectedUser?.email}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block mb-1">Current Role:</span>
                                    {selectedUser && getRoleBadge(selectedUser.role)}
                                </div>
                                <div>
                                    <span className="text-muted-foreground block mb-1">Joined:</span>
                                    <span>{selectedUser && format(new Date(selectedUser.createdAt), "PPP", { locale: th })}</span>
                                </div>
                            </div>

                            {/* Proof Image */}
                            <div className="border rounded-lg overflow-hidden bg-muted/20">
                                <div className="p-3 border-b flex justify-between items-center bg-muted/40">
                                    <h4 className="font-medium text-sm flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        หลักฐานยืนยันตัวตน (Proof of Identity)
                                    </h4>
                                    {selectedUser?.expertProofUrl && (
                                        <a
                                            href={selectedUser.expertProofUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-primary hover:underline flex items-center gap-1"
                                        >
                                            <Download className="w-3 h-3" />
                                            Open Full Size
                                        </a>
                                    )}
                                </div>
                                <div className="p-4 flex justify-center bg-black/5 min-h-[200px] items-center">
                                    {selectedUser?.expertProofUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={selectedUser.expertProofUrl}
                                            alt="Proof of Identity"
                                            className="max-h-[400px] max-w-full object-contain rounded shadow-sm"
                                        />
                                    ) : (
                                        <div className="text-muted-foreground flex flex-col items-center gap-2 py-8">
                                            <FileText className="w-10 h-10 opacity-20" />
                                            <span>No proof document uploaded</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contact Reminder */}
                            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm flex gap-3 items-start border border-blue-100">
                                <div className="mt-0.5 bg-blue-200 p-1 rounded-full">
                                    <Users className="w-3 h-3 text-blue-700" />
                                </div>
                                <div>
                                    <strong>Contact Options:</strong> If clarification is needed, please contact the user via email at <span className="font-mono bg-blue-100 px-1 rounded">{selectedUser?.email}</span> before approving or rejecting.
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setSelectedUser(null)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                variant="destructive"
                                onClick={() => selectedUser && handleExpertAction(selectedUser.id, 'reject')}
                                disabled={isLoading}
                                className="flex-1 sm:flex-none"
                            >
                                Reject Request
                            </Button>
                            <Button
                                onClick={() => selectedUser && handleExpertAction(selectedUser.id, 'approve')}
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                            >
                                Approve Request
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card >
    );
}
