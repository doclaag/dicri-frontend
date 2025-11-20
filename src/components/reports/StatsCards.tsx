interface StatCard {
  label: string;
  value: number;
  color: string;
}

interface StatsCardsProps {
  stats: StatCard[];
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className={`text-4xl font-bold mt-2 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};