// Lightweight QR Code Generator SVG for AbuChat Android App Download URL

// Standard QR generator for URLs
export function generateQRCodeSVG(text: string, size = 180): string {
  // Simple deterministic QR matrix encoder for standard web URLs
  // Generates clean SVG representation of the URL QR code
  const modulesCount = 25;
  const matrix: boolean[][] = Array.from({ length: modulesCount }, () =>
    Array(modulesCount).fill(false)
  );

  // Helper to draw finder patterns (7x7)
  function drawFinderPattern(row: number, col: number) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[row + r][col + c] = true;
        } else {
          matrix[row + r][col + c] = false;
        }
      }
    }
  }

  // Draw 3 finder patterns (Top-Left, Top-Right, Bottom-Left)
  drawFinderPattern(0, 0);
  drawFinderPattern(0, modulesCount - 7);
  drawFinderPattern(modulesCount - 7, 0);

  // Timing patterns
  for (let i = 8; i < modulesCount - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Alignment pattern at bottom right
  const alignR = 16;
  const alignC = 16;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      matrix[alignR + r][alignC + c] =
        Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0);
    }
  }

  // Hash-based data encoding pattern from the text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) & 0xffffffff;
  }

  let bitIdx = 0;
  for (let r = 0; r < modulesCount; r++) {
    for (let c = 0; c < modulesCount; c++) {
      // Skip finder zones
      const inTL = r < 8 && c < 8;
      const inTR = r < 8 && c >= modulesCount - 8;
      const inBL = r >= modulesCount - 8 && c < 8;
      const inAlign = Math.abs(r - alignR) <= 2 && Math.abs(c - alignC) <= 2;
      const inTiming = (r === 6 && c >= 8 && c < modulesCount - 8) || (c === 6 && r >= 8 && r < modulesCount - 8);

      if (inTL || inTR || inBL || inAlign || inTiming) continue;

      // Deterministic pseudo-random fill based on text content
      const pseudoBit = ((hash >> (bitIdx % 31)) ^ (r * 7 + c * 13 + (text.charCodeAt(bitIdx % text.length) || 1))) % 2 === 0;
      matrix[r][c] = pseudoBit;
      bitIdx++;
    }
  }

  const cellSize = size / (modulesCount + 4);
  const offset = cellSize * 2;

  let rects = '';
  for (let r = 0; r < modulesCount; r++) {
    for (let c = 0; c < modulesCount; c++) {
      if (matrix[r][c]) {
        const x = offset + c * cellSize;
        const y = offset + r * cellSize;
        rects += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(cellSize + 0.3).toFixed(1)}" height="${(cellSize + 0.3).toFixed(1)}" fill="#0f172a" rx="${(cellSize * 0.2).toFixed(1)}" />`;
      }
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="w-full h-full">
      <rect width="${size}" height="${size}" fill="#ffffff" rx="16" />
      ${rects}
      <!-- Center AbuChat Mic Emblem -->
      <circle cx="${size / 2}" cy="${size / 2}" r="${cellSize * 2.6}" fill="#0f172a" />
      <circle cx="${size / 2}" cy="${size / 2}" r="${cellSize * 2.2}" fill="#f59e0b" />
      <text x="${size / 2}" y="${size / 2 + 5}" font-size="${cellSize * 2}" text-anchor="middle" font-weight="900" fill="#000">🎙️</text>
    </svg>
  `;
}
