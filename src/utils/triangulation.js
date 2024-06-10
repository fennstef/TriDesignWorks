export function triangulateImage(ctx, imageSrc, gridSize, jitter, blend) {
  const img = new Image();
  img.src = imageSrc;
  img.onload = () => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Draw the original image
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Reinitialize the gridPoints array
    let gridPoints = [];

    // Generate jittered grid points
    for (let y = 0; y <= height; y += gridSize) {
      const row = [];
      for (let x = 0; x <= width; x += gridSize) {
        row.push({
          x: x + (x === 0 || x === width ? 0 : jitterPoint(jitter)),
          y: y + (y === 0 || y === height ? 0 : jitterPoint(jitter))
        });
      }
      gridPoints.push(row);
    }

    // Ensure the bottom and right edges are included
    if (gridPoints[gridPoints.length - 1][0].y < height) {
      const row = [];
      for (let x = 0; x <= width; x += gridSize) {
        row.push({ x, y: height });
      }
      gridPoints.push(row);
    }
    if (gridPoints[0][gridPoints[0].length - 1].x < width) {
      gridPoints.forEach(row => {
        row.push({ x: width, y: row[0].y });
      });
    }

    // Draw triangles using the grid points
    for (let y = 0; y < gridPoints.length - 1; y++) {
      for (let x = 0; x < gridPoints[y].length - 1; x++) {
        const topLeft = gridPoints[y][x];
        const topRight = gridPoints[y][x + 1];
        const bottomLeft = gridPoints[y + 1][x];
        const bottomRight = gridPoints[y + 1][x + 1];

        const triangle1 = [topLeft, bottomLeft, bottomRight];
        const triangle2 = [topLeft, topRight, bottomRight];

        fillTriangle(ctx, triangle1, data, width, height, blend);
        fillTriangle(ctx, triangle2, data, width, height, blend);
      }
    }

    // Draw the blended original image on top
    ctx.globalAlpha = blend / 100;
    ctx.drawImage(img, 0, 0, width, height);
    ctx.globalAlpha = 1;
  };
}

function jitterPoint(jitter) {
  return (Math.random() - 0.5) * jitter;
}

function fillTriangle(ctx, points, data, width, height, blend) {
  const avgColor = getAverageColor(points, data, width, height);
  ctx.fillStyle = `rgba(${avgColor.r}, ${avgColor.g}, ${avgColor.b}, ${blend})`;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[1].x, points[1].y);
  ctx.lineTo(points[2].x, points[2].y);
  ctx.closePath();
  ctx.fill();
}

function getAverageColor(points, data, width, height) {
  // Calculate the centroid of the triangle
  const cx = Math.floor((points[0].x + points[1].x + points[2].x) / 3);
  const cy = Math.floor((points[0].y + points[1].y + points[2].y) / 3);

  // Initialize accumulators for color components
  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let count = 0;

  // Function to add color from a specific point
  function addColor(x, y, weight) {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      const index = (y * width + x) * 4;
      totalR += data[index] * weight;
      totalG += data[index + 1] * weight;
      totalB += data[index + 2] * weight;
      count += weight;
    }
  }

  // Add colors of the vertices
  addColor(Math.floor(points[0].x), Math.floor(points[0].y), 1);
  addColor(Math.floor(points[1].x), Math.floor(points[1].y), 1);
  addColor(Math.floor(points[2].x), Math.floor(points[2].y), 1);
  
  // Add color of the centroid
  addColor(cx, cy, 4);

  // Calculate the average color
  return {
    r: Math.floor(totalR / count),
    g: Math.floor(totalG / count),
    b: Math.floor(totalB / count),
  };
}
