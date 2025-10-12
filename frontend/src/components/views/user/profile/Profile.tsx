import React from "react";
import { useProfile } from "@/hooks/user/useProfile";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Spinner,
  Alert,
  Avatar,
} from "@heroui/react";
import { ShieldAlert, ShieldCheck } from "lucide-react";

function formatDate(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

const ProfileView = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useProfile();
  const user = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Spinner size="sm" /> <span>Memuat profil…</span>
      </div>
    );
  }

  if (isError) {
    const message =
      (error as any)?.response?.data?.message ||
      (error as Error)?.message ||
      "Terjadi kesalahan saat memuat data.";
    return (
      <div className="max-w-xl">
        <Alert color="danger" variant="flat" title="Gagal memuat profil">
          {message}
        </Alert>
        <div className="mt-3">
          <Button onPress={() => refetch()} variant="flat">
            Coba lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <Avatar
          src={
            user?.profile_image ? user?.profile_image : "/images/user/user.svg"
          }
          className="text-large h-20 w-20"
        />
        <h1 className="text-lg font-semibold">{user?.name}</h1>
        <p className="text-foreground/60 text-sm">{user?.email}</p>
      </div>
      <Card>
        <CardHeader className="flex items-center justify-between gap-2">
          <div className="text-lg font-semibold">Profil</div>
          {isFetching ? <Spinner size="sm" /> : null}
        </CardHeader>

        <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Nama" value={user?.name ?? "-"} readOnly />
          <Input label="Email" value={user?.email ?? "-"} readOnly />

          <div className="flex flex-col gap-2">
            <Input
              label="No. HP"
              value={user?.phone_number ?? "-"}
              endContent={
                user?.phone_verified_at ? (
                  <ShieldCheck className="text-foreground/60" color="success" />
                ) : (
                  <ShieldAlert className="text-foreground/60" color="warning" />
                )
              }
              readOnly
            />
          </div>

          <Input label="Role" value={user?.role ?? "-"} readOnly />
          <Input
            label="Token Version (tv)"
            value={typeof user?.tv === "number" ? String(user?.tv) : "-"}
            readOnly
          />

          <Input label="Dibuat" value={formatDate(user?.created_at)} readOnly />
          <Input
            label="Diperbarui"
            value={formatDate(user?.updated_at)}
            readOnly
          />

          <div className="flex gap-2 pt-2 md:col-span-2">
            <Button variant="flat" onPress={() => refetch()}>
              Refresh
            </Button>
            <Button variant="bordered" isDisabled>
              Edit Profil (segera)
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfileView;
