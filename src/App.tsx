import "./styles.css";
import InkImg from "./ink.jpg";
import BgImg from "./ft.png";
import { useEffect, useRef } from "react";

export default function App() {
  const canvasEle = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasEle.current) {
      const WIDTH = 4096;
      const HEIGHT = 4096;
      const width = 512;
      const height = 512;
      canvasEle.current.width = width;
      canvasEle.current.height = height;
      const ctx = canvasEle.current.getContext("2d");
      const bg = new Image(WIDTH, HEIGHT);
      const ft = new Image(width, height);
      bg.src = InkImg;
      ft.src = BgImg;
      const setPosition = (x: number, y: number) => {
        if (!ctx) return;
        ctx.save();
        ctx.drawImage(
          bg,
          x * width,
          HEIGHT - height - y * height,
          width,
          height,
          0,
          0,
          width,
          height
        );

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        if (data) {
          for (var i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            // 将高亮位置设置成透明通道
            if ([r, g, b].every((v) => v < 256 && v > 240)) {
              data[i + 3] = 0;
            }
          }
          ctx?.putImageData(imageData, 0, 0);
        }
        ctx.globalCompositeOperation = "source-in";
        ctx.drawImage(ft, 0, 0);
        ctx.restore();
        // 遍历图源位置信息
        if (x === 7) {
          if (y === 7) y = 0;
          else y++;
          x = 0;
        } else x++;

        setTimeout(() => {
          setPosition(x, y);
        }, 100);
      };
      bg.onload = () => {
        setPosition(0, 0);
      };
    }
  });

  return (
    <div className="App">
      <canvas ref={canvasEle} />
    </div>
  );
}
