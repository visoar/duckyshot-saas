"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserAvatarUrl } from "@/lib/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth/client";
import { Session } from "@/types/auth";
import { Edit, Laptop, Loader2, PhoneIcon } from "lucide-react";
import { useSession } from "@/lib/auth/client";

// 更新 props 类型
export function AccountPage(props: {
  activeSessions: Array<{
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
    os?: string | null;
    browser?: string | null;
    deviceType?: string | null;
  }>;
}) {
  const router = useRouter();
  const { data: currentUserSession, isPending } = useSession(); // 重命名 session 为 currentUserSession, 移除未使用的 update
  const [isTerminating, setIsTerminating] = useState<string>();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-4">
            {isPending ? (
              <Skeleton className="h-14 w-14 rounded-full" />
            ) : (
              <Avatar className="h-14 w-14">
                <AvatarImage
                  src={getUserAvatarUrl(currentUserSession?.user.image, currentUserSession?.user.email, currentUserSession?.user.name)}
                  alt={currentUserSession?.user.name || "User Avatar"}
                  className="object-cover"
                />
                <AvatarFallback className="text-lg uppercase">
                  {currentUserSession?.user.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <p className="text-base font-medium">{currentUserSession?.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {currentUserSession?.user.email}
              </p>
            </div>
          </div>
          <EditUserDialog session={currentUserSession} isPending={isPending} />
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold">Active Sessions</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {props.activeSessions
              .filter((session) => session.os || session.browser) // 过滤掉无法解析的
              .map((session) => {
                const device = session.deviceType === 'mobile' ? (
                  <PhoneIcon className="h-4 w-4" />
                ) : (
                  <Laptop className="h-4 w-4" />
                );

                return (
                  <Card
                    key={session.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      {device}
                      <div>
                        <p className="text-sm font-medium">{session.os || 'Unknown OS'}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.browser || 'Unknown Browser'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        setIsTerminating(session.id);
                        const res = await authClient.revokeSession({
                          token: session.token,
                        });
                        if (res.error) {
                          toast.error(res.error.message);
                        } else {
                          toast.success("Session terminated successfully");
                        }
                        router.refresh();
                        setIsTerminating(undefined);
                      }}
                      disabled={isTerminating === session.id}
                    >
                      {isTerminating === session.id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : session.id === currentUserSession?.session.id ? (
                        "Sign Out"
                      ) : (
                        "Terminate"
                      )}
                    </Button>
                  </Card>
                );
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EditUserDialog({ session, isPending }: { session: Session | null, isPending: boolean }) {
  const [name, setName] = useState<string>(session?.user.name || "");
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="gap-2">
          <Edit size={16} />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
          <DialogDescription>
            Change your name and profile picture
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={session?.user.name}
            />
          </div>
          <div className="grid gap-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              {isPending ? (
                <Skeleton className="h-16 w-16 rounded-full" />
              ) : (
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={getUserAvatarUrl(session?.user.image, session?.user.email, session?.user.name)}
                    alt={name || "User Avatar"}
                  />
                  <AvatarFallback>{name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Profile pictures are automatically generated using DiceBear avatars based on your email address.
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true);
              await authClient.updateUser({
                name: name !== session?.user.name ? name : undefined,
                fetchOptions: {
                  onSuccess: () => {
                    toast.success("Profile updated successfully");
                    setOpen(false);
                    router.refresh();
                  },
                  onError: (error) => {
                    toast.error(error.error.message);
                  },
                },
              });
              setIsLoading(false);
            }}
          >
            {isLoading ? (
              <Loader2 size={15} className="mr-2 animate-spin" />
            ) : null}
            Update Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
