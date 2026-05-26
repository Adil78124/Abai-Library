import AdminSettingsForm from "@/components/admin/admin-settings-form";

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
        Настройки
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-black sm:text-3xl">
        Настройки администратора
      </h1>
      <p className="mt-3 text-sm leading-6 text-gray-600">
        Здесь можно изменить имя, email и пароль текущего администратора. Роль и права доступа остаются на backend.
      </p>

      <div className="mt-8">
        <AdminSettingsForm />
      </div>
    </div>
  );
}
