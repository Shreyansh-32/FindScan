export interface Data {
  timestamp: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  turnover: number;
}

export interface BollingerBandStyleOptions {
  visibility: boolean;
  color: string;
  lineWidth: number;
  lineStyle: "solid" | "dashed";
}

export interface BollingerBandsOptions {
  inputs: {
    length: number;
    source: "close";
    stdDev: number;
    offset: number;
    maType: "SMA";
  };
  style: {
    basis: BollingerBandStyleOptions;
    upper: BollingerBandStyleOptions;
    lower: BollingerBandStyleOptions;
    background: {
      visibility: boolean;
      opacity: number;
    };
  };
}

export const defaultBollingerBandsOptions: BollingerBandsOptions = {
  inputs: {
    length: 20,
    source: 'close',
    stdDev: 2,
    offset: 0,
    maType: 'SMA',
  },
  style: {
    basis: {
      visibility: true,
      color: '#FF6D00',
      lineWidth: 2,
      lineStyle: 'solid',
    },
    upper: {
      visibility: true,
      color: '#2962FF',
      lineWidth: 2,
      lineStyle: 'solid',
    },
    lower: {
      visibility: true,
      color: '#2962FF',
      lineWidth: 2,
      lineStyle: 'solid',
    },
    background: {
      visibility: true,
      opacity: 0.1,
    },
  },
};

export function calculateSMA(
  closePrices: number[],
  length: number
): (number | null)[] {
  const smaValues: (number | null)[] = [];

  for (let i = 0; i < closePrices.length; i++) {
    if (i < length - 1) {
      smaValues.push(null);
      continue;
    }

    const window = closePrices.slice(i - length + 1, i + 1);

    const sum = window.reduce((acc, val) => acc + val, 0);
    const sma = sum / length;
    smaValues.push(sma);
  }

  return smaValues;
}

function applyOffset(
  data: (number | null)[],
  offset: number
): (number | null)[] {
  if (offset === 0) {
    return data;
  }

  if (offset > 0) {
    const padding = Array(offset).fill(null);
    return [...padding, ...data.slice(0, -offset)];
  } else {
    const padding = Array(Math.abs(offset)).fill(null);
    return [...data.slice(Math.abs(offset)), ...padding];
  }
}

export function calculateStdDev(
  closePrices: number[],
  length: number,
  smaValues: (number | null)[]
): (number | null)[] {
  const stdDevValues: (number | null)[] = [];

  for (let i = 0; i < closePrices.length; i++) {
    const currentSma = smaValues[i];

    if (currentSma === null) {
      stdDevValues.push(null);
      continue;
    }

    const window = closePrices.slice(i - length + 1, i + 1);

    const sumOfSquaredDiffs = window.reduce((acc, val) => {
      const diff = val - currentSma;
      return acc + diff * diff;
    }, 0);

    const variance = sumOfSquaredDiffs / length;
    const stdDev = Math.sqrt(variance);
    stdDevValues.push(stdDev);
  }

  return stdDevValues;
}

export function computeBollingerBands(
  data: Data[],
  options: BollingerBandsOptions
) {
  const close = data.map((dat) => dat.close);
  const length = options.inputs.length;
  const stdDevMultiplier = options.inputs.stdDev;
  const offset = options.inputs.offset;

  const basisWithoutOffset = calculateSMA(close, length);
  const stdDevWithoutOffset = calculateStdDev(
    close,
    length,
    basisWithoutOffset
  );

  const upperWithoutOffset = basisWithoutOffset.map((dat, idx) => {
    const stdDevVal = stdDevWithoutOffset[idx];
    if (stdDevVal === null || dat === null) return null;
    return dat + stdDevVal * stdDevMultiplier;
  });

  const lowerWithoutOffset = basisWithoutOffset.map((dat, idx) => {
    const stdDevVal = stdDevWithoutOffset[idx];
    if (dat === null || stdDevVal === null) return null;
    return dat - stdDevVal * stdDevMultiplier;
  });

  const basis = applyOffset(basisWithoutOffset, offset);
  const upper = applyOffset(upperWithoutOffset, offset);
  const lower = applyOffset(lowerWithoutOffset, offset);

  const stdDev = stdDevWithoutOffset;

  return { basis, stdDev, upper, lower };
}
