export default function ChevronSort({ class: klass }) {
  return (
    <svg
      class={klass}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 10 16"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 5 5 1 1 5m0 6 4 4 4-4"
      />
    </svg>
  );
}
