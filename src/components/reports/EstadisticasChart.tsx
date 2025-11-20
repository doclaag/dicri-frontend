interface EstadisticasChartProps {
  data: Array<{
    StateName: string;
    Cantidad: number;
    Porcentaje: number;
  }>;
}

export const EstadisticasChart = ({ data }: EstadisticasChartProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 border-b pb-4 mb-4">
        Distribución por Estado
      </h2>
      <div className="space-y-4">
        {data.map((estado, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1">
              <span className="text-gray-700 font-medium">{estado.StateName}</span>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-[--color-dicri-primary] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${estado.Porcentaje}%` }}
                />
              </div>
            </div>
            <div className="ml-4 text-right">
              <span className="text-2xl font-bold text-[--color-dicri-primary]">
                {estado.Cantidad}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                ({estado.Porcentaje}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};