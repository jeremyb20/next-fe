// src/utils/chart-data-processor.ts
export const processMonthlyChartData = (
  monthlyData: { currentYear: number[]; lastYear: number[] } | undefined,
  monthsToShow: number = 12
) => {
  if (!monthlyData) {
    return {
      categories: Array.from({ length: monthsToShow }, (_, i) =>
        new Date(0, i).toLocaleString('default', { month: 'short' })
      ),
      currentYearData: Array(monthsToShow).fill(0),
      lastYearData: Array(monthsToShow).fill(0),
    };
  }

  // Obtener los últimos N meses
  const currentDate = new Date();
  const categories = [];
  const currentYearData = [];
  const lastYearData = [];

  // eslint-disable-next-line no-plusplus
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    const monthIndex = date.getMonth();
    const monthName = date.toLocaleString('default', { month: 'short' });
    const yearLabel = date.getFullYear().toString().slice(2);

    categories.push(`${monthName} '${yearLabel}`);

    // Obtener datos del año actual
    currentYearData.push(monthlyData.currentYear[monthIndex] || 0);

    // Obtener datos del año anterior (ajustar mes para comparación anual)
    lastYearData.push(monthlyData.lastYear[monthIndex] || 0);
  }

  return {
    categories,
    currentYearData,
    lastYearData,
    currentDate,
  };
};

export const processChartData = (
  stats: any,
  dataField: 'monthlyData' = 'monthlyData',
  months: number = 6
) => {
  if (!stats?.[dataField]) {
    return {
      categories: Array.from({ length: months }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (months - 1 - i));
        const monthName = date.toLocaleString('default', { month: 'short' });
        const yearLabel = date.getFullYear().toString().slice(2);
        return `${monthName} '${yearLabel}`;
      }),
      currentYearData: Array(months).fill(0),
      lastYearData: Array(months).fill(0),
    };
  }

  const { currentYear, lastYear } = stats[dataField];
  const currentDate = new Date();
  const categories = [];
  const currentYearData = [];
  const lastYearData = [];

  // eslint-disable-next-line no-plusplus
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    const monthIndex = date.getMonth();
    const monthName = date.toLocaleString('default', { month: 'short' });
    const yearLabel = date.getFullYear().toString().slice(2);

    categories.push(`${monthName} '${yearLabel}`);
    currentYearData.push(currentYear[monthIndex] || 0);
    lastYearData.push(lastYear[monthIndex] || 0);
  }

  return { categories, currentYearData, lastYearData, currentDate };
};

export const processByMonthData = (
  byMonthData: any[] = [],
  monthsToShow: number = 6
) => {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  // Inicializar arrays para 12 meses de cada año
  const currentYearMonthly = Array(12).fill(0);
  const lastYearMonthly = Array(12).fill(0);

  // Llenar los arrays con los datos reales
  byMonthData.forEach((item: any) => {
    const monthIndex = item._id.month - 1; // Convertir mes (1-12) a índice (0-11)

    if (item._id.year === currentYear) {
      currentYearMonthly[monthIndex] = item.count;
    } else if (item._id.year === lastYear) {
      lastYearMonthly[monthIndex] = item.count;
    }
  });

  // Preparar datos para los últimos N meses
  const currentDate = new Date();
  const categories = [];
  const currentYearData = [];
  const lastYearData = [];

  // eslint-disable-next-line no-plusplus
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    const monthIndex = date.getMonth();
    const monthName = date.toLocaleString('default', { month: 'short' });
    const yearLabel = date.getFullYear().toString().slice(2);

    categories.push(`${monthName} '${yearLabel}`);

    // Datos del año actual para este mes
    currentYearData.push(currentYearMonthly[monthIndex] || 0);

    // Datos del año anterior para este mes
    lastYearData.push(lastYearMonthly[monthIndex] || 0);
  }

  return {
    categories,
    currentYearData,
    lastYearData,
    currentDate,
  };
};
