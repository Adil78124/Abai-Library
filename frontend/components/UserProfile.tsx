type UserProfileProps = {
  name?: string;
  email?: string;
  level?: string;
  avatarUrl?: string;
  stats?: { label: string; value: string | number }[];
};

export default function UserProfile({
  name = "Пользователь",
  email,
  level = "Bronze",
  avatarUrl,
  stats = [],
}: UserProfileProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm fade-in">
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center text-black text-2xl font-bold">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            name.slice(0, 2).toUpperCase()
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-semibold text-black">{name}</h2>
          {email && (
            <p className="text-sm text-gray-600 mt-0.5">{email}</p>
          )}
          <span className="inline-block mt-2 rounded-full bg-gold/10 px-3 py-1 text-sm font-medium text-gold border border-gold/20">
            {level}
          </span>
        </div>
      </div>
      {stats.length > 0 && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
          {stats.map(({ label, value }) => (
            <div key={label}>
              <p className="text-2xl font-semibold text-black">{value}</p>
              <p className="text-sm text-gray-600">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
