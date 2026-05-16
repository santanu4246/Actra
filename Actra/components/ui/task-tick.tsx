import Svg, { Path } from "react-native-svg";

const VIEW_W = 24;
const VIEW_H = 21;
const HOME_GREEN = "#24bf55";

const D_OUTER =
  "M0.853984 12.1467C0.741767 12.2587 0.652743 12.3918 0.592003 12.5383C0.531264 12.6848 0.5 12.8419 0.5 13.0005C0.5 13.1591 0.531264 13.3161 0.592003 13.4626C0.652743 13.6091 0.741767 13.7422 0.853984 13.8543L6.64587 19.6473C7.11786 20.1182 7.8815 20.1182 8.35349 19.6473L23.1466 4.85309C23.3729 4.62679 23.5 4.31987 23.5 3.99984C23.5 3.6798 23.3729 3.37288 23.1466 3.14658L20.8534 0.853427C20.6271 0.627131 20.3202 0.5 20.0002 0.5C19.6801 0.5 19.3732 0.627131 19.1469 0.853427L7.49968 12.5007L4.85365 9.85351C4.62716 9.62714 4.32005 9.49998 3.99984 9.49998C3.67962 9.49998 3.37251 9.62714 3.14603 9.85351L0.853984 12.1467Z";

const D_INNER =
  "M7.49934 16.0014L21.7514 1.75042L20.8508 0.84986C20.6244 0.623497 20.3172 0.496338 19.997 0.496338C19.6768 0.496338 19.3697 0.623497 19.1432 0.84986L7.49934 12.5004L4.8533 9.85328C4.74123 9.74106 4.60814 9.65204 4.46163 9.5913C4.31513 9.53056 4.15809 9.4993 3.99949 9.4993C3.8409 9.4993 3.68386 9.53056 3.53735 9.5913C3.39085 9.65204 3.25775 9.74106 3.14568 9.85328L2.24512 10.7538L7.49934 16.0014Z";

type TaskTickProps = {
  size?: number;
};

export function TaskTickGreen({ size = 24 }: TaskTickProps) {
  const h = (size * VIEW_H) / VIEW_W;
  return (
    <Svg width={size} height={h} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} fill="none">
      <Path d={D_OUTER} fill={HOME_GREEN} />
      <Path d={D_INNER} fill={HOME_GREEN} />
      <Path
        d={D_OUTER}
        stroke="#191919"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function TaskTickBlue({ size = 24 }: TaskTickProps) {
  const h = (size * VIEW_H) / VIEW_W;
  return (
    <Svg width={size} height={h} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} fill="none">
      <Path d={D_OUTER} fill="#3A85FF" />
      <Path d={D_INNER} fill="#A0C4FF" />
      <Path
        d={D_OUTER}
        stroke="#191919"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function SparkIcon({ size = 16, color = "#222222" }: { size?: number, color?: string }) {
  const viewBoxW = 9;
  const viewBoxH = 11;
  const w = size;
  const h = (size * viewBoxH) / viewBoxW;
  return (
    <Svg width={w} height={h} viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} fill="none">
      <Path d="M2.19441 5.73987H1.9458C1.14212 5.73987 0.740272 5.73987 0.568986 5.47488C0.3977 5.20995 0.560904 4.84081 0.887313 4.10253L1.86862 1.883C2.16539 1.21175 2.31378 0.876122 2.60165 0.688061C2.88952 0.5 3.25486 0.5 3.98562 0.5H5.11738C6.00507 0.5 6.44891 0.5 6.61628 0.789981C6.78371 1.07996 6.56352 1.46735 6.12309 2.24212L5.54248 3.26352C5.32354 3.64868 5.21407 3.84127 5.21559 3.99891C5.21759 4.20378 5.32652 4.39253 5.50251 4.49588C5.63792 4.57545 5.85854 4.57545 6.29984 4.57545C6.8577 4.57545 7.13666 4.57545 7.28194 4.67203C7.47065 4.79748 7.56945 5.02194 7.53484 5.24673C7.50819 5.41974 7.32056 5.6272 6.94529 6.04217L3.94711 9.3575C3.35821 10.0087 3.06376 10.3343 2.86604 10.2313C2.66831 10.1282 2.76326 9.69869 2.95315 8.83961L3.32517 7.15687C3.46974 6.50275 3.54205 6.17569 3.36818 5.95778C3.1943 5.73987 2.861 5.73987 2.19441 5.73987Z" stroke={color} strokeLinejoin="round"/>
    </Svg>
  );
}
