interface MediumCategoryArrayDatatype {
  text: (fileSize: number) => string;
  svg: React.ReactElement | null;
  design: string;
}

export const mediumCategoryArray: MediumCategoryArrayDatatype[] = [
  {
    text: () => "Maximale Dateigröße: 40 MB",
    svg: null,
    design: "",
  },
  {
    text: (fileSize) =>
      "Die ausgewählte Datei ist " +
      String(fileSize).slice(0, 1) +
      "." +
      String(fileSize).slice(1, 3) +
      "MB groß und klein genug.",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="w-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m4.5 12.75 6 6 9-13.5"
        />
      </svg>
    ),
    design: "bg-gray-50 text-green-600",
  },
  {
    text: (fileSize) =>
      "Die ausgewählte Datei ist " +
      String(fileSize).slice(0, 2) +
      "." +
      String(fileSize).slice(2, 3) +
      "MB groß. Das Hochladen kann einen Moment dauern.",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="w-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m4.5 12.75 6 6 9-13.5"
        />
      </svg>
    ),
    design: "bg-gray-50 text-green-600",
  },
  {
    text: (fileSize) =>
      "Die ausgewählte Datei ist " +
      String(fileSize).slice(0, 2) +
      "." +
      String(fileSize).slice(2, 3) +
      "MB groß und liegt innerhalb des erlaubten Limits. Das Hochladen kann einen Moment dauern.",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="w-7"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>
    ),
    design: "bg-yellow-200 text-black",
  },
  {
    text: (fileSize) =>
      "Die ausgewählte Datei ist " +
      String(fileSize).slice(0, 2) +
      "." +
      String(fileSize).slice(2, 3) +
      "MB groß und überschreitet das Limit von 40 MB.",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="w-7"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    ),
    design: "bg-gray-50 text-red-600",
  },
];
