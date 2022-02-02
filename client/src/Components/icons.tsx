import Icon from "@ant-design/icons";

export const iconSelector = (exerciseType: string): (() => JSX.Element) => {
  let icon: () => JSX.Element;
  if (exerciseType === "push-ups") {
    icon = () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        width="25.000000pt"
        height="15.000000pt"
        viewBox="0 0 216.000000 105.000000"
        preserveAspectRatio="xMidYMid meet">
        {" "}
        <g transform="translate(0.000000,105.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
          {" "}
          <path
            fill="currentColor"
            d="M356 782 c-43 -25 -59 -43 -79 -88 -17 -38 -18 -43 -2 -80 22 -53 50 -80 101 -100 41 -16 44 -16 85 7 45 25 59 46 79 114 16 55 -6 106 -60 140 -46 29 -83 31 -124 7z"
          />{" "}
          <path
            fill="currentColor"
            d="M637 688 c-47 -28 -82 -86 -73 -119 9 -36 33 -62 57 -63 17 -1 26 -13 42 -59 21 -57 21 -58 2 -95 -21 -40 -64 -99 -108 -147 -30 -32 -43 -66 -34 -89 9 -24 54 -48 76 -41 22 7 158 181 179 228 14 34 16 113 2 122 -5 3 -10 13 -10 22 0 8 -6 29 -14 46 -8 18 -24 53 -36 80 -11 26 -25 47 -30 47 -6 0 -10 7 -10 15 0 8 7 15 15 15 35 0 97 -92 117 -171 12 -49 17 -56 58 -76 25 -13 52 -23 60 -23 8 0 24 -7 34 -15 11 -8 28 -15 38 -15 9 0 32 -6 50 -14 18 -8 60 -22 93 -31 33 -10 67 -21 76 -26 58 -28 229 -96 274 -109 28 -8 46 -14 135 -45 19 -7 68 -23 109 -35 72 -23 75 -23 107 -5 44 24 58 63 36 106 -14 28 -27 36 -82 52 -36 10 -78 23 -95 29 -16 5 -43 13 -60 18 -28 8 -52 16 -135 45 -19 7 -68 27 -109 44 -40 17 -79 31 -85 31 -16 0 -66 48 -66 64 0 15 -35 41 -90 67 -95 45 -171 79 -179 79 -5 0 -22 6 -38 14 -40 20 -89 36 -158 51 -33 7 -71 16 -85 19 -17 4 -38 -1 -63 -16z m13 -58 c0 -5 -7 -10 -15 -10 -8 0 -15 5 -15 10 0 6 7 10 15 10 8 0 15 -4 15 -10z"
          />{" "}
        </g>{" "}
      </svg>
    );
  } else if (exerciseType === "squats") {
    icon = () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        width="15.000000pt"
        height="25.000000pt"
        viewBox="0 0 138.000000 180.000000"
        preserveAspectRatio="xMidYMid meet">
        {" "}
        <g transform="translate(0.000000,180.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
          {" "}
          <path
            fill="currentColor"
            d="M748 1622 c-51 -34 -72 -71 -72 -129 0 -46 4 -57 34 -88 32 -33 37 -35 102 -35 64 0 69 2 103 35 35 35 41 56 36 120 -7 86 -130 145 -203 97z"
          />{" "}
          <path
            fill="currentColor"
            d="M795 1318 c-11 -6 -25 -18 -31 -26 -8 -11 -56 -14 -268 -13 -257 2 -257 2 -276 -21 -25 -29 -25 -54 -1 -79 19 -21 27 -21 303 -17 254 3 286 5 311 22 34 23 37 61 5 70 -16 4 -20 8 -12 16 15 15 44 1 55 -27 15 -40 10 -68 -16 -93 -21 -20 -31 -22 -84 -17 -55 5 -61 3 -67 -16 -4 -11 -3 -93 1 -181 l7 -161 -64 -45 c-211 -148 -214 -186 -46 -513 58 -112 100 -133 157 -76 39 39 39 65 0 131 -17 29 -34 60 -39 68 -5 8 -25 44 -44 80 -33 62 -33 67 -18 86 10 11 35 27 57 36 22 9 47 19 55 22 8 4 29 15 45 26 17 11 37 23 45 27 8 3 29 22 46 41 48 52 59 147 46 385 -11 181 -12 190 -38 224 -15 19 -42 41 -60 49 -40 17 -43 17 -69 2z"
          />{" "}
        </g>{" "}
      </svg>
    );
  } else if (exerciseType === "lunges") {
    icon = () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        width="15.000000pt"
        height="25.000000pt"
        viewBox="0 0 156.000000 192.000000"
        preserveAspectRatio="xMidYMid meet">
        {" "}
        <g transform="translate(0.000000,192.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
          {" "}
          <path
            fill="currentColor"
            d="M803 1832 c-38 -21 -83 -86 -83 -123 0 -39 22 -85 52 -109 23 -18 38 -20 100 -18 l72 3 33 43 c20 27 33 55 33 73 0 64 -86 150 -148 148 -15 0 -41 -8 -59 -17z"
          />{" "}
          <path
            fill="currentColor"
            d="M805 1532 c-36 -21 -56 -46 -72 -92 -19 -53 -16 -65 22 -86 44 -23 55 -14 66 57 8 53 31 89 57 89 12 0 12 -3 0 -22 -8 -13 -17 -57 -21 -98 -7 -91 -13 -110 -38 -110 -19 0 -71 31 -94 56 -5 6 -29 25 -52 43 l-43 32 -25 -25 c-14 -14 -25 -33 -25 -43 1 -18 79 -83 100 -83 5 0 10 -4 10 -8 0 -4 12 -13 28 -20 38 -16 114 -62 131 -79 7 -8 20 -12 27 -9 8 3 21 9 29 12 9 4 15 1 15 -7 0 -26 -16 -40 -51 -45 -27 -5 -40 -1 -64 21 -16 15 -41 34 -53 42 -32 22 -42 6 -42 -75 0 -67 -15 -101 -60 -137 -13 -11 -73 -62 -132 -113 -105 -91 -108 -94 -108 -135 0 -23 -4 -58 -10 -77 -5 -19 -14 -82 -19 -140 -6 -58 -13 -119 -17 -137 -5 -27 -2 -37 25 -64 28 -27 37 -31 68 -26 48 8 67 38 74 117 3 36 12 116 19 178 l14 113 46 37 c25 20 74 65 109 99 36 35 68 63 73 63 4 0 22 -30 39 -67 87 -191 88 -191 254 -361 88 -90 168 -168 179 -174 30 -16 80 -1 99 31 9 16 17 39 17 51 0 15 -53 77 -167 194 -160 163 -170 176 -200 251 -49 122 -66 207 -56 290 4 39 6 77 4 85 -9 49 -6 210 6 244 15 44 14 45 -49 109 -42 41 -67 45 -113 19z"
          />{" "}
          <path
            fill="currentColor"
            d="M426 1375 c-29 -45 -23 -55 73 -119 29 -20 55 -36 58 -36 3 0 22 -13 43 -30 38 -30 74 -39 85 -20 10 16 -4 47 -23 54 -55 20 -95 62 -97 102 -2 64 -105 101 -139 49z"
          />{" "}
        </g>{" "}
      </svg>
    );
  } else if (exerciseType === "jumping-jacks") {
    icon = () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        width="15.000000pt"
        height="25.000000pt"
        viewBox="0 0 50.000000 73.000000"
        preserveAspectRatio="xMidYMid meet">
        {" "}
        <g transform="translate(0.000000,73.000000) scale(0.050000,-0.050000)" fill="#000000" stroke="none">
          {" "}
          <path
            fill="currentColor"
            d="M268 1333 c-15 -40 42 -235 106 -362 l51 -100 -14 -376 -14 -375 49 0 c57 0 73 63 74 279 0 197 37 122 44 -89 6 -177 7 -180 56 -180 57 0 55 -27 39 490 -8 261 -7 273 44 371 74 141 127 327 100 354 -35 35 -77 -17 -103 -124 -60 -250 -239 -251 -326 -2 -44 128 -84 171 -106 114z"
          />{" "}
          <path
            fill="currentColor"
            d="M480 1220 c-68 -68 -27 -148 71 -137 73 9 97 107 37 151 -48 35 -61 33 -108 -14z"
          />{" "}
        </g>{" "}
      </svg>
    );
  } else if (exerciseType === "side-squats") {
    icon = () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        width="15.000000pt"
        height="25.000000pt"
        viewBox="0 0 43.000000 68.000000"
        preserveAspectRatio="xMidYMid meet">
        {" "}
        <g transform="translate(0.000000,68.000000) scale(0.050000,-0.050000)" fill="#000000" stroke="none">
          {" "}
          <path
            fill="currentColor"
            d="M405 1287 c-89 -36 -64 -167 32 -167 99 0 137 83 66 147 -37 34 -54 37 -98 20z"
          />{" "}
          <path
            fill="currentColor"
            d="M282 1048 c-90 -114 -92 -158 -15 -254 l72 -87 -87 -244 c-75 -211 -84 -249 -59 -273 50 -51 85 -10 162 192 92 242 83 242 176 -4 77 -206 110 -246 161 -195 34 35 -122 517 -168 517 -41 0 -50 55 -16 104 18 24 32 65 32 90 0 51 30 62 46 18 6 -15 -11 -58 -37 -94 -62 -83 -33 -128 38 -61 103 97 98 248 -12 316 -63 39 -255 23 -293 -25z m93 -243 c27 -52 29 -69 8 -90 -20 -20 -23 -18 -12 9 7 21 -4 58 -29 93 -44 62 -53 106 -27 132 8 8 18 -6 21 -32 3 -26 21 -76 39 -112z"
          />{" "}
        </g>{" "}
      </svg>
    );
  }
  const IconComponent = () => <Icon component={icon} />;
  return IconComponent;
};
