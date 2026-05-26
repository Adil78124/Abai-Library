export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
        Пользователи
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-black sm:text-3xl">
        Пользователи и роли
      </h1>
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 text-sm leading-6 text-gray-600 shadow-sm">
        Раздел подготовлен для управления пользователями. Backend уже возвращает роль пользователя, а доступ к админ-панели проверяется через текущую сессию.
      </div>
    </div>
  );
}
