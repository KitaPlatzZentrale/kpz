import { useTheme } from "@mui/joy";

const KitaMarkerInner = () => {
  const { palette } = useTheme();

  return (
    <div className="cursor-pointer transition-all ease-in-out hover:scale-[115%]">
      <svg
        width="28"
        height="42"
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="black"
          stroke="black"
          strokeOpacity={0.5}
          opacity={0.25}
          transform="translate(7, 32)"
          // round circle thats tilted so its fully visible in the viewport despite being at position 28 of 33
          // make the circle very small, not more than 3 px
          d="M 0 0 A 5 3 0 1 1 0 0.0001 Z"
        />
        <path
          d="M0.832031 12.0002C0.832031 5.82631 5.82484 0.833496 11.9987 0.833496C18.1726 0.833496 23.1654 5.82631 23.1654 12.0002C23.1654 15.3304 21.3878 19.3632 19.1755 23.0733C16.9757 26.7623 14.3983 30.0479 12.8973 31.8642C12.4305 32.4234 11.5832 32.4233 11.1166 31.8639C9.60788 30.0485 7.02598 26.7625 4.82387 23.0731C2.60953 19.3631 0.832031 15.3303 0.832031 12.0002ZM7.33203 12.0002C7.33203 14.5763 9.42255 16.6668 11.9987 16.6668C14.5748 16.6668 16.6654 14.5763 16.6654 12.0002C16.6654 9.42402 14.5748 7.3335 11.9987 7.3335C9.42255 7.3335 7.33203 9.42402 7.33203 12.0002Z"
          fill={palette.primary[700]}
          stroke={palette.neutral[900]}
          strokeOpacity={0.7}
          strokeWidth={0.8}
        />
        {/** add little hover shadow at the very bottom of the pin (path above) so it seems the pin positioned on the map casts a shadow */}
      </svg>
    </div>
  );
};

export default KitaMarkerInner;
