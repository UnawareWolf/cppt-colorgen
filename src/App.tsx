// @ts-nocheck
import { useState } from 'react';
import './App.scss';
import FileUpload from './components/UploadImage';

const App = () => {
  const [newUserInfo, setNewUserInfo] = useState({
    images: [],
  });

  const [finalResult, setFinalResult] = useState('');

  const fileToBase64 = async (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (e) => reject(e);
    });

  function getAverageRGB(img, rows, columns) {
    const pixgap = 5;
    const defaultRGB = { r: 0, g: 0, b: 0 };
    const canvas = document.createElement('canvas');

    const context = canvas.getContext && canvas.getContext('2d');
    if (!context) return defaultRGB;

    const height = (canvas.height =
      img.naturalHeight || img.offsetHeight || img.height);
    const width = (canvas.width =
      img.naturalWidth || img.offsetWidth || img.width);

    context.drawImage(img, 0, 0);

    const imgdata = context.getImageData(0, 0, width, height);

    if (!imgdata) return defaultRGB;
    const colorarr = imgdata.data;

    const grids = Array.from({ length: rows }).map(() =>
      Array.from({ length: columns })
    );

    return grids.map((rowarr, row) =>
      rowarr.map((_, column) => {
        const { ax, ay, bx, by } = getGridRange(
          width,
          height,
          row,
          column,
          rows,
          columns
        );

        const pixs = getBlockPixels(ax, ay, bx, by, pixgap);

        const pixids = pixs.map(({ x, y }) => getPixelID(x, y, width));

        const pixcolors = pixids.map((pixid) => getPixelColor(colorarr, pixid));

        const r = pixcolors.reduce((a, b) => a + b.r, 0) / pixcolors.length;
        const g = pixcolors.reduce((a, b) => a + b.g, 0) / pixcolors.length;
        const b = pixcolors.reduce((a, b) => a + b.b, 0) / pixcolors.length;
        return { r: ~~r, g: ~~g, b: ~~b };
      })
    );
  }

  function getGridRange(width, height, row, column, rows, columns) {
    const margin = 3;
    const pixx = width / columns;
    const pixy = height / rows;
    const ax = column * pixx;
    const ay = row * pixy;
    const bx = ax + pixx;
    const by = ay + pixy;
    return {
      ax: ~~(ax + margin),
      ay: ~~(ay + margin),
      bx: ~~(bx - margin),
      by: ~~(by - margin),
    };
  }

  function getBlockPixels(ax, ay, bx, by, gap) {
    const pixs = [];
    for (let x = ax; x <= bx; x += gap) {
      for (let y = ay; y <= by; y += gap) {
        pixs.push({ x, y });
      }
    }
    return pixs;
  }

  function getPixelID(x, y, width) {
    return x - 1 + (y - 1) * width;
  }

  function getPixelColor(colorarr, pixelID) {
    const frame = pixelID * 4;
    const r = colorarr[frame];
    const g = colorarr[frame + 1];
    const b = colorarr[frame + 2];
    return { r, g, b };
  }

  function countAverageRGB(arr) {
    let r = 0;
    let g = 0;
    let b = 0;
    arr.forEach((el) => {
      r += el.r;
      g += el.g;
      b += el.b;
    });

    return {
      r: ~~(r / arr.length),
      g: ~~(g / arr.length),
      b: ~~(b / arr.length),
    };
  }

  const rgbToHex = (arr) =>
    '#' +
    arr
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('');

  function getAbove991(phImage, rows, columns) {
    const icb = getAverageRGB(phImage, rows, columns);

    const b00Cl = `rgb(${icb[5][0].r},${icb[5][0].g},${icb[5][0].b})`;
    const b10Cl = `rgb(${icb[4][0].r},${icb[4][0].g},${icb[4][0].b})`;
    const b20Cl = `rgb(${icb[3][0].r},${icb[3][0].g},${icb[3][0].b})`;
    const b30Cl = `rgb(${icb[2][0].r},${icb[2][0].g},${icb[2][0].b})`;
    const bC1 = countAverageRGB([
      icb[5][1],
      icb[5][2],
      icb[4][1],
      icb[4][2],
      icb[3][1],
      icb[3][2],
      icb[2][1],
      icb[2][2],
    ]);
    const bC1Cl = `rgb(${bC1.r},${bC1.g},${bC1.b})`;
    const bC2 = countAverageRGB([
      icb[5][3],
      icb[5][4],
      icb[4][3],
      icb[4][4],
      icb[3][3],
      icb[3][4],
      icb[2][3],
      icb[2][4],
    ]);
    const bC2Cl = `rgb(${bC2.r},${bC2.g},${bC2.b})`;
    const b4041 = countAverageRGB([icb[1][0], icb[1][1]]);
    const b4041Cl = `rgb(${b4041.r},${b4041.g},${b4041.b})`;
    const b4243 = countAverageRGB([icb[1][2], icb[1][3]]);
    const b4243Cl = `rgb(${b4243.r},${b4243.g},${b4243.b})`;
    const b44Cl = `rgb(${icb[1][4].r},${icb[1][4].g},${icb[1][4].b})`;

    // GROUP 6
    const b5051 = countAverageRGB([icb[0][0], icb[0][1]]);
    const b5051Cl = `rgb(${b5051.r},${b5051.g},${b5051.b})`;
    const b52Cl = `rgb(${icb[0][2].r},${icb[0][2].g},${icb[0][2].b})`;
    const b53Cl = `rgb(${icb[0][3].r},${icb[0][3].g},${icb[0][3].b})`;
    const b54Cl = `rgb(${icb[0][4].r},${icb[0][4].g},${icb[0][4].b})`;

    return {
      col5b11: rgbToHex(
        b00Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col5b12: rgbToHex(
        b10Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),

      col5b13: rgbToHex(
        b20Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col5b14: rgbToHex(
        b30Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),

      col5b21: rgbToHex(
        bC1Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col5b41: rgbToHex(
        bC2Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),

      col5b15: rgbToHex(
        b4041Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),

      col5b35: rgbToHex(
        b4243Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),

      col5b55: rgbToHex(
        b44Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),

      col5b16: rgbToHex(
        b5051Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col5b36: rgbToHex(
        b52Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col5b46: rgbToHex(
        b53Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col5b56: rgbToHex(
        b54Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
    };
  }

  function getBelow991AndAbove767(phImage, rows, columns) {
    const icb = getAverageRGB(phImage, rows, columns);
    const b00Cl = `rgb(${icb[7][0].r},${icb[7][0].g},${icb[7][0].b})`;
    const b1020 = countAverageRGB([icb[6][0], icb[5][0]]);
    const b1020Cl = `rgb(${b1020.r},${b1020.g},${b1020.b})`;
    const b30Cl = `rgb(${icb[4][0].r},${icb[4][0].g},${icb[4][0].b})`;
    const b40Cl = `rgb(${icb[3][0].r},${icb[3][0].g},${icb[3][0].b})`;
    const bC1 = countAverageRGB([
      icb[7][1],
      icb[7][2],
      icb[6][1],
      icb[6][2],
      icb[5][1],
      icb[5][2],
      icb[4][1],
      icb[4][2],
      icb[3][1],
      icb[3][2],
    ]);
    const bC1Cl = `rgb(${bC1.r},${bC1.g},${bC1.b})`;
    const bC2 = countAverageRGB([
      icb[7][3],
      icb[7][4],
      icb[6][3],
      icb[6][4],
      icb[5][3],
      icb[5][4],
      icb[4][3],
      icb[4][4],
      icb[3][3],
      icb[3][4],
    ]);
    const bC2Cl = `rgb(${bC2.r},${bC2.g},${bC2.b})`;
    const b5051 = countAverageRGB([icb[2][0], icb[2][1]]);
    const b5051Cl = `rgb(${b5051.r},${b5051.g},${b5051.b})`;
    const b5253 = countAverageRGB([icb[2][2], icb[2][3]]);
    const b5253Cl = `rgb(${b5253.r},${b5253.g},${b5253.b})`;
    const b54Cl = `rgb(${icb[2][4].r},${icb[2][4].g},${icb[2][4].b})`;
    const b60617071 = countAverageRGB([
      icb[1][0],
      icb[1][1],
      icb[0][0],
      icb[0][1],
    ]);
    const b60617071Cl = `rgb(${b60617071.r},${b60617071.g},${b60617071.b})`;
    const b6272 = countAverageRGB([icb[1][2], icb[0][2]]);
    const b6272Cl = `rgb(${b6272.r},${b6272.g},${b6272.b})`;
    const b6373 = countAverageRGB([icb[1][3], icb[1][4]]);
    const b6373Cl = `rgb(${b6373.r},${b6373.g},${b6373.b})`;
    const b6474 = countAverageRGB([icb[1][4], icb[0][4]]);
    const b6474Cl = `rgb(${b6474.r},${b6474.g},${b6474.b})`;

    return {
      b00: rgbToHex(
        b00Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      bigcol1: rgbToHex(
        bC1Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      bigcol2: rgbToHex(
        bC2Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      b10: rgbToHex(
        b1020Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      b20: rgbToHex(
        b30Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      b30: rgbToHex(
        b40Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      b4041: rgbToHex(
        b5051Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      b4243: rgbToHex(
        b5253Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      b44: rgbToHex(
        b54Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      b5051: rgbToHex(
        b60617071Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      b52: rgbToHex(
        b6272Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      b53: rgbToHex(
        b6373Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      b54: rgbToHex(
        b6474Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
    };
  }

  function getBelow767Above478(phImage, rows, columns) {
    const icb = getAverageRGB(phImage, rows, columns);
    const b00Cl = `rgb(${icb[14][0].r},${icb[14][0].g},${icb[14][0].b})`;
    const b01Cl = `rgb(${icb[14][1].r},${icb[14][1].g},${icb[14][1].b})`;
    const b10Cl = `rgb(${icb[13][0].r},${icb[13][0].g},${icb[13][0].b})`;
    const b11Cl = `rgb(${icb[13][1].r},${icb[13][1].g},${icb[13][1].b})`;

    const bC1 = countAverageRGB([
      icb[12][0],
      icb[12][1],
      icb[11][0],
      icb[11][1],
      icb[10][0],
      icb[10][1],
      icb[9][0],
      icb[9][1],
    ]);
    const bC1Cl = `rgb(${bC1.r},${bC1.g},${bC1.b})`;
    const bC2 = countAverageRGB([
      icb[8][0],
      icb[8][1],
      icb[7][0],
      icb[7][1],
      icb[6][0],
      icb[6][1],
      icb[5][0],
      icb[5][1],
    ]);
    const bC2Cl = `rgb(${bC2.r},${bC2.g},${bC2.b})`;
    const b100101 = countAverageRGB([icb[4][0], icb[4][1]]);
    const b100101Cl = `rgb(${b100101.r},${b100101.g},${b100101.b})`;
    const b110111 = countAverageRGB([icb[3][0], icb[3][1]]);
    const b110111Cl = `rgb(${b110111.r},${b110111.g},${b110111.b})`;
    const b120121 = countAverageRGB([icb[2][0], icb[2][1]]);
    const b120121Cl = `rgb(${b120121.r},${b120121.g},${b120121.b})`;
    const b130Cl = `rgb(${icb[1][0].r},${icb[1][0].g},${icb[1][0].b})`;
    const b131Cl = `rgb(${icb[1][1].r},${icb[1][1].g},${icb[1][1].b})`;
    const b140Cl = `rgb(${icb[0][0].r},${icb[0][0].g},${icb[0][0].b})`;
    const b141Cl = `rgb(${icb[0][1].r},${icb[0][1].g},${icb[0][1].b})`;

    return {
      col2b11: rgbToHex(
        b00Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col2b21: rgbToHex(
        b01Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col2b12: rgbToHex(
        b10Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col2b22: rgbToHex(
        b11Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col2b13: rgbToHex(
        bC1Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col2b14: rgbToHex(
        bC2Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col2b15: rgbToHex(
        b100101Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col2b16: rgbToHex(
        b110111Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col2b17: rgbToHex(
        b120121Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col2b18: rgbToHex(
        b130Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col2b28: rgbToHex(
        b131Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col2b19: rgbToHex(
        b140Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col2b29: rgbToHex(
        b141Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
    };
  }

  function getBelow478(phImage, rows, columns) {
    const icb = getAverageRGB(phImage, rows, columns);
    const b00Cl = `rgb(${icb[20][0].r},${icb[20][0].g},${icb[20][0].b})`;
    const b1020 = countAverageRGB([icb[19][0], icb[18][0]]);
    const b1020Cl = `rgb(${b1020.r},${b1020.g},${b1020.b})`;
    const b30Cl = `rgb(${icb[17][0].r},${icb[17][0].g},${icb[17][0].b})`;
    const b40Cl = `rgb(${icb[16][0].r},${icb[16][0].g},${icb[16][0].b})`;
    const b50607080 = countAverageRGB([
      icb[15][0],
      icb[14][0],
      icb[13][0],
      icb[12][0],
    ]);
    const b50607080Cl = `rgb(${b50607080.r},${b50607080.g},${b50607080.b})`;
    const b90100110120 = countAverageRGB([
      icb[11][0],
      icb[10][0],
      icb[9][0],
      icb[8][0],
    ]);
    const b90100110120Cl = `rgb(${b90100110120.r},${b90100110120.g},${b90100110120.b})`;
    const b130Cl = `rgb(${icb[7][0].r},${icb[7][0].g},${icb[7][0].b})`;
    const b140Cl = `rgb(${icb[6][0].r},${icb[6][0].g},${icb[6][0].b})`;
    const b150Cl = `rgb(${icb[5][0].r},${icb[5][0].g},${icb[5][0].b})`;
    const b160170 = countAverageRGB([icb[4][0], icb[3][0]]);
    const b160170Cl = `rgb(${b160170.r},${b160170.g},${b160170.b})`;
    const b180Cl = `rgb(${icb[2][0].r},${icb[2][0].g},${icb[2][0].b})`;
    const b190Cl = `rgb(${icb[1][0].r},${icb[1][0].g},${icb[1][0].b})`;
    const b200Cl = `rgb(${icb[0][0].r},${icb[0][0].g},${icb[0][0].b})`;

    return {
      col1b11: rgbToHex(
        b00Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col1b12: rgbToHex(
        b1020Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col1b13: rgbToHex(
        b30Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col1b14: rgbToHex(
        b40Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col1b15: rgbToHex(
        b50607080Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col1b16: rgbToHex(
        b90100110120Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col1b17: rgbToHex(
        b130Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col1b18: rgbToHex(
        b140Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col1b19: rgbToHex(
        b150Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col1b110: rgbToHex(
        b160170Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col1b111: rgbToHex(
        b180Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col1b112: rgbToHex(
        b190Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
      col1b113: rgbToHex(
        b200Cl
          .replace('rgb(', '')
          .replace(')', '')
          .split(',')
          .map((c) => +c)
      ),
    };
  }

  const updateUploadedFiles = async (files: any) => {
    setNewUserInfo({ ...newUserInfo, images: files });

    const imageStr = (await fileToBase64(files[0])) as string;

    const phImage = document.createElement('img');
    phImage.crossOrigin = 'Anonymous';
    phImage.src = imageStr;

    phImage.onload = function () {
      getBelow991AndAbove767(phImage, 8, 5);
      const a991 = getAbove991(phImage, 6, 5);
      const b767 = getBelow767Above478(phImage, 15, 2);
      const b478 = getBelow478(phImage, 21, 1);

      const result = [{ a991, b767, b478 }];

      setFinalResult(JSON.stringify(result));
    };
  };

  return (
    <div className='main_wrapper'>
      <h2>GET AVERAGE COLOR STRING OF IMAGE</h2>

      <FileUpload
        accept='.jpg,.png,.jpeg'
        label='UPLOAD IMAGE'
        multiple={false}
        updateFilesCb={updateUploadedFiles}
      />

      <p>COLOR STRING OUTPUT</p>
      <div className='result-wrapper'>
        <p>{finalResult}</p>
      </div>
    </div>
  );
};

export default App;
